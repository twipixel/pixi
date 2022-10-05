export class Calc {
  constructor() {}

  static get DEG_TO_RAD() {
    if (Calc._DEG_TO_RAD) return Calc._DEG_TO_RAD;

    Calc._DEG_TO_RAD = Math.PI / 180;
    return Calc._DEG_TO_RAD;
  }

  static get RAD_TO_DEG() {
    if (Calc._RAD_TO_DEG) return Calc._RAD_TO_DEG;

    Calc._RAD_TO_DEG = 180 / Math.PI;
    return Calc._RAD_TO_DEG;
  }

  static get DEG180_TO_RAD() {
    if (Calc._DEG180_TO_RAD) return Calc._DEG180_TO_RAD;

    Calc._DEG180_TO_RAD = (180 * Math.PI) / 180;
    return Calc._DEG180_TO_RAD;
  }

  /**
   * 바운드안에 이미지를 넣을 수 있도록 사이즈를 제공합니다.
   * @param imageSize 이미지 넓이와 높이
   * @param boundsSize 바운드 넓이와 높이
   * @returns {{width: number, height: number}}
   */
  static getImageSizeKeepAspectRatio(imageSize, boundsSize) {
    var scale = Calc.getBoundsScale(boundsSize, imageSize);
    var minScale = scale.min;
    var resizeWidth = minScale * imageSize.width;
    var resizeHeight = minScale * imageSize.height;
    return { width: resizeWidth, height: resizeHeight };
  }

  /**
   * 바운드와 이미지의 최소, 최대 비율을 구합니다.
   * @param boundsSize 바운드의 넓이와 높이
   * @param imageSize 이미지의 넓이와 높이
   * @returns {*} 최대, 최소 비율
   */
  static getBoundsScale(boundsSize, imageSize) {
    var scaleX = boundsSize.width / imageSize.width;
    var scaleY = boundsSize.height / imageSize.height;

    if (scaleX < scaleY) return { min: scaleX, max: scaleY };
    else return { max: scaleX, min: scaleY };
  }

  static getRotation(centerPoint, mousePoint) {
    var dx = mousePoint.x - centerPoint.x;
    var dy = mousePoint.y - centerPoint.y;
    var radians = Math.atan2(dy, dx);
    var rotation = Calc.toDegrees(radians);
    //var rotation = Calculator.getDegrees(radians) + Calculator.getDegrees(Math.PI);
    //rotation = (rotation <= 0) ? 180 : -180;
    return rotation;
  }

  /**
   * 대각선 길이를 구합니다.
   * @param width 사각형의 넓이
   * @param height 사각형의 높이
   * @returns {number} 대각선 길이
   */
  static getDiagonal(width, height) {
    return Math.sqrt(width * width + height * height);
  }

  /**
   * 새로운 사각형의 넓이 구하기
   * @param originalWidth 기존 사각형 넓이
   * @param originalHeight 기존 사각형 높이
   * @param newHeight 새로운 사각형 높이
   * @returns {number}
   */
  static getRectangleWidth(originalWidth, originalHeight, newHeight) {
    return (originalWidth * newHeight) / originalHeight;
  }

  static toRadians(degree) {
    return degree * Calc.DEG_TO_RAD;
  }

  static toDegrees(radians) {
    return radians * Calc.RAD_TO_DEG;
  }

  /**
   * 삼각형 면적 구하기
   * 삼각형면적공식이 정말 면적을 구하는 경우가 아니라면,
   * 2로 나누는 연산(실수 연산이므로 부하가 있다)은 대체로 필요없는 경우가 대부분이다.
   * 따라서, 2로 나누지 않고 사용하는 경우가 많다.
   * 사실 최적화라고 할 것도 없다.
   * Area(A, B, C) = ((Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax)) / 2
   * 위 공식을 아래와 같이 바꾸면 된다.
   * Area2(A, B, C) = ((Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax))
   *
   * @param p0 삼각형 좌표(Point)
   * @param p1 삼각형 좌표(Point)
   * @param p2 삼각형 좌표(Point)
   * @returns {number} 삼각형의 면적
   */
  static triangleArea(p0, p1, p2) {
    return (
      p2.x * p1.y -
      p1.x * p2.y -
      (p2.x * p0.y - p0.x * p2.y) +
      (p1.x * p0.y - p0.x * p1.y)
    );
  }

  /**
   * 점 C가 직선 AB 위에 존재하는지 검사
   * 세 점이 한 직선상에 있거나 어느 두 점이 동일한 위치의 점이면,
   * 세 점이 이루는 삼각형의 면적은 0이므로 한 직선상에 있다고 볼 수 있다.
   *
   * OnLineAB(A,B,rb) = (Area2(A,B,rb) = 0)
   *
   * 점 C가 직선 AB로 나뉘는 두 평면 중 어느 쪽 평면에 속하는가?
   * 세 점의 두르기 방향에 따라 면적이 양수 또는 음수가 산출되는 사실을 이용한 것이다.
   * 2차 공간에서 직선 AB는 직선의 진행방향을 기준으로 평면을 왼쪽 평면과 우측 평면으로 분활한다.
   * 이 때 점 C가 왼쪽평면에 속하는지 우측평면에 속하는지 알려면
   * 삼각 ABC의 면적이 양수인지 음수인지 검사하면 된다.
   *
   * isLeftOfAB(A,B,rb) = (Area2(A,B,rb) > 0)
   * isRightOfAB(A,B,rb) = (Area2(A,B,rb) < 0)
   *
   * 삼각형의 면적이 양수이면 점 C는 왼쪽에
   * 삼각형의 면적이 음수이면 점 C는 오른쪽에 있다.
   *
   * 사각형안에 점이 있는지 판단은
   * 사각형의 좌,우,상,하의 선분과 한 점의 이용해 삼각형의 면적을 구해서
   * 모두 0이거나 0보다 작으면 우측, 즉 사각형 안에 점이 있는 것이고
   * 하나라도 양수가 나오면 사각형 안에 점이 없는 것이 된다.
   *
   * @param point 체크하고 싶은 포인트
   * @param lt 사각형 좌상단 포인트
   * @param rt 사각형 우상단 포인트
   * @param rb 사각형 우한단 포인트
   * @param lb 사각형 좌하단 포인트
   * @returns {boolean} 사각형안에 포인트가 있는지 여부
   */
  static isInsideSquare(point, lt, rt, rb, lb) {
    //console.log(
    //    parseInt(lt.x), parseInt(lt.y),
    //    parseInt(rt.x), parseInt(rt.y),
    //    parseInt(rb.x), parseInt(rb.y),
    //    parseInt(lb.x), parseInt(lb.y),
    //    parseInt(point.x), parseInt(point.y)
    //);

    if (
      Calc.triangleArea(point, lt, rt) > 0 ||
      Calc.triangleArea(point, rt, rb) > 0 ||
      Calc.triangleArea(point, rb, lb) > 0 ||
      Calc.triangleArea(point, lb, lt) > 0
    )
      return false;
    return true;
  }

  /**
   * 이미지 좌우상하 어디에 히트 되었는지 체크 하는 샘플 코드입니다.
   */
  static sampleCodeHitTest(point, lt, rt, rb, lb) {
    var result = {
      isHitLeft: false,
      isHitRight: false,
      isHitTop: false,
      isHitBottom: false,
    };

    if (Calc.triangleArea(point, lt, rt) > 0) result.isHitTop = true;

    if (Calc.triangleArea(point, rt, rb) > 0) result.isHitRight = true;

    if (Calc.triangleArea(point, rb, lb) > 0) result.isHitBottom = true;

    if (Calc.triangleArea(point, lb, lt) > 0) result.isHitLeft = true;

    return result;
  }

  static getPointsByBounds(bounds) {
    return {
      lt: { x: bounds.x, y: bounds.y },
      rt: { x: bounds.x + bounds.width, y: bounds.y },
      rb: { x: bounds.x + bounds.height, y: bounds.y + bounds.height },
      lb: { x: bounds.x, y: bounds.y + bounds.height },
    };
  }

  static digit(convertNumber, digitNumber = 1) {
    if (digitNumber === 0) digitNumber = 1;

    var pow = Math.pow(10, digitNumber);
    return parseInt(convertNumber * pow) / pow;
  }

  static leadingZero(number, digits = 4) {
    var zero = '';
    number = number.toString();

    if (number.length < digits) {
      for (var i = 0; i < digits - number.length; i++) zero += '0';
    }
    return zero + number;
  }

  static getOneToOne(x, a, b, c, d) {
    return ((d - c) / (b - a)) * (x - a) + c;
  }

  /**
   * 회전하는 좌표 구하기
   * @param pivot 사각형의 중심점
   * @param point 계산하고 싶은 포인트
   * @param angle2 회전각 degrees
   * @returns {{x: (number|*), y: (number|*)}}
   */
  static getRotationPoint(pivot, point, angle) {
    var diffX = point.x - pivot.x;
    var diffY = point.y - pivot.y;
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    var ca = (Math.atan2(diffY, diffX) * 180) / Math.PI;
    var na = (((ca + angle) % 360) * Math.PI) / 180;
    var x = (pivot.x + dist * Math.cos(na) + 0.5) | 0;
    var y = (pivot.y + dist * Math.sin(na) + 0.5) | 0;
    return { x: x, y: y };
  }

  static getRotationPointWithDistance(pivot, point, angle, distance) {
    var diffX = point.x - pivot.x;
    var diffY = point.y - pivot.y;
    var ca = (Math.atan2(diffY, diffX) * 180) / Math.PI;
    var na = (((ca + angle) % 360) * Math.PI) / 180;
    var x = (pivot.x + distance * Math.cos(na) + 0.5) | 0;
    var y = (pivot.y + distance * Math.sin(na) + 0.5) | 0;
    return { x: x, y: y };
  }

  /**
   * 회전각과 사각형의 포인트를 넘겨주면 회전된 사각형의 포인트를 전달합니다.
   * @param pivot 사각형의 pivot(anchor) 포인트
   * @param rectanglePoints 사각형 좌표 (leftTop, rightTop, rightBottom, leftBottom)
   * @param angle 각도 degress
   * @returns {{lt: ({x, y}|{x: (number|*), y: (number|*)}), rt: ({x, y}|{x: (number|*), y: (number|*)}), rb: ({x, y}|{x: (number|*), y: (number|*)}), lb: ({x, y}|{x: (number|*), y: (number|*)})}}
   */
  static getRotationRectanglePoints(pivot, rectanglePoints, angle) {
    var lt = Calc.getRotationPoint(pivot, rectanglePoints.lt, angle);
    var rt = Calc.getRotationPoint(pivot, rectanglePoints.rt, angle);
    var rb = Calc.getRotationPoint(pivot, rectanglePoints.rb, angle);
    var lb = Calc.getRotationPoint(pivot, rectanglePoints.lb, angle);
    return { lt: lt, rt: rt, rb: rb, lb: lb };
  }

  /**
   * 사각형의 좌표를 가지고 바운드를 계산합니다.
   * @param rectanglePoints 사각형 좌표 (leftTop, rightTop, rightBottom, leftBottom)
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  static getBoundsRectangle(rectanglePoints, space = 2) {
    var half = space / 2;
    var x1 = Math.min(
      rectanglePoints.lt.x,
      rectanglePoints.rt.x,
      rectanglePoints.rb.x,
      rectanglePoints.lb.x
    );
    var y1 = Math.min(
      rectanglePoints.lt.y,
      rectanglePoints.rt.y,
      rectanglePoints.rb.y,
      rectanglePoints.lb.y
    );
    var x2 = Math.max(
      rectanglePoints.lt.x,
      rectanglePoints.rt.x,
      rectanglePoints.rb.x,
      rectanglePoints.lb.x
    );
    var y2 = Math.max(
      rectanglePoints.lt.y,
      rectanglePoints.rt.y,
      rectanglePoints.rb.y,
      rectanglePoints.lb.y
    );
    return {
      x: x1 - half,
      y: y1 - half,
      width: x2 - x1 + space,
      height: y2 - y1 + space,
    };
  }

  /**
   * 제곱근
   * @param x
   * @returns {number}
   */
  static sqr(x) {
    return x * x;
  }

  /**
   * 거리 구하기
   * @param a
   * @param b
   * @returns {number}
   */
  static dist2(a, b) {
    return Calc.sqr(a.x - b.x) + Calc.sqr(a.y - b.y);
  }

  /**
   * 점과 선에서 가장 가까운 거리가 되는 점을 반환합니다.
   * @param point 점 좌표
   * @param linePointA 라인 좌표
   * @param linePointB 라인 좌표
   * @returns {*} 점과 선에서 가장 가까운 거리가 되는 점의 좌표
   */
  static getShortestDistancePoint(point, linePointA, linePointB) {
    var l2 = Calc.dist2(linePointA, linePointB);
    if (l2 == 0) return linePointA;
    var t =
      ((point.x - linePointA.x) * (linePointB.x - linePointA.x) +
        (point.y - linePointA.y) * (linePointB.y - linePointA.y)) /
      l2;
    t = Math.max(0, Math.min(1, t));
    return {
      x: linePointA.x + t * (linePointB.x - linePointA.x),
      y: linePointA.y + t * (linePointB.y - linePointA.y),
    };
  }

  /**
   * 점과 선에서 가장 가까운 점을 반환 받아 거리를 계산해서 반환합니다.
   * @param point
   * @param linePointA
   * @param linePointB
   * @returns {*}
   */
  static distToSegmentSquared(point, linePointA, linePointB) {
    var distPoint = Calc.getShortestDistancePoint(
      point,
      linePointA,
      linePointB
    );
    return Calc.dist2(point, distPoint);
  }

  /**
   * 한 점과 한 라인 사이에 가장 가까운 거리를 구합니다.
   * @param point 점 좌표
   * @param linePointA 라인 좌표
   * @param linePointB 라인 좌표
   * @returns {number} 점과 선의 가장 가까운 거리값
   */
  static distToSegment(point, linePointA, linePointB) {
    return Math.sqrt(Calc.distToSegmentSquared(point, linePointA, linePointB));
  }

  /**
   * 두 점 사이의 차를 반환합니다.
   * @param point
   * @param distancePoint
   * @returns {{x: number, y: number}}
   */
  static getReturnPoint(point, distancePoint) {
    return { x: point.x - distancePoint.x, y: point.y - distancePoint.y };
  }

  /**
   * 이미지 회전 충돌 시 총돌한 점과 선의 거리를 구하고 거리만큼 이미지를 이동 시킵니다.
   * @param image 회전 이미지
   * @param point 충돌 체크할 점
   * @param linePointA 충돌 체크할 선분의 좌표
   * @param linePointB 충돌 체크할 선분의 좌표
   */
  static moveToCollision(image, point, line) {
    var distancePoint = Calc.getShortestDistancePoint(point, line.a, line.b);
    var returnPoint = Calc.getReturnPoint(point, distancePoint);
    image.x = image.x + returnPoint.x;
    image.y = image.y + returnPoint.y;
  }

  /**
   * 객체 회전 각도에 따라 다음 이동할 좌표를 구합니다.
   * @param centerX
   * @param centerY
   * @param distance
   * @param rotation
   * @returns {{x: *, y: *}}
   */
  static getNextMovePosition(centerX, centerY, radius, rotation) {
    //distance *= 0.4;
    var x = centerX + radius * Math.cos(rotation);
    var y = centerY + radius * Math.sin(rotation);

    //console.log(Calc.trace(x), Calc.trace(y), Calc.trace(distance * Math.cos(rotation)), Calc.trace(distance * Math.sin(rotation)));
    return { x: x, y: y };
  }

  /**
   * 부모 박스가 자식 박스를 포함하고 있는지 여부
   * imageUI에 isContainsBounds 와 같은 함수
   * @param parent
   * @param child
   * @returns {boolean}
   */
  static hasBox(parent, child) {
    var points = [child.lt, child.rt, child.rb, child.lb];

    for (let i = 0; i < points.length; i++) {
      if (
        Calc.isInsideSquare(
          points[i],
          parent.lt,
          parent.rt,
          parent.rb,
          parent.lb
        ) === false
      )
        return false;
    }
    return true;
  }

  static trace(number) {
    return Calc.leadingZero(parseInt(number));
  }

  static copyObject(obj) {
    var copy = {};
    for (var prop in obj) copy[prop] = obj[prop];
    return copy;
  }

  static getTriangleCenterPoint(p0, p1, p2) {
    return {
      x: (p0.x + p1.x + p2.x) / 3,
      y: (p0.y + p1.y + p2.y) / 3,
    };
  }

  static getLineMiddle(p0, p1) {
    return {
      x: (p0.x + p1.x) / 2,
      y: (p0.y + p1.y) / 2,
    };
  }
}

export default Calc;
