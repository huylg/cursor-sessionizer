import { window } from 'vscode'
import * as cp from 'child_process'
import { getConfig } from './config'

const isDefined = <T>(some: T | undefined): some is T => !!some

export async function showSessionPicker() {
  const config = getConfig()
  if (!config.valid) {
    window.showQuickPick([], {
      placeHolder: config.error,
    })
    return
  }
  const sessionRoots = config.values.sessionRoots
  if (sessionRoots.length === 0) {
    const error =
      'No session roots. Please specify using the sessionizer.sessionRoots setting.'
    window.showQuickPick([], {
      placeHolder: error,
    })
    return
  }
  cp.exec(
    `find ${sessionRoots.join(' ')} -mindepth 1 -maxdepth 1 -type d`,
    async (err, stdout, stderr) => {
      const sessions = stdout
        .split(/\r?\n/)
        .map((sessionPath) => {
          const pathArr = sessionPath.split('/')
          const session = pathArr.at(-1)
          const parent = pathArr.at(-2)
          if (!session) return
          return {
            path: sessionPath,
            label: `${parent ? `${parent}/` : ''}${session}`,
            // TODO: toggle with a setting
            // detail: sessionPath,
          }
        })
        .filter(isDefined)
      if (err || stderr) {
        window.showErrorMessage('error: ' + err || stderr)
        return
      }
      const result = await window.showQuickPick(sessions, {
        placeHolder: `Select a project`,
      })
      if (result) {
        cp.exec(
          `cursor -n ${result.path}`,
          (err, _, stderr) => {
            if (err || stderr) {
              window.showErrorMessage('error: ' + err || stderr)
            }
          }
        )
      }
    }
  )
}
