import { ExtensionContext, window, commands, Uri, workspace, FileType } from 'vscode'
import { getConfig } from './config'

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
          const rootUri = Uri.file(root.replace(/\/\*$/, ''))
          const entries = await workspace.fs.readDirectory(rootUri)

          for (const [name, type] of entries) {
            if (type === FileType.Directory) {
              const sessionPath = `${rootUri.fsPath}/${name}`
              const pathArr = sessionPath.split('/')
              const session = pathArr.at(-1)
              const parent = pathArr.at(-2)
              if (session) {
                allSessions.push({
                  path: sessionPath,
                  label: `${parent ? `${parent}/` : ''}${session}`,
                })
              }
            }
          }
        }

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
