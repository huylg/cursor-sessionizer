import { commands, ExtensionContext } from 'vscode'
import { showSessionPicker } from './sessionizer'

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('sessionizer.open', async () => {
      showSessionPicker()
    })
  )
}
