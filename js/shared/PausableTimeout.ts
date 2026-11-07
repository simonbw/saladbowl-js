'use strict';

class PausableTimeout {
  callback: () => void;
  remaining: number;
  timeout: ReturnType<typeof setTimeout> | null;
  startTime: number | null;
  done: boolean;

  constructor(callback: () => void, duration: number) {
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

  pause(): void {
    if (!this.done && this.timeout != null) {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.remaining -= Date.now() - (this.startTime as number);
    }
  }

  resume(): void {
    if (!this.done) {
      this.startTime = Date.now();
      this.timeout = setTimeout(this.callback, this.remaining);
    }
  }

  cancel(): void {
    if (!this.done && this.timeout != null) {
      this.done = true;
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

export default PausableTimeout;
