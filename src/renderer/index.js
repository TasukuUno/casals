import {webFrame} from 'electron';

import './css/index.js';
import './libs/contextmenu';
import './libs/externalLinks';
import {$} from './libs/dom';

import Config, {CONFIG_EVENT} from './libs/Config';
import Player, {PLAYER_EVENT} from './libs/Player';

const config = new Config({
  tracks: $('#tracks'),
  button: $('#add'),
});

const player = new Player({
  audio: $('#audio'),
  setFrom: $('#setFrom'),
  timeRangeFrom: $('#timeRangeFrom'),
  timeRangeTo: $('#timeRangeTo'),
  setTo: $('#setTo'),
  playbackRate: $('#playbackRate'),
  loop: $('#loop'),
});

const webview = $('#webview');
config.on(CONFIG_EVENT.UPDATE, (updates) => {
  const currentAudio = config.getCurrentAudio();
  const currentView = config.getCurrentView();

  if ('configs' in updates || 'trackIndex' in updates) {
    currentAudio && player.setURL(currentAudio);
    currentView && (webview.src = currentView);
  }

  currentView && (webview.src = currentView);
});

player.on(PLAYER_EVENT.ENDED, () => {
  config.next();
  setTimeout(() => {
    player.play();
  }, 200);
});

let keyBindDisabled = false;
window.addEventListener('focus', (e) => {
  const tagName = e.target && e.target.tagName || '';
  keyBindDisabled = ['WEBVIEW', 'INPUT', 'SELECT', 'BUTTON'].includes(tagName);
}, true);

window.addEventListener('blur', (e) => {
  if (!keyBindDisabled) {
    return;
  }
  const tagName = e.target && e.target.tagName || '';
  keyBindDisabled = !['WEBVIEW', 'INPUT', 'SELECT', 'BUTTON'].includes(tagName);
}, true);

window.addEventListener('keydown', (e) => {
  const {code} = e;
  if (keyBindDisabled) {
    return;
  }
  switch (code) {
    case 'Space':
      player.toggle();
      break;
    case 'ArrowLeft':
      config.nextView(true);
      break;
    case 'ArrowRight':
      config.nextView(false);
      break;
  }
}, true);

webFrame.registerURLSchemeAsPrivileged('casals');
