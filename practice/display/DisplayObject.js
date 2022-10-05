import EventDispatcher from '../event/EventDispatcher.js';
import Transform from './Transform.js';

export class DisplayObject extends EventDispatcher {
  constructor() {
    super();

    this.transform = new Transform();
    this.tempDisplayObjectParent = null;
    this.alpha = 1;
    this.visible = true;
    this.parent = null;
    this.worldAlpha = 1;
    this._destroyed = false;
  }

  get _tempDisplayObjectParent() {
    if (this.tempDisplayObjectParent === null) {
      this.tempDisplayObjectParent = new DisplayObject();
    }
    return this.tempDisplayObjectParent;
  }

  updateTransform() {
    this.transform.updateTransform(this.parent.transform);
    this.worldAlpha = this.alpha * this.parent.worldAlpha;
  }

  _recursivePostUpdateTransform() {
    if (this.parent) {
      this.parent._recursivePostUpdateTransform();
      this.transform.updateTransform(this.parent.transform);
    } else {
      this.transform.updateTransform(this._tempDisplayObjectParent.transform);
    }
  }

  toGlobal(position, point, skipUpdate = false) {
    if (!skipUpdate) {
      this._recursivePostUpdateTransform();

      if (!this.parent) {
        this.parent = this._tempDisplayObjectParent;
        this.displayObjectUpdateTransform();
        this.parent = null;
      } else {
        this.displayObjectUpdateTransform();
      }
    }

    return this.worldTransform.apply(position, point);
  }

  toLocal(position, from, point, skipUpdate) {
    if (from) {
      position = from.toGlobal(position, point, skipUpdate);
    }

    if (!skipUpdate) {
      this._recursivePostUpdateTransform();

      if (!this.parent) {
        this.parent = this._tempDisplayObjectParent;
        this.displayObjectUpdateTransform();
        this.parent = null;
      } else {
        this.displayObjectUpdateTransform();
      }
    }

    return this.worldTransform.applyInverse(position, point);
  }

  setParent(container) {
    if (!container || !container.addChild) {
      throw new Error('setParent: Argument must be a Container');
    }

    container.addChild(this);

    return container;
  }

  /**
   * Convenience function to set the position, scale, skew and pivot at once.
   *
   * @param {number} [x=0] - The X position
   * @param {number} [y=0] - The Y position
   * @param {number} [scaleX=1] - The X scale value
   * @param {number} [scaleY=1] - The Y scale value
   * @param {number} [rotation=0] - The rotation
   * @return {PIXI.DisplayObject} The DisplayObject instance
   */
  setTransform(
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    rotation = 0,
    skewX = 0,
    skewY = 0,
    pivotX = 0,
    pivotY = 0
  ) {
    this.position.x = x;
    this.position.y = y;
    this.scale.x = !scaleX ? 1 : scaleX;
    this.scale.y = !scaleY ? 1 : scaleY;
    this.rotation = rotation;
    this.skew.x = skewX;
    this.skew.y = skewY;
    this.pivot.x = pivotX;
    this.pivot.y = pivotY;

    return this;
  }

  destroy() {
    this.removeAllListeners();
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.transform = null;

    this.parent = null;

    this.interactive = false;
    this.interactiveChildren = false;

    this._destroyed = true;
  }

  get x() {
    return this.position.x;
  }

  set x(value) {
    this.transform.position.x = value;
  }

  get y() {
    return this.position.y;
  }

  set y(value) {
    this.transform.position.y = value;
  }

  get worldTransform() {
    return this.transform.worldTransform;
  }

  get localTransform() {
    return this.transform.localTransform;
  }

  get position() {
    return this.transform.position;
  }

  set position(value) {
    this.transform.position.copy(value);
  }

  get scale() {
    return this.transform.scale;
  }

  set scale(value) {
    this.transform.scale.copy(value);
  }

  get pivot() {
    return this.transform.pivot;
  }

  set pivot(value) {
    this.transform.pivot.copy(value);
  }

  get skew() {
    return this.transform.skew;
  }

  set skew(value) {
    this.transform.skew.copy(value);
  }

  get rotation() {
    return this.transform.rotation;
  }

  set rotation(value) {
    this.transform.rotation = value;
  }

  get worldVisible() {
    let item = this;

    do {
      if (!item.visible) {
        return false;
      }

      item = item.parent;
    } while (item);

    return true;
  }
}

DisplayObject.prototype.displayObjectUpdateTransform =
  DisplayObject.prototype.updateTransform;

export default DisplayObject;
