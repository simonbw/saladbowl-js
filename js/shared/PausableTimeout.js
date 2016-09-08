class PausableTimeout {
  constructor(callback, duration) {
    this.callback = () => {
      this.cancel();
      callback.call(null);
    };
    this.remaining = duration;
    this.timeout = null;
    this.startTime = null;
    this.resume();
    this.done = false;
  }

  pause() {
    if (!this.done && this.timeout != null) {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.remaining -= Date.now() - this.startTime;
    }
  }

  resume() {
    if (!this.done) {
      this.startTime = Date.now();
      this.timeout = setTimeout(this.callback, this.remaining);
    }
  }

  cancel() {
    if (!this.done && this.timeout != null) {
      this.done = true;
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}