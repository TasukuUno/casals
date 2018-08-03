import {EventEmitter} from 'events';
import path from 'path';

export const CONFIG_EVENT = {
  UPDATE: 'Config.UPDATE',
};

class Config extends EventEmitter {
  constructor({tracks, button}) {
    super();
    this.$tracks = tracks;
    this.trackIndex = 0;
    this.viewIndex = 0;
    this.configs = [];
    setTimeout(() => this.load(), 1);
    button.addEventListener('click', this.select.bind(this));
    tracks.addEventListener('change', () => this.setTrackIndex(tracks.value * 1));
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
      const base = file && path.parse(file.path).dir;
      configs = configs.map((config) => {
        let view = Array.isArray(config.view) ? config.view : [config.view];
        view = view.map((item) => base && item.indexOf('http') === 0 ? item : path.resolve(base, item));
        const audio = base ? path.resolve(base, config.audio) : config.audio;
        return {
          name: config.name,
          view,
          audio,
        };
      });
      this.configs = configs;
      localStorage.setItem('configs', JSON.stringify(configs));
      this.emitValues({
        configs,
        trackIndex: 0,
        viewIndex: 0,
      });
      this.options(configs);
    }
  }

  load() {
    const configs = this.configs = JSON.parse(localStorage.getItem('configs')) || [];
    this.update(configs);
  }

  options(configs) {
    this.$tracks.innerHTML = '';
    configs.forEach((config, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = config.name;
      this.$tracks.appendChild(option);
    });
  }

  setTrackIndex(trackIndex, alsoSetToTracks = false) {
    if (!this.configs[trackIndex]) {
      return;
    }

    this.emitValues({
      trackIndex,
      viewIndex: 0,
    });

    if (alsoSetToTracks) {
      this.$tracks.value = `${trackIndex}`;
    }
  }

  setViewIndex(viewIndex) {
    const config = this.configs[this.trackIndex];
    if (!config || config[viewIndex]) {
      return;
    }

    this.emitValues({
      viewIndex,
    });
  }

  next() {
    if (this.configs.length < 2) {
      return;
    }
    {if (this.configs[this.trackIndex + 1]) {
      this.setTrackIndex(this.trackIndex + 1, true);
    } else {
      this.setTrackIndex(0, true);
    }}
  }

  nextView(back = false) {
    const config = this.configs[this.trackIndex];
    if (!config || config.view.length < 2) {
      return;
    }

    const direction = back ? -1 : 1;
    if (config.view[this.viewIndex + direction]) {
      this.setViewIndex(this.viewIndex + direction);
    } else if (back) {
      this.setViewIndex(0);
    } else {
      this.setViewIndex(0);
    }
  }

  emitValues(updated) {
    Object.keys(updated).forEach((key) => {
      this[key] = updated[key];
    });

    this.emit(CONFIG_EVENT.UPDATE, Object.assign({}, updated));
  }

  getCurrentView() {
    return (
      this.configs &&
      this.configs[this.trackIndex] &&
      this.configs[this.trackIndex].view &&
      this.configs[this.trackIndex].view[this.viewIndex]
    ) || null;
  }

  getCurrentAudio() {
    return (
      this.configs &&
      this.configs[this.trackIndex] &&
      this.configs[this.trackIndex].audio
    ) || null;
  }
}

export default Config;
