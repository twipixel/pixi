## 좋은 링크

- [컨볼루션 연산에 대해](https://kionkim.github.io/2018/06/08/Convolution_arithmetic/)
- [컨볼루션 매트릭스](https://docs.gimp.org/2.6/en/plug-in-convmatrix.html)
- WebGL shader examples by Javier Gracia Carpio
  - https://webgl-shaders.com/
    - Pixelated
  - https://jagracar.com/
- [glfx.js](https://evanw.github.io/glfx.js/docs/)
- [three.js 3D 셰이더](https://gist.github.com/greggman/41d93c00649cba78abdbfc1231c9158c). 



## 확인해볼 링크

- [WebGL Image Processing Youtube](https://www.youtube.com/watch?v=_ZQOUQsw_YI)



## vertex shader(정점) + fragment(그래그먼트) shader = program

- gl.drawArrays || gl.drawElements 



## shader 데이터 받을 수 있는 4가지 방법

1. Arribute, Buffer & Vertex Array

   - Buffer는 GPU에 올라가는 바이너리 데이터 배열
     - 위치, 법선, 텍스처 좌표, 정점 색상
     - 무작위 접근 불가
   - Attribute는 어떻게 버퍼에서 데이터를 가져올지, 그리고 정점 셰이더에 어떻게 전달할지 명시하기 위해 사용
     - 각각의 attribute 가 사용할 버퍼가 무엇인지, 버퍼로부터 데이터를 어떻게 추출하는지와 같은 attributes 상태를 VAO(Vertex Array Object)에 저장됩니다.

2. Uniform

   - Uniform은 셰이더 프로그램을 실행하기 전에 설정하는 전역 변수

3. Texture

   - 셰이더 프로그램에서 무작위 접근이 가능한 데이터 배열
     - 가장 일반적인 데이터는 이미지 데이터지만 텍스처는 단순히 데이터일 뿐이므로 색상 이외에 다른 데이터도 쉽게 저장 가능

4. Varying

   - 정점 셰이더에서 프래그먼트 셰이더로 데이터를 전달하기 위한 방안

   - [varying 전달 방식](https://webgl2fundamentals.org/webgl/lessons/ko/webgl-how-it-works.html)

     - vertex shader 에서 out vec4 v_color 선언
     - fragment shader 에서 in vec4 v_color 선언

     

     

## WebGL WorkFlow

- 쉐이더 생성
  - GLSL 소스 업로드
  - 셰이더 컴파일
- 프로그램 생성
  - 정점 셰이더 + 프래그먼트 셰이더 링크
- attribute 설정 (변수 설정)
- 그리기



## WebGL 좌표계

전통적인 2D 그래픽 API 방식은 좌상단이 0, 0

WebGL 클립 좌표 0, 0 은 좌하단

- -x 화면 안보이는 왼쪽, x 오른쪽

- -y 화면 안보이는 아래쪽, y 위쪽
- y축에 -1을 곱해주면 기존 방식처럼 노출
-  `gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1)` 



## Projection

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-2d-matrices.html

2D 좌표계 변환 처리를 projection 으로 이동

```javascript
  ...
  // 직사각형을 픽셀에서 0.0 에서 1.0으로 변환합니다.
  vec2 zeroToOne = position / u_resolution;
 
  // 0->1 에서 0->2로 변환합니다.
  vec2 zeroToTwo = zeroToOne * 2.0;
 
  // 0->2 에서 -1->+1 변환합니다.(클립 공간)
  vec2 clipSpace = zeroToTwo - 1.0;
 
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
```

>만약 이 단계를 차례대로 살펴보면 첫 단계인 "픽셀을 0.0에서 1.0으로 변환 "은 실제로 크기 변환입니다. 두 번째 단계 역시 크기 변환입니다. 다음은 이동을 하고 마지막으로 Y 축 -1만큼 크기 변환을 합니다. 우리는 실제로 이 모든 것을 하는 행렬을 쉐이더 전달할 수 있습니다. 2개의 크기 변환 행렬을 만들 수 있으며 하나는 1.0/해상도이며 하나는 2.0 크기 변환을 하며 3번째는 -1.0, -1.0만큼 이동하며 4번째로 Y 축 -1만큼 크기 변환하고 이 모든 것을 곱하는 대신에 수학은 간단하기 때문에 해상도에 대한 '투영'(projection) 함수를 만들 것입니다.

```js
var m3 = {
  projection: function (width, height) {
    // 참고: 0축이 맨위에 오도록 Y축을 뒤집습니다.
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1,
    ];
  },
  ...
```

1. 1.0 / 해상도
2. x 2 크기 변환
3. -1, -1 클립 공간 변환
4. y축 -1



##### 여기서 왜 행렬 마지막이 -1, 1, 1 이냐면, 아래 행렬에서

```js
1,  0,  0
0,  1,  1
tx, ty, 1
```

-1 ~ 1 의 클립 공간을 만들어 주기 위해서는 x 는 양수니까 -1, y 는 음수니까 1



## [행렬 곱 순서](https://webglfundamentals.org/webgl/lessons/ko/webgl-2d-matrices.html)

#### 2가지 방법

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-2d-matrices.html

> 이해하기 쉬운 느낌이 드는 걸로 사용

Pivot

 https://webgl2fundamentals.org/webgl/lessons/ko/webgl-2d-matrices.html



##### 1번째

예제의 방법

`projectionMat * translationMat * rotationMat * scaleMat * position`

```js
// Compute the matrices
var matrix = m3.projection(
  gl.canvas.clientWidth,
  gl.canvas.clientHeight
);
matrix = m3.translate(matrix, translation[0], translation[1]);
matrix = m3.rotate(matrix, rotationInRadians);
matrix = m3.scale(matrix, scale[0], scale[1]);
```

##### 1번째 + pivot

```js
var matrix = m3.projection(
  gl.canvas.clientWidth,
  gl.canvas.clientHeight
);
// 'F'의 원점을 한가운데로 이동시키는 행렬을 만듭니다.
// var moveOriginMatrix = m3.translation(-50, -75);
matrix = m3.translate(matrix, translation[0], translation[1]);
matrix = m3.rotate(matrix, rotationInRadians);
matrix = m3.scale(matrix, scale[0], scale[1]);
matrix = m3.translate(matrix, moveOriginX, moveOriginY);
```



##### 2번째

SRT (Scale, Rotation, Translation)

이유는 원점(0, 0)을 중심으로 스케일, 회전하고 이동을 해야 하기 때문

```javascript
scaledPosition = scaleMat * position
rotatedScaledPosition = rotationMat * scaledPosition
translatedRotatedScaledPosition = translationMat * rotatedScaledPosition
clipspacePosition = projectioMatrix * translatedRotatedScaledPosition
```

##### 2번째 + pivot

```javascript
// 'F'의 원점을 한가운데로 이동시키는 행렬을 만듭니다.
var moveOriginMatrix = m3.translation(-50, -75);
...
// 행렬 곱하기.
var matrix = m3.multiply(translationMatrix, rotationMatrix);
matrix = m3.multiply(matrix, scaleMatrix);
matrix = m3.multiply(matrix, moveOriginMatrix);
```





## 행렬 변환 이전 버전과 신규 버전

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-2d-matrices.html

##### 오래된 쉐이더

```javascript
#version 300 es
 
in vec2 a_position;
 
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
 
void main() {
  // 위치 크기 변환
  vec2 scaledPosition = a_position * u_scale;
 
  // 위치 회전 변환
  vec2 rotatedPosition = vec2(
     scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
     scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);
 
  // 이동에 추가
  vec2 position = rotatedPosition + u_translation;
```

##### 새로운 쉐이더

```javascript
#version 300 es
 
in vec2 a_position;
 
uniform vec2 u_resolution;
uniform mat3 u_matrix;
 
void main() {
  // 위치에 행렬을 곱하기.
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  ...
  
  
  ... 서비스 코드
	// Compute the matrices
  var translationMatrix = m3.translation(translation[0], translation[1]);
  var rotationMatrix = m3.rotation(rotationInRadians);
  var scaleMatrix = m3.scaling(scale[0], scale[1]);

  // Multiply the matrices.
  var matrix = m3.multiply(translationMatrix, rotationMatrix);
  matrix = m3.multiply(matrix, scaleMatrix);

  // Set the matrix.
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
```





## VAO (Vertext Attribute Object) 설명

vertexAttribPointer 에서 normalize 설정 참고

https://www.bsidesoft.com/4156

```javascript
//첫번째
gl.enableVertexAttribArray(location); 
 
//두번째
gl.bindBuffer(gl.ARRAY_BUFFER, someBuffer); 
 
//세번째
gl.vertexAttribPointer(  
    location,
    numComponents,
    typeOfData,
    normalizeFlag,
    strideToNextPieceOfData,
    offsetIntoBuffer);
```

> 첫번째 gl.enableVertexAttribArray()는 해당 애트리뷰트 위치를 사용할 수 있도록 설정합니다.
>
> 두번째로 gl.bindBuffer()에서 지금부터 애트리뷰트가 참조할 버퍼를 알려줍니다. 이 명령에서 첫번째 인자로 ARRAY_BUFFER를 주었으므로 두번째 인자로 전달한 버퍼(someBuffer)를 ARRAY_BUFFER의 바인드 포인트(bind point)로 바인드 한다는 의미이며, 이 바인드 포인트는 WebGL 내부의 전역변수가 됩니다.
>
> 마지막 세번째로 gl.vertexAttribPointer()는 애트리뷰트가 현재의 ARRAY_BUFFER의 바인드 포인트에서 데이터를 어떻게 가져올지 지시하는 역할을 합니다. 이 함수의 첫번째 인자는 애트리뷰트의 위치이며, 두번째 인자인 numComponents는 정점당 얼마나 많은 컴포넌트를 가져오는지 알려줍니다(항상 1~4이어야 함, 셰이더에서 vec1 ~ vec4이므로). 세번째 인자인 typeOfData에서 데이타의 타입은 무엇인지(BYTE, FLOAT, INT, UNSIGNED_SHORT등)를 알려줍니다. 네번째 인자인 normalizeFlag는 조금 있다가 자세히 언급하기로 하고요. 그리고 다섯번째 인자인 strideToNextPieceOfData에서 하나의 데이터 조각에서 다음 데이타 조각을 가져오기 위해 건너 뛸 바이트 수를 알려줍니다. 여섯번째 인자인 offsetIntoBuffer는 버퍼의 어디서 부터 읽기 시작할지 설정하지요.
>
> 테이터의 타입에 대해서 1개의 버퍼를 사용하는 경우에는 다섯번째 인자인 strideToNextPieceOfData와 여섯번째 인자인 offsetIntoBuffer는 보통 0이면 됩니다. strideToNextPieceOfData가 0이면 데이터 타입과 크기에 맞게 자동으로 데이터를 가져옴을 뜻합니다. offsetIntoBuffer가 0이면 버퍼의 처음 데이타부터 가져옴을 뜻하죠. 이들을 0이 아닌 다른 값으로 설정하는 것은 복잡하고 성능 면에서 별다른 이득이 없기 때문에 되도록 0을 지정하는 방향으로 쓰는 것이 좋겠습니다.
>
> 아직 언급하지 않는 gl.vertexAttribPointer()의 네번째 인자인 normalizeFlag에 대해서 설명하겠습니다. normalizeFlag는 입력되는 데이터를 정규화를 할 것인가 결정하는 건데요. 만약 이 값이 false이면 정규화를 하지 않는다는 의미로써, 데이터 타입이 BYTE의 경우는 -128 ~ 127, UNSIGNED_BYTE는 0 ~ 255, SHORT는 -32768 ~ 32767 데이타 범위를 그대도 애트리뷰트가 가져오게 됩니다. 하지만 이 값을 true로 설정하면 BYTE(-128 ~ 127 범위)의 값이 -1.0 ~ +1.0 으로 정규화됩니다. 비슷하게 UNSIGNED_BYTE(0 ~ 255)의 경우는 0.0 ~ +1.0으로 정규화되고, SHORT는 -1.0 ~ +1.0 이 됩니다. 단, SHORT의 경우 BYTE 보다는 훨씬 큰 값의 범위를 가지므로 더 높은 해상도의 값으로 표현되겠지요.
>
> 정규화된 데이타를 사용하는 가장 일반적인 경우는 색상 입니다. 색상은 0.0 ~ 1.0의 범위만 적용됩니다. 이전 코드에서 FLOAT로 지정했으므로 RGBA를 사용한다면 색상당 16바이트의 정점이 사용됩니다. 복잡한 지오메트리(geometry, 기하구조)를 가지는 데이타는 큰 용량을 가지는 FLOAT 데이터 타입이 필요할 수 있지만, 색상의 경우 FLOAT가 아닌 UNSIGNED_BYTE를 사용한다면 0 ~ 255 범위만 사용해도 충분합니다. 이때 GLSL 내에서 색의 범위는 0.0 ~ 1.0이므로 별도의 변환 없이 정규화 처리하면 됩니다. 이렇게 되면 각 정점의 색상 정보는 4바이트만 필요하게 되므로 75%의 용량을 절약할 수 있게 됩니다.



## 텍스쳐 유닛(texture unit)이란 무엇 입니까?

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-image-processing.html

`gl.draw???`를 호출할때 셰이더는 텍스처를 참조 할 수 있습니다. 텍스처들은 텍스처 유닛에 바인딩됩니다. 사용자의 디바이스에 따라 더 지원할 수도 있지만 기본적으로 WebGL2 스펙에서는 적어도 16개의 텍스처 유닛을 지원하도록 하고 있습니다. 각 샘플러 유닛이 참조하는 텍스쳐 유닛을 설정하기 위해서는 샘플러 uniform의 location을 찾고, 참조하길 원하는 텍스처 유닛의 인덱스를 설정하면 됩니다. 예를 들어:

```
var textureUnitIndex = 6; // 텍스쳐 유닛 6 사용var u_imageLoc = gl.getUniformLocation(    program, "u_image");gl.uniform1i(u_imageLoc, textureUnitIndex);
```

다른 텍스쳐들을 다른 유닛에 설정하기 위해 gl.activeTexture를 호출하고 원하는 유닛에 텍스처를 바인딩 하면 됩니다. 예를들어,

```
// 텍스처를 텍스쳐 유닛 6에 바인딩 합니다.gl.activeTexture(gl.TEXTURE6);gl.bindTexture(gl.TEXTURE_2D, someTexture);
```

아래와 같이 해도 됩니다.

```
var textureUnitIndex = 6; // 텍스쳐 유닛 6 사용.// 텍스처를 텍스쳐 유닛 6에 바인드 합니다.gl.activeTexture(gl.TEXTURE0 + textureUnitIndex);gl.bindTexture(gl.TEXTURE_2D, someTexture);
```



## `u_image`는 설정되지 않습니다. 이건 어떻게 동작하나요?

https://heweifeng.cn/webgl/lessons/ko/webgl-image-processing.html

Uniform은 0이 기본값이므로 u_image는 기본적으로 texture unit 0을 사용합니다. Texture unit 0도 default active texture 이므로 bindTexture를 호출하면 텍스처가 texture unit 0에 할당됩니다.

WebGL은 texture unit의 배열을 가지는데요. 각 sampler uniform이 참조하는 texture unit을 설정하기 위해, 해당 sampler uniform의 location을 탐색한 다음, 참조할 texture unit의 index로 설정합니다.

예제:

```
var textureUnitIndex = 6; // texture unit 6 사용var u_imageLoc = gl.getUniformLocation(program, "u_image");gl.uniform1i(u_imageLoc, textureUnitIndex);
```

다른 unit에 texture를 설정하려면 `gl.activeTexture`를 호출하고 원하는 unit에 texture를 할당하면 됩니다.

```
// texture unit 6에 someTexture 할당gl.activeTexture(gl.TEXTURE6);gl.bindTexture(gl.TEXTURE_2D, someTexture);
```

이것도 동작합니다.

```
var textureUnitIndex = 6; // texture unit 6 사용// texture unit 6에 someTexture 할당gl.activeTexture(gl.TEXTURE0 + textureUnitIndex);gl.bindTexture(gl.TEXTURE_2D, someTexture);
```

모든 WebGL 구현체들은 fragment shader에서 최소 8개의 texture unit을 지원해야 하지만 vertex shader에서는 0뿐 입니다. 따라서 8개 이상을 사용하려면 `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)`를 호출해서 몇 개가 있는지 확인해야 하고, vertex shader에서 텍스처를 사용하고 싶다면 `gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)`를 호출해서 몇 개를 사용할 수 있는지 알아보세요. 99% 이상의 기기들이 vertex shader에서 최소 4개 이상의 texture unit을 지원합니다.



## WebGL 프레임 버퍼

*framebuffer*는 단순한 attachment 모음

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-framebuffers.html



# framebufferTexture2D

https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferTexture2D

`attachment`

A [`GLenum`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types)에 대한 부착점을 지정합니다 `texture`. 가능한 값:

- `gl.COLOR_ATTACHMENT0`: 텍스처를 프레임 버퍼의 색상 버퍼에 연결합니다.
- `gl.DEPTH_ATTACHMENT`: 텍스처를 프레임 버퍼의 깊이 버퍼에 연결합니다.
- `gl.STENCIL_ATTACHMENT`: 텍스처를 프레임 버퍼의 스텐실 버퍼에 연결합니다.



## Buffer에 값을 쓰는 방법

1. bind (bindBuffer, bindTexture, bindFramebuffer)
2. write (bufferData, texImage2D, framebufferTexture2D)
3. attributePoint



## 여러 필터 적용

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-image-processing-continued.html

`gl.bindFramebuffer` 를 설정하면 frameBuffer 에 fragment Shader 의 출력(`outColor`) frameBuffer 로 되고 bindFrameBuffer(null) 을 통해서 canvas 로 out 을 출력하겠다고 설정. 

결국 다중 출력의 과정은 아래 설명처럼 원본 이미지에 kernel 을 적용하여 frameBuffer 에 그리고 맨 마지막에 kernel normal 적용한 최종 이미지를 캔버스에 출력 처리

```js
원본 이미지   -> [Blur]        -> 텍스처 1
텍스처 1      -> [Sharpen]     -> 텍스처 2
텍스처 2      -> [Edge Detect] -> 텍스처 1
텍스처 1      -> [Blur]        -> 텍스처 2
텍스처 2      -> [Normal]      -> 캔버스
```



## 텍스처 유닛

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-2-textures.html

텍스처 유닛에 대해 쉽게 생각해 보자면 다음과 같습니다: 모든 텍스처 관련 함수는 "활성화된(active) 텍스처 유닛"에 적용됩니다. "활성화된 텍스처 유닛"이란 단순히 여러분이 작업하고자 하는 텍스처 유닛의 인덱스인 전역 변수입니다. WebGL의 텍스처 유닛은 네 개의 타겟이 있습니다. TEXTURE_2D, TEXTURE_3D, TEXTURE_2D_ARRAY, TEXTURE_CUBE_MAP 입니다. 각 텍스처 함수는 현재 활성화된 텍스처 유닛의 명시된 타겟에 대해 동작합니다. 만일 WebGL을 자바스크립트를 활용해 구현한다면 아래와 같을겁니다.

```
var getContext = function() {  var textureUnits = [    { TEXTURE_2D: null, TEXTURE_3D: null, TEXTURE_2D_ARRAY: null, TEXTURE_CUBE_MAP: null, },    { TEXTURE_2D: null, TEXTURE_3D: null, TEXTURE_2D_ARRAY: null, TEXTURE_CUBE_MAP: null, },    { TEXTURE_2D: null, TEXTURE_3D: null, TEXTURE_2D_ARRAY: null, TEXTURE_CUBE_MAP: null, },    { TEXTURE_2D: null, TEXTURE_3D: null, TEXTURE_2D_ARRAY: null, TEXTURE_CUBE_MAP: null, },    { TEXTURE_2D: null, TEXTURE_3D: null, TEXTURE_2D_ARRAY: null, TEXTURE_CUBE_MAP: null, },    { TEXTURE_2D: null, TEXTURE_3D: null, TEXTURE_2D_ARRAY: null, TEXTURE_CUBE_MAP: null, },    { TEXTURE_2D: null, TEXTURE_3D: null, TEXTURE_2D_ARRAY: null, TEXTURE_CUBE_MAP: null, },    { TEXTURE_2D: null, TEXTURE_3D: null, TEXTURE_2D_ARRAY: null, TEXTURE_CUBE_MAP: null, },  ];  var activeTextureUnit = 0;   var activeTexture = function(unit) {    // 유닛 열거자를 인덱스로 변환합니다.    var index = unit - gl.TEXTURE0;    // 활성화된 텍스처 유닛을 설정합니다.    activeTextureUnit = index;  };   var bindTexture = function(target, texture) {    // 활성화된 텍스처 유닛의 타겟에 텍스처를 설정합니다.    textureUnits[activeTextureUnit][target] = texture;  };   var texImage2D = function(target, ...args) {    // 현재 텍스처 유닛의 활성화된 텍스처에 texImage2D를 호출합니다.    var texture = textureUnits[activeTextureUnit][target];    texture.image2D(...args);  };   var texImage3D = function(target, ...args) {    // 현재 텍스처 유닛의 활성화된 텍스처에 texImage3D를 호출합니다.    var texture = textureUnits[activeTextureUnit][target];    texture.image3D(...args);  };   // WebGL API를 반환합니다.  return {    activeTexture: activeTexture,    bindTexture: bindTexture,    texImage2D: texImage2D,    texImage3D: texImage3D,  };};
```

셰이더는 텍스처 유닛의 인덱스를 받습니다. 아래 두 줄의 코드의 의미가 명확해지셨길 바랍니다.

```
  gl.uniform1i(u_image0Location, 0);  // 텍스처 유닛 0  gl.uniform1i(u_image1Location, 1);  // 텍스처 유닛 1
```

하나 주의하셔야 할 것은, 유니폼을 설정할 때에는 텍스처 유닛의 인덱스를 사용하지만 gl.activeTexture를 호출할 때에는 gl.TEXTURE0, gl.TEXTURE1과 같은 특수한 상수를 사용해야 한다는 것입니다. 다행히 상수들은 연속된 숫자이므로 아래와 같이 하는 대신,

```
  gl.activeTexture(gl.TEXTURE0);  gl.bindTexture(gl.TEXTURE_2D, textures[0]);  gl.activeTexture(gl.TEXTURE1);  gl.bindTexture(gl.TEXTURE_2D, textures[1]);
```

이렇게 할 수 있습니다.

```
  gl.activeTexture(gl.TEXTURE0 + 0);  gl.bindTexture(gl.TEXTURE_2D, textures[0]);  gl.activeTexture(gl.TEXTURE0 + 1);  gl.bindTexture(gl.TEXTURE_2D, textures[1]);
```

아니면 이렇게도 가능합니다.

```
  for (var ii = 0; ii < 2; ++ii) {    gl.activeTexture(gl.TEXTURE0 + ii);    gl.bindTexture(gl.TEXTURE_2D, textures[ii]);  }
```



## orthographic 직교 투영 (2D 투영)

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-3d-orthographic.html

사소한 것 하나가 남았습니다. 대부분의 3d 수학 라이브러리에는 클립 공간에서 픽셀 공간으로 변환하는 `projection` 함수가 없습니다. 대신 보통 `ortho` 또는 `orthographic`이라고 정의된 함수가 있는데, 아래와 같이 생겼습니다.

```js
var m4 = {  orthographic: function(left, right, bottom, top, near, far) {    return [      2 / (right - left), 0, 0, 0,      0, 2 / (top - bottom), 0, 0,      0, 0, 2 / (near - far), 0,       (left + right) / (left - right),      (bottom + top) / (bottom - top),      (near + far) / (near - far),      1,    ];  }
```

우리가 정의한 간단한 `projection`함수는 width, height, depth만을 매개변수로 받지만, 위 함수는 좀더 일반적인 직교 투영 함수로써 left, right, bottom, top, near, far를 매개변수로 받아 좀더 유연합니다. 위 함수를 사용하여 원래 우리의 투영 함수와 동일한 결과를 얻기 위해서 아래와 같이 호출합니다.

```js
var left = 0;var right = gl.canvas.clientWidth;var bottom = gl.canvas.clientHeight;var top = 0;var near = 400;var far = -400;m4.orthographic(left, right, bottom, top, near, far);
```





## 텍스처 좌표

https://webgl2fundamentals.org/webgl/lessons/ko/webgl-3d-textures.html

`texture2D`: 텍스처에서 색상을 찾는 함수

- gl_FragColor = texture2D(u_texture, v_texcoord);

`CLAMP_TO_EDGE`: 텍스처를 특정 방향으로 반복하지 않도록 설정

> 아래는 X, Y 반복 안하겠다고 설정

- gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
- gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

`generateMipmap`

밉맵은 점진적으로 작아지는 이미지의 모음으로, 각각은 이전 이미지 크기의 1/4입니다. 

- `NEAREST` = 가장 큰 밉에서 1픽셀 선택
- `LINEAR` = 가장 큰 밉에서 4픽셀 선택 및 블렌딩
- `NEAREST_MIPMAP_NEAREST` = 최상의 밉을 선택하고, 밉에서 픽셀 1개를 선택
- `LINEAR_MIPMAP_NEAREST` = 최상의 밉을 선택하고, 밉에서 픽셀 4개를 블렌딩
- `NEAREST_MIPMAP_LINEAR` = 최상의 밉 2개를 선택하고, 각각 픽셀 1개를 선택한 다음 블렌딩
- `LINEAR_MIPMAP_LINEAR` = 최상의 밉 2개를 선택하고, 각각 픽셀 4개를 선택한 다음 블렌딩





## activeTexture

frameBuffer 나 canvas 에 2개 이미지를 같이 그릴 때 여러개 활성화하고 바인딩

```js
// Tell the shader to get the texture from texture unit 0
// set which texture units to render with.
gl.uniform1i(u_image0Location, 0); // texture unit 0
gl.uniform1i(u_image1Location, 1); // texture unit 1

// 텍스처 유닛에 사용할 텍스처를 설정합니다.
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textures[0]);
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, textures[1]);
```

