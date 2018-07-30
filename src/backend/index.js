// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import {app, Menu} from 'electron';
import {devMenuTemplate} from './libs/menu/dev_menu_template';
import {editMenuTemplate} from './libs/menu/edit_menu_template';
import createWindow from './libs/window';
// import registerProtocol from './libs/protocol';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from 'env';

const setApplicationMenu = () => {
  const menus = [editMenuTemplate, devMenuTemplate];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
}

app.on('ready', () => {
  setApplicationMenu();
  // registerProtocol();

  const mainWindow = createWindow('main', {
    width: 960,
    height: 760,
    titleBarStyle: 'hidden',
    backgroundColor: '#fafafa',
    minWidth: 375,
    minHeight: 83,
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // mainWindow.openDevTools();
});

app.on('window-all-closed', () => {
  app.quit();
});
