import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

const isDev = process.env.SILO_DEV === 'true' || !app.isPackaged;
let serverProcess: ReturnType<typeof spawn> | null = null;

const WEB_PORT = 4000;
const DESKTOP_PORT = 4001;

async function startNextServer(): Promise<number> {
  const nextPath = path.join(__dirname, '../../web/.next/server.js');
  console.log('Starting Next.js server on port', DESKTOP_PORT);

  return new Promise((resolve) => {
    serverProcess = spawn(process.execPath, [nextPath], {
      cwd: path.join(__dirname, '../../web'),
      env: { ...process.env, PORT: String(DESKTOP_PORT) },
      stdio: 'inherit',
    });

    serverProcess.on('spawn', () => {
      console.log(`Next.js server started on port ${DESKTOP_PORT}`);
      resolve(DESKTOP_PORT);
    });

    setTimeout(() => resolve(DESKTOP_PORT), 5000);
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Silo',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const port = isDev ? WEB_PORT : await startNextServer();

  console.log(`Loading Silo from http://localhost:${port}`);
  win.loadURL(`http://localhost:${port}`);

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
