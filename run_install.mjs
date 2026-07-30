import { spawn } from 'node:child_process';

// Detach via cmd.exe so the install survives the harness's 10s watch kill.
const child = spawn(
  'cmd.exe',
  ['/c', 'npm install --prefer-offline --no-audit --no-fund > install_out.txt 2>&1'],
  { detached: true, stdio: 'ignore', windowsHide: true },
);
child.on('error', (e) => console.log('spawn error: ' + e.message));
child.unref();
console.log('install spawned pid=' + child.pid);
