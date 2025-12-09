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
        const allSessions: Array<{ path: string; label: string }> = []
        
        for (const root of sessionRoots) {
          // Check if it's a vscode-remote URL - just add it directly without globbing
          if (root.startsWith('vscode-remote://')) {
            allSessions.push({
              path: root,
              label: root,
            })
          } else {
            // Regular path - use glob to find matching files/directories
            const matches = await glob(root)
            allSessions.push(...matches.map((path) => ({
              path,
              label: path,
            })))
          }
        }

        const result = await window.showQuickPick(allSessions, {
          placeHolder: `Select a project`,
        })

        if (result) {
          // Use Uri.parse for remote URLs, Uri.file for regular paths
          const uri = result.path.startsWith('vscode-remote://')
            ? Uri.parse(result.path)
            : Uri.file(result.path)
          await commands.executeCommand('vscode.openFolder', uri, true)
        }
      } catch (err) {
        window.showErrorMessage('error: ' + (err instanceof Error ? err.message : String(err)))
      }
    })
  )
}
