import EventDispatcher from '../event/EventDispatcher.js';
import StringUtils from '../utils/StringUtils.js';
import FunctionUtils from '../utils/FunctionUtils.js';

export class KVO extends EventDispatcher {
  constructor() {
    super();
  }

  set(key, value, silently = false) {
    const targetInfo = this.__getTargets()[key];

    if (targetInfo) {
      const target = targetInfo.target,
        targetKey = targetInfo.targetKey,
        fName = `set${StringUtils.capitalize(key)}`;

      if (target[fName]) {
        target[fName](value, silently);
      } else {
        target.set(targetKey, value, silently);
      }
    } else {
      this[key] = value;

      if (silently !== true) {
        this.__notifyChanged(key);
      }
    }
  }

  get(key) {
    const targetInfo = this.__getTargets()[key];

    if (targetInfo) {
      const target = targetInfo.target,
        targetKey = targetInfo.targetKey,
        fName = `get${StringUtils.capitalize(key)}`;

      if (target[fName]) {
        return target[fName](targetKey);
      } else {
        return target.get(targetKey);
      }
    } else {
      return this[key];
    }
  }

  setValues(properties) {
    for (const [key, value] of Object.entries(properties)) {
      const fName = `set${StringUtils.capitalize(key)}`;

      if (this[fName]) {
        this[fName](value);
      } else {
        this.set(key, value);
      }
    }
  }

  bindTo(key, target, targetKey) {
    if (typeof key === 'string') {
      targetKey = targetKey || key;
      this.unbind(key);

      const listener = FunctionUtils.bind(
          (key) => {
            this.__notifyChanged(key);
          },
          this,
          key
        ),
        targetInfo = target.__bind(target, targetKey, listener);

      targetInfo.targetKey = targetKey;

      this.__getTargets()[key] = targetInfo;
      this.__notifyChanged(key);
    } else if (Array.isArray(key)) {
      const keyList = key;

      for (let i = 0, ii = keyList.length; i < ii; i += 1) {
        this.bindTo(keyList[i], target);
      }
    }
  }

  unbind(key, target, targetKey) {
    if (Array.isArray(key)) {
      key.forEach((key) => this.unbind(key));
    } else {
      const targetInfo = this.__getTargets()[key];

      if (targetInfo) {
        const { target, targetKey, listener } = targetInfo,
          value = this.get(key);

        target.__unbind(target, targetKey, listener);

        this.__getTargets()[key] = null;
        delete this.__getTargets()[key];

        this[key] = value;
      }
    }
  }

  unbindAll() {
    const targets = this.__getTargets();
    for (const [key] of Object.entries(targets)) {
      this.unbind(key);
    }
  }

  __bind(target, targetKey, listener) {
    return target.on(targetKey, listener);
  }

  __unbind(target, targetKey, listener) {
    target.off(targetKey, listener);
  }

  __notifyChanged(key) {
    const value = this.get(key),
      eventName = `${key}_changed`;

    if (this[eventName]) {
      this[eventName](value);
    } else if (this.changed) {
      this.changed(key, value);
    }

    this.emit({ type: key }, value);
  }

  __getTargets() {
    return this.__targets || (this.__targets = {});
  }
}

export default KVO;
