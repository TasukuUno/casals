import {EventEmitter} from 'events';

export const PLAYER_EVENT = {
  ENDED: 'Player.ENDED',
};

class Player extends EventEmitter {
  constructor({audio, timeRangeFrom, timeRangeTo, setFrom, setTo, playbackRate, loop}) {
    super();
    this.$audio = audio;
    this.$timeRangeFrom = timeRangeFrom;
    this.$timeRangeTo = timeRangeTo;
    this.$playbackRate = playbackRate;
    this.$loop = loop;
    this.$setFrom = setFrom;
    this.$setTo = setTo;

    this.setLoop();
    this.setRange();

    [timeRangeFrom, timeRangeTo].forEach((range) => {
      range.addEventListener('change', this.setRange.bind(this));
    });
    [setFrom, setTo].forEach((btn, idx) => {
      btn.addEventListener('click', this.setRangeFromBtn.bind(this, idx === 0));
    });
    loop.addEventListener('click', this.setLoop.bind(this));
    playbackRate.addEventListener('change', this.setRate.bind(this));
    playbackRate.addEventListener('dblclick', this.resetRate.bind(this));
    audio.addEventListener('timeupdate', this.timeupdate.bind(this));
    audio.addEventListener('ended', this.ended.bind(this));
  }

  setURL(url) {
    this.$audio.src = url;
    this.range = {from: 0, to: 0};
    this.$timeRangeFrom.value = '00:00';
    this.$timeRangeTo.value = '00:00';
  }

  setRate() {
    this.$playbackRate.title = this.$playbackRate.value;
    this.$audio.playbackRate = this.$playbackRate.value * 1;
    this.blurElements();
  }

  resetRate() {
    this.$playbackRate.value = '1';
    this.setRate();
    this.blurElements();
  }

  setLoop() {
    this.$audio.loop = !!this.$loop.checked;
    this.blurElements();
  }

  setRange() {
    const from = this.$timeRangeFrom.value;
    const to = this.$timeRangeTo.value;
    const values = [from, to].map((str) => {
      const [min, sec] = str.split(':');
      return 60 * min + 1 * sec;
    });
    this.range = {
      from: values[0] || 0,
      to: values[1] || 0,
    };
    this.blurElements();
  }

  setRangeFromBtn(isFrom) {
    const sec = Math.round(this.$audio.currentTime);
    const value = [
      ('0' + (sec / 60 | 0)).slice(-2),
      ('0' + (sec % 60 | 0)).slice(-2),
    ].join(':');
    const target = isFrom ? this.$timeRangeFrom : this.$timeRangeTo;
    target.value = value;
    this.setRange();
    this.blurElements();
  }

  timeupdate() {
    if (this.range.from && this.$audio.currentTime < this.range.from) {
      this.$audio.currentTime = this.range.from;
    } else if (this.range.to && this.range.to < this.$audio.currentTime) {
      this.$audio.currentTime = this.range.from;
    }
  }

  ended() {
    if (!this.$audio.loop) {
      this.emit(PLAYER_EVENT.ENDED);
    }
  }

  play() {
    this.$audio.play();
  }

  pause() {
    this.$audio.pause();
  }

  toggle() {
    if (this.$audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  blurElements() {
    const blurElem = document.querySelector('*:focus');
    if (blurElem && blurElem.blur) {
      blurElem.blur();
    }
  }
}

export default Player;
