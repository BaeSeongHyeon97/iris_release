const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  /*
  * 넓이 1152에 높이 720의 FHD 풀스크린 앱을 실행시킵니다.
  * */
  mainWindow = new BrowserWindow({
    width: 1152,
    height: 720,
    icon: path.join(__dirname, './irisfavicon.ico')
  });

  /*
  * ELECTRON_START_URL을 직접 제공할경우 해당 URL을 로드합니다.
  * 만일 URL을 따로 지정하지 않을경우 (프로덕션빌드) React 앱이
  * 빌드되는 build 폴더의 index.html 파일을 로드합니다.
  * */
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  /*
  * startUrl에 배정되는 url을 맨 위에서 생성한 BrowserWindow에서 실행시킵니다.
  * */
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // ipcMain에서 closeApp 이벤트를 받을 때의 처리
  ipcMain.on('closeApp', () => {
    mainWindow.close();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});