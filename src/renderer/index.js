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

config.on(CONFIG_EVENT.UPDATE, ({index, configs}) => {
  if (!configs[index]) {
    return;
  }

  webview.src = configs[index].view;
  player.setURL(configs[index].audio);
});

player.on(PLAYER_EVENT.ENDED, () => {
  config.next();
  setTimeout(() => {
    player.play();
  }, 200);
});

window.addEventListener('keydown', (e) => {
  const {code} = e;
  if (code === 'Space') {
    player.toggle();
  }
}, true);

webFrame.registerURLSchemeAsPrivileged('casals');
