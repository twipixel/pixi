
export class EventDispatcher {

	addEventListener(type, listener, once = false) {
		if (this._listeners === undefined) this._listeners = {};
		const listeners = this._listeners;
		if (listeners[type] === undefined) {
			listeners[type] = [];
		}
		if (listeners[type].findIndex(({ listener: _listener }) => _listener === listener) === -1) {
			listeners[type].push( { listener, once } );
		}
	}

  once(type, listener) {
    this.addEventListener(type, listener, true);
  }

	hasEventListener(type, listener) {
		if (this._listeners === undefined) return false;
		const listeners = this._listeners;
		return listeners[type] !== undefined && listeners[type].findIndex(({ listener: _listener}) => _listener === listener) !== -1;
	}

	removeEventListener(type, listener) {
		if (this._listeners === undefined) return;

		const listeners = this._listeners;
		const listenerArray = listeners[type];

		if (listenerArray !== undefined) {
      this.removeListener(listeners, type, listener);
		}
	}

	dispatchEvent(event) {
		if (this._listeners === undefined) return;
		const listeners = this._listeners;
		const listenerArray = listeners[event.type];

		if (listenerArray !== undefined) {
			event.target = this;
			const array = listenerArray.slice(0);
			for (let i = 0, l = array.length; i < l; i++) {
        const {listener, once} = array[i];
				listener?.call(this, event);
        if (once) this.removeListener(listeners, event.type, listener);
			}
		}
	}

  removeListener(listeners, type, listener) {
    const listenerArray = listeners[type];
    const index = listenerArray.findIndex(({ listener: _listener }) => _listener === listener);
			if (index !== - 1) {
				listenerArray.splice(index, 1);
			}
  }
}

EventDispatcher.prototype.emit = EventDispatcher.prototype.dispatchEvent;
EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;
EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;

export default EventDispatcher;