// Launcher: runs vite from within skycop-clone so CWD is correct
const { spawn } = require('child_process')
const path = require('path')

const cwd = path.join(__dirname, 'skycop-clone')
const viteBin = path.join(cwd, 'node_modules', 'vite', 'bin', 'vite.js')

const child = spawn(process.execPath, [viteBin, '--port', '5173'], {
  cwd,
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', code => process.exit(code || 0))
process.on('SIGTERM', () => child.kill())
process.on('SIGINT', () => child.kill())
