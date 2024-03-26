import fs from 'fs'
import latestVersion from 'latest-version'
import * as path from 'path'

export function getCurrentNxVersion(cwd: string): string {
  const packageJsonPath = path.resolve(cwd, 'package.json')
  const packageJson = fs.readFileSync(packageJsonPath, 'utf8')
  const packageObject = JSON.parse(packageJson)

  if (!('nx' in packageObject.devDependencies)) {
    throw new Error(
      'NX package can not be detected as dev dependency. Make sure you provided the correct package.json file and NX is installed.'
    )
  }

  return packageObject.devDependencies['nx'].replace(/[\^~]/, '')
}

export async function getLatestNxVersion(): Promise<string> {
  return await latestVersion('nx')
}
