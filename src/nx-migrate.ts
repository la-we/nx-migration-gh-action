import {exec} from '@actions/exec'
import fs from 'fs'
import * as path from 'path'

export async function migrate(keepMigrationsFile: boolean, cwd: string): Promise<void> {
  await exec('npx nx migrate latest', [], {
    env: {
      ...process.env,
      npm_config_yes: String(true)
    },
    cwd: cwd
  })
  
  await exec('npm install' , [], {cwd: cwd})
  
  await exec(
    'npx nx migrate --run-migrations=migrations.json',
    [],
    {
      env: {
        ...process.env,
        npm_config_yes: String(true),
        NX_MIGRATE_SKIP_INSTALL: String(true)
      },
      cwd: cwd
    }
  )
  // sometimes migrations change packages without installing them, so naivly install dependencies here again
  await exec('npm install --package-lock-only', [], {cwd: cwd})

  if (!keepMigrationsFile) {
    const migrationsPath = path.resolve(cwd, 'migrations.json')
    fs.rmSync(migrationsPath)
  }

  await exec('bash', [
    '-c',
    '(git add . :!nuget.config && git commit --no-verify -m "chore: [nx migration] changes")'
  ], {cwd: cwd})
}
