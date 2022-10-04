/**
 * @classdesc `KVO` 클래스는 KVO(Key-Value Observing) 패턴을 정의하는 클래스입니다.
 *
 * 이 클래스는 [Event]{@link naver.maps.Event}의 구현 일부를 상속받으며, NAVER 지도 API v3의 주요 클래스는 이 클래스를 상속받아 구현되었습니다.
 * > NAVER 지도 API v3 사용자는 이 클래스를 이용해 `KVO` 패턴을 동일하게 사용할 수 있습니다.
 * @class
 * @name naver.maps.KVO
 * @tutorial  KVO-State-Changes
 *
 * @category KVO
 */
N.KVO = function () {};
/** @lends naver.maps.KVO# */
N.KVO.prototype = {
  constructor: N.KVO,

  /**
   * 키(key)에 해당하는 값을 객체에 설정합니다.
   *
   * 값이 설정되면 해당 객체의 키를 바인딩하고 있는 모든 `KVO` 객체에 동일한 값이 적용됩니다.
   * 또한, `{key}_changed` 형태의 이벤트를 이용해 값의 변경을 감지할 수 있습니다.
   * @param {string} key - 키
   * @param {any} value - 키에 저장할 값
   * @param {boolean} [silently] 묵시적으로 값을 설정할지 여부. 이 값이 `true`이면 이벤트를 발생시키지 않습니다.
   * @fires naver.maps.KVO#{key}_changed
   */
  set: function (key, value, silently = false) {
    var targetInfo = this.__getTargets()[key];

    if (targetInfo) {
      var target = targetInfo.target,
        targetKey = targetInfo.targetKey,
        fName = 'set' + N.capitalize(key);

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
  },

  __lazySet: function (key, value, silently) {
    if (this.get(key) !== value) {
      this.set(key, value, silently);
    }
  },

  /**
   * 키에 해당하는 값을 반환합니다.
   * @param {string} key - 키
   * @return {any} 키에 할당되어 있는 값
   */
  get: function (key) {
    var targetInfo = this.__getTargets()[key];

    if (targetInfo) {
      var target = targetInfo.target,
        targetKey = targetInfo.targetKey,
        fName = 'get' + N.capitalize(key);

      if (target[fName]) {
        return target[fName](targetKey);
      } else {
        return target.get(targetKey);
      }
    } else {
      return this[key];
    }
  },

  __notifyChanged: function (key) {
    var value = this.get(key),
      eventName = key + '_changed';

    if (this[eventName]) {
      this[eventName](value);
    } else if (this.changed) {
      this.changed(key, value);
    }

    NEvent.trigger(this, eventName, value);
  },

  /**
   * 대상 객체(`target`)의 대상 키(`targetKey`)에 자신의 키(`key`)를 바인딩합니다. 따라서 대상 객체의 대상 키의 값이 변경되면 자신의 키의 값 역시 갱신됩니다.
   *
   * 즉, 대상 객체에서 사용하는 대상 키에 바인딩하면서 자신만의 키 이름을 설정할 때 사용할 수 있습니다. 대상 키가 없으면 동일한 키 이름을 사용합니다.
   * @param {string} key - 키
   * @param {naver.maps.KVO} target - 대상 객체
   * @param {string} [targetKey] - 대상 객체에 존재하는 키
   * @fires naver.maps.KVO#{key}_changed
   */
  bindTo: function (key, target, targetKey) {
    if (typeof key === 'string') {
      targetKey = targetKey || key;
      this.unbind(key);

      var fBind = N_bind(
          function (_key) {
            this.__notifyChanged(_key);
          },
          this,
          key
        ),
        targetInfo = target.__bind(target, targetKey, fBind);

      targetInfo.targetKey = targetKey;
      this.__getTargets()[key] = targetInfo;
      this.__notifyChanged(key);
    } else if (N.isArray(key)) {
      var keyList = key;

      for (var i = 0, ii = keyList.length; i < ii; i++) {
        this.bindTo(keyList[i], target);
      }
    }
  },

  /**
   * @ignore
   */
  __bind: function (target, targetKey, handler) {
    return NEvent.addListener(target, targetKey + '_changed', handler);
  },

  /**
   * 해당 키의 바인딩을 제거합니다.
   * @param {string} key - 제거할 키
   */
  unbind: function (key) {
    if (N.isArray(key)) {
      N.forEach(key, N_bind(this.unbind, this));
    } else {
      var targetInfo = this.__getTargets()[key];
      if (targetInfo) {
        var target = targetInfo.target,
          value = this.get(key);

        target.__unbind(targetInfo);

        this.__getTargets()[key] = null;
        delete this.__getTargets()[key];

        this[key] = value;
      }
    }
  },

  /**
   * @ignore
   */
  __unbind: function (listener) {
    NEvent.removeListener(listener);
  },

  /**
   * 모든 바인딩을 제거합니다.
   */
  unbindAll: function () {
    var _this = this;

    N.forEach(_this.__getTargets(), function (t, key) {
      _this.unbind(key);
    });
  },

  /**
   * `키-값` 쌍 형태로 동시에 여러 개의 값을 설정합니다.
   * @param {object} properties - 설정할 키-값 쌍의 객체
   * @fires naver.maps.KVO#{key}_changed
   */
  setValues: function (properties) {
    var _this = this;

    N.forEach(properties, function (propValue, key) {
      var fName = 'set' + N.capitalize(key);

      if (_this[fName]) {
        _this[fName](propValue);
      } else {
        _this.set(key, propValue);
      }
    });
  },

  __getTargets: function () {
    return this.__targets || (this.__targets = {});
  },

  // N.Event extends
  /**
   * 현재 객체의 이벤트 알림을 받아 핸들러를 호출하는 리스너를 등록합니다.
   * > 이 메서드는 [Event]{@link naver.maps.Event}의 `addListener` 메서드를 상속받습니다.
   * @param {string} eventName - 이벤트 이름
   * @param {function} listener - 이벤트 리스너
   * @return {MapEventListener} 지도 이벤트 리스너 객체
   */
  addListener: function (eventName, listener) {
    return NEvent.addListener(this, eventName, listener);
  },

  /**
   * 현재 객체에 이벤트 알림이 등록되었는지 여부를 확인합니다.
   * > 이 메서드는 [Event]{@link naver.maps.Event}의 `hasListener` 메서드를 상속받습니다.
   * @param {string} eventName - 이벤트 이름
   * @return {boolean} 등록 여부
   */
  hasListener: function (eventName) {
    return NEvent.hasListener(this, eventName);
  },

  /**
   * 현재 객체에서 한 번만 이벤트 알림을 받아 핸들러를 호출하는 리스너를 등록합니다.
   * > 이 메서드는 [Event]{@link naver.maps.Event}의 `once` 메서드를 상속받습니다.
   * @param {string} eventName - 이벤트 이름
   * @param {function} listener - 이벤트 리스너
   * @return {MapEventListener} 지도 이벤트 리스너 객체
   */
  addListenerOnce: function (eventName, listener) {
    return NEvent.once(this, eventName, listener);
  },

  /**
   * 특정 이벤트 알림의 리스너를 제거합니다.
   * > 이 메서드는 [Event]{@link naver.maps.Event}의 `removeListener` 메서드를 상속받습니다.
   * @param {MapEventListener|MapEventListener[]} listeners - 제거할 리스너 객체 또는 리스너 객체의 배열
   */
  removeListener: function (eventRelation) {
    return NEvent.removeListener(eventRelation);
  },

  /**
   * 현재 객체에 이벤트 알림을 발생시킵니다.
   * > 이 메서드는 [Event]{@link naver.maps.Event}의 `trigger` 메서드를 상속받습니다.
   * @param {string} eventName - 이벤트 이름
   * @param {...any} [eventObject] - 이벤트 리스너에 전달할 이벤트 객체
   */
  trigger: function (eventName /*, arg1, arg2 ... */) {
    var args = [this, eventName];

    if (arguments.length > 1) {
      for (var i = 1, ii = arguments.length; i < ii; i++) {
        args.push(arguments[i]);
      }
    }

    return NEvent.trigger.apply(NEvent, args);
  },

  /**
   * 현재 객체에서 특정 이벤트 알림의 리스너를 모두 제거합니다.
   * > 이 메서드는 [Event]{@link naver.maps.Event}의 `clearListeners` 메서드를 상속받습니다.
   * @param {string} eventName - 모두 제거할 이벤트의 이름
   */
  clearListeners: function (eventName) {
    if (eventName) {
      return NEvent.clearListeners(this, eventName);
    } else {
      return NEvent.clearInstanceListeners(this);
    }
  },
};

// Event detail
/**
 * 특정 `key`의 값이 변경되면 `{key}_changed` 이벤트가 발생합니다.
 *
 * @event naver.maps.KVO#{key}_changed
 * @param {any} value - 해당 키의 변경된 값
 */
