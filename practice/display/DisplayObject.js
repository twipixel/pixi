import EventDispatcher from '../event/EventDispatcher.js';

export class DisplayObject extends EventDispatcher {
  constructor() {
    super();

    this._x = 0;
		this._y = 0;
		this._rotation = 0;
		this._scaleX = 1;
		this._scaleY = 1;
		this._anchorX = 0;
		this._anchorY = 0;
		this._sourceWidth = 0;
		this._sourceHeight = 0;
		this._dirty = true;
		this._transform = new Float32Array(9);
  }

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
}

export default DisplayObject;