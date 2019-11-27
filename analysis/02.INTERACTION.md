## Interaction

##### 충돌 검사

###### InteractionManager

- 포인터 이벤트 리스너

- ```js
  this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, true);
  ```

- onPointerDown 핸들러

- processInteractive 호출

- processInteractive 에서 아래 충돌 검사를 거친 후 충돌 되었으면 processPointerDown 호출하여 충돌 알림

- displayObject.hitArea 가 있는 경우

- ```js
  var stage = new PIXI.Stage(0xFFFFFF);
  var renderer = PIXI.autoDetectRenderer(620, 380);
  document.body.appendChild(renderer.view);
  
  var graphics = new PIXI.Graphics();
  graphics.beginFill(0xFF3300);
  graphics.lineStyle(10, 0xffd900, 1);
  graphics.drawRect(20, 20, 100, 200);
  graphics.endFill();
  
  graphics.interactive = true;
  graphics.buttonMode = true;
  
  // Add a hit area..
  graphics.hitArea = new PIXI.Rectangle(20, 20, 100, 200);
  
  graphics.click = function (e) {
      console.log(this, e);
  }
  ```

- **클릭 좌표의 역행렬을 구해서 클릭 감지**(**회전시에도 적용 되는지 테스트**)

- 이 부분 테스트 코드로 작성

- ```js
  displayObject.worldTransform.applyInverse(point, this._tempPoint);
  if (!displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) {
   hitTest = false;
   hitTestChildren = false;
  } else {
   hit = true;
  }
  ```

- Rectangle

- ```js
  contains(x, y) {
   if (this.width <= 0 || this.height <= 0) {
    return false;
   }
  
   if (x >= this.x && x < this.x + this.width) {
    if (y >= this.y && y < this.y + this.height) {
     return true;
    }
   }
  
   return false;
  }
  ```

- RoundedRectangle

- ```js
  contains(x, y) {
   if (this.width <= 0 || this.height <= 0) {
    return false;
   }
   if (x >= this.x && x <= this.x + this.width) {
    if (y >= this.y && y <= this.y + this.height) {
     if ((y >= this.y + this.radius && y <= this.y + this.height - this.radius) ||
      (x >= this.x + this.radius && x <= this.x + this.width - this.radius)) {
      return true;
     }
     let dx = x - (this.x + this.radius);
     let dy = y - (this.y + this.radius);
     const radius2 = this.radius * this.radius;
  
     if ((dx * dx) + (dy * dy) <= radius2) {
      return true;
     }
     dx = x - (this.x + this.width - this.radius);
     if ((dx * dx) + (dy * dy) <= radius2) {
      return true;
     }
     dy = y - (this.y + this.height - this.radius);
     if ((dx * dx) + (dy * dy) <= radius2) {
      return true;
     }
     dx = x - (this.x + this.radius);
     if ((dx * dx) + (dy * dy) <= radius2) {
      return true;
     }
    }
   }
  
   return false;
  }
  ```

- Circle

- ```js
  contains(x, y) {
   if (this.radius <= 0) {
    return false;
   }
  
   const r2 = this.radius * this.radius;
   let dx = (this.x - x);
   let dy = (this.y - y);
  
   dx *= dx;
   dy *= dy;
  
   return (dx + dy <= r2);
  }
  ```

- Ellipse

- ```js
  contains(x, y) {
   if (this.width <= 0 || this.height <= 0) {
    return false;
   }
  
   // normalize the coords to an ellipse with center 0,0
   let normx = ((x - this.x) / this.width);
   let normy = ((y - this.y) / this.height);
  
   normx *= normx;
   normy *= normy;
  
   return (normx + normy <= 1);
  }
  ```

- Polygon

- ```js
  contains(x, y) {
   let inside = false;
  
   // use some raycasting to test hits
   // https://github.com/substack/point-in-polygon/blob/master/index.js
   // https://ijemin.com/blog/%EB%8B%A4%EA%B0%81%ED%98%95-%EB%82%B4%EB%B6%80%EC%9D%98-%EC%A0%90-%ED%8C%90%EB%8B%A8%ED%95%98%EA%B8%B0/
   // http://woowabros.github.io/experience/2018/03/31/hello-geofence.html
   const length = this.points.length / 2;
  
   for (let i = 0, j = length - 1; i < length; j = i++) {
    const xi = this.points[i * 2];
    const yi = this.points[(i * 2) + 1];
    const xj = this.points[j * 2];
    const yj = this.points[(j * 2) + 1];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);
  
    if (intersect) {
     inside = !inside;
    }
   }
  
   return inside;
  }
  ```

- ##### Ray Casting Algorithm (The Crossing Number) 테스트

- displayObject._mask 가 있는 경우

- containsPoint 체크

  - Mesh

  - Sprite

  - ```js
    containsPoint(point) {
     this.worldTransform.applyInverse(point, tempPoint);
    
     const width = this._texture.orig.width;
     const height = this._texture.orig.height;
     const x1 = -width * this.anchor.x;
     let y1 = 0;
    
     if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
      y1 = -height * this.anchor.y;
    
      if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
       return true;
      }
     }
    
     return false;
    }
    ```

  - TilingSprite

  - Graphics

  - ```js
    containsPoint(point) {
     this.worldTransform.applyInverse(point, tempPoint);
    
     const graphicsData = this.graphicsData;
    
     for (let i = 0; i < graphicsData.length; ++i) {
      const data = graphicsData[i];
    
      if (!data.fill) {
       continue;
      }
    
      // only deal with fills..
      if (data.shape) {
       if (data.shape.contains(tempPoint.x, tempPoint.y)) {
        if (data.holes) {
         for (let i = 0; i < data.holes.length; i++) {
          const hole = data.holes[i];
    
          if (hole.contains(tempPoint.x, tempPoint.y)) {
           return false;
          }
         }
        }
    
        return true;
       }
      }
     }
    
     return false;
    }
    ```