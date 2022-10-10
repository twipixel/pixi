## [Sheep](https://www.youtube.com/watch?v=hCHL7sydzn0&t=361s)

#### 베지어 곡선 x, y 공석

```js
// ref: https://en.wikipedia.org/wiki/B%C3%A9zier_curve
getQuadValue(p0, p1, p2, t) {
   return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
 }
```



#### 베지어 기울기 공식

```javascript
// ref: https://stackoverflow.com/questions/45789186/draw-a-line-with-gradient-in-canvas
// for quadratic   f(t) = a(1-t)^2+2b(1-t)t+ct^2 
//                      = a+2(-a+b)t+(a-2b+c)t^2
// The derivative f'(t) =  2(1-t)(b-a)+2(c-b)t

quadTangent(a, b, c, t) {
  return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
}
```



#### 사용

```js
getPointOnQuad(x1, y1, x2, y2, x3, y3, t) {
  const tx = this.quadTangent(x1, x2, x3, t);
  const ty = this.quadTangent(y1, y2, y3, t);
  const rotation = -Math.atan2(tx, ty) + (90 * Math.PI) / 180;
  return {
    x: this.getQuadValue(x1, x2, x3, t),
    y: this.getQuadValue(y1, y2, y3, t),
    rotation,
  };
}
```





## [Leon Sans](https://www.youtube.com/watch?v=sb7v-d-R11E)

0 ~ 1까지의 비율 t 값을 구하는 공식

- A(t = 0) -> B(t = 1)

- ((1-t) * A) + (t * B)

