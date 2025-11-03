import { ExtensionContext, window, commands, Uri } from 'vscode'
import { getConfig } from './config'
import { glob } from 'glob'

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('sessionizer.open', async () => {
      const config = getConfig()
      if (!config.valid) {
        window.showQuickPick([], {
          placeHolder: config.error,
        })
        return
      }
      const sessionRoots = config.values.sessionRoots
      try {
        
        const matches = await Promise.all(sessionRoots.map((root) => glob(root)))
        const allSessions: Array<{ path: string; label: string }> = matches.flat().map((path) => ({
          path,
          label: path,
        }))

        const result = await window.showQuickPick(allSessions, {
          placeHolder: `Select a project`,
        })

        if (result) {
          const uri = Uri.file(result.path)
          await commands.executeCommand('vscode.openFolder', uri, true)
        }
      } catch (err) {
        window.showErrorMessage('error: ' + (err instanceof Error ? err.message : String(err)))
      }
    })
  )
}
