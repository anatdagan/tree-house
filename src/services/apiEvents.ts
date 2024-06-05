type EventCallback<T> = (data: T) => void;
class EventEmitter<T> {
  private events: { [key: string]: EventCallback<T>[] };
  constructor() {
    this.events = {};
  }

  on(event: string, listener: EventCallback<T>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: EventCallback<T>) {
    const listeners = this.events[event];
    if (listeners) {
      this.events[event] = listeners.filter((l) => l !== listener);
    }
  }

  emit(event: string, data: T) {
    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
}

export default EventEmitter;
