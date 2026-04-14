import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CoworkerAgent } from '../agent/agent.js';
import { SYSTEM_PROMPT_CODE } from '../agent/prompt.js';
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config(); // TODO use builtin env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';
let mainWindow = null;
let agent = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
    });
    // If in development, load from disk or a server
    // For now, let's just load the build file
    if (isDev) {
        mainWindow.loadURL("http://localhost:5173");
    }
    else {
        console.log('THIS IS THE PATH:', path.join(__dirname, '../renderer/index.html'));
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.whenReady().then(() => {
    createWindow();
    agent = new CoworkerAgent({
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
        systemPrompt: SYSTEM_PROMPT_CODE,
    });
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
// IPC handler for user messages
ipcMain.handle('agent-chat', async (event, message) => {
    if (!agent)
        throw new Error('Agent not initialized');
    try {
        const response = await agent.chat(message, (update) => {
            // Send tool call updates or reasoning to the renderer
            mainWindow?.webContents.send('agent-update', update);
        });
        return response;
    }
    catch (error) {
        console.error('Agent error:', error);
        throw error;
    }
});
