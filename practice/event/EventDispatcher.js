export class EventDispatcher {
  addEventListener(type, listener, options = {}) {
    const listeners = this.__listeners || (this.__listeners = {});
    if (listeners[type] === undefined) {
      listeners[type] = [];
    }
    if (this.__findListenerIndex(listeners[type], listener) === -1) {
      listeners[type].push({ listener, options });
    }
    return {
      type,
      listener,
      target: this,
    };
  }

  once(type, listener) {
    return this.addEventListener(type, listener, { once: true });
  }

  hasEventListener(type, listener) {
    if (this.__listeners === undefined) return false;
    const listeners = this.__listeners;
    return (
      listeners[type] !== undefined &&
      this.__findListenerIndex(listener[type], listener) !== -1
    );
  }

  removeEventListener(type, listener) {
    if (this.__listeners === undefined) return;

    const listeners = this.__listeners,
      listenerArray = listeners[type];

    if (listenerArray === undefined) return;
    const index = this.__findListenerIndex(listenerArray, listener);
    if (index !== -1) {
      listenerArray.splice(index, 1);
    }
  }

  dispatchEvent(event, value) {
    if (this.__listeners === undefined) return;
    const listeners = this.__listeners,
      listenerArray = listeners[event.type];
    if (listenerArray === undefined) return;

    event.target = this;
    const array = listenerArray.slice(0);
    for (let i = 0, l = array.length; i < l; i++) {
      const {
        listener,
        options: { once },
      } = array[i];
      listener?.call(this, event, value);
      if (once) this.removeEventListener(event.type, listener);
    }
  }

  removeAllListeners() {
    this.__listeners = {};
  }

  __findListenerIndex(listeners = [], listener) {
    return listeners.findIndex(
      ({ listener: _listener }) => _listener === listener
    );
  }
}

EventDispatcher.prototype.emit = EventDispatcher.prototype.dispatchEvent;
EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;
EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;

export default EventDispatcher;
