// Launcher: runs npm install then vite from within skycop-clone
const { spawn, spawnSync } = require('child_process')
const path = require('path')

const cwd = path.join(__dirname, 'skycop-clone')

// Run npm install synchronously first (only installs missing packages, fast if up to date)
const install = spawnSync('cmd', ['/c', 'npm install'], { cwd, stdio: 'inherit', env: process.env })
if (install.status !== 0) process.exit(install.status || 1)

const viteBin = path.join(cwd, 'node_modules', 'vite', 'bin', 'vite.js')
const child = spawn(process.execPath, [viteBin, '--port', '5173'], {
  cwd,
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', code => process.exit(code || 0))
process.on('SIGTERM', () => child.kill())
process.on('SIGINT', () => child.kill())
