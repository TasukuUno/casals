import {EventEmitter} from 'events';
import path from 'path';
window.path = path;

export const CONFIG_EVENT = {
  UPDATE: 'Config.UPDATE',
};

class Config extends EventEmitter {
  constructor({tracks, button}) {
    super();
    this.tracks = tracks;
    this.index = 0;
    setTimeout(() => this.load(), 1);
    button.addEventListener('click', this.select.bind(this));
    tracks.addEventListener('change', () => this.setIndex(tracks.value * 1));
  }

  select() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const json = fileReader.result;
        try {
          this.update(JSON.parse(json), file);
        } catch (e) {
          // do nothing
        }
      };
      fileReader.readAsText(file);
    });
    input.click();
  }

  update(configs, file) {
    if (Array.isArray(configs)) {
      const base = path.parse(file.path).dir;
      configs = configs.map((config) => {
        return {
          name: config.name,
          view: config.view.indexOf('http') === 0 ? config.view : path.resolve(base, config.view),
          audio: path.resolve(base, config.audio),
        };
      });
      this.configs = configs;
      localStorage.setItem('configs', JSON.stringify(configs));
      this.emit(CONFIG_EVENT.UPDATE, {index: 0, configs});
      this.options(configs);
    }
  }

  load() {
    const configs = this.configs = JSON.parse(localStorage.getItem('configs')) || [];
    this.emit(CONFIG_EVENT.UPDATE, {index: 0, configs});
    this.options(configs);
  }

  options(configs) {
    this.tracks.innerHTML = '';
    configs.forEach((config, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = config.name;
      this.tracks.appendChild(option);
    });
  }

  setIndex(index, alsoSetToTracks = false) {
    if (!this.configs[index]) {
      return;
    }
    this.index = index;
    this.emit(CONFIG_EVENT.UPDATE, {index: index, configs: this.configs});

    if (alsoSetToTracks) {
      this.tracks.value = `${index}`;
    }
  }

  next() {
    if (this.configs[this.index + 1]) {
      this.setIndex(this.index + 1, true);
    } else {
      this.setIndex(0, true);
    }
  }
}

export default Config;
