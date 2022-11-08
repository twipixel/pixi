## 출처

- [WebGL 기초](https://webglfundamentals.org/webgl/lessons/ko/)
- [WebGL2 기초](https://webgl2fundamentals.org/webgl/lessons/ko/)
- [WebGL 기초 1](http://www.bsidesoft.com/4009)
- [WebGL 기초 2](https://www.bsidesoft.com/?p=4023)
- [WebGL 기초 3](http://www.bsidesoft.com/4059)
- [WebGL 작동 방법의 이해 1](http://www.bsidesoft.com/4120)
- [WebGL 작동 방법의 이해 2](http://www.bsidesoft.com/4156)
- [WebGL1에서 WebGL2로](https://gaesignerblog.com/post/74)
- [WebGL 1 constants](https://code.i-harness.com/ko/docs/dom/webgl_api/constants#Standard_WebGL_1_constants)
- [WebGL 2 constants](https://code.i-harness.com/ko/docs/dom/webgl_api/constants#Additional_constants_defined_WebGL_2)
- [WebGL-Study](https://github.com/hanmomhanda/WebGL-Study)



## 용어

##### Shader

세이더는  GPU에 공급된 데이터로 어떻게 그림을 그리는지 GPU에 시킬 명령들을 선언한 것. 그러므로 명령을 수행하기에 앞서 세이더가 그림을 그리기 위한 데이타를 GPU에 먼저 제공 필요.

##### Vertex Shader

Vertex Shader의 역활은 clip 공간 좌표를 생성하는 것.

###### 데이터를 얻을 수 있는 방법 3가지

- Attribute (buffer에서 데이터를 가져옴)
- Uniform (단일 그리기 호출의 모든 vertex에 대해 동일하게 유지하는 값)
- Texture (pixel/texel의 데이터)

##### [clip 공간 좌표](https://en.wikipedia.org/wiki/Clip_coordinates)

클립 좌표계는 canvas의 크기에 상관없이 항상 -1 ~ +1 의 범위를 가집니다. 

##### Fragment Shader

Fragment Shader의 역할은 rasterization 되는 현재 픽셀의 색상을 제공하는 것 .

###### 데이터를 받는 3가지 방법

- Uniform (단일 그리기 호출의 모든  vertex에 대해 동일하게 유지하는 값)
- Texture (pixel/texel의 데이터)
- Varying (vertex shader에서 전달되고 보간된 데이터)

##### Fragment-Shader-Texture

Shader의 texture에서 값을 얻으려면 `sampler2D` uniform을 생성하고 GLSL 함수 `texture2D`를 사용해서 값을 추출해야 합니다.

```js
precision mediump float;
 
uniform sampler2D u_texture;
 
void main() {
  vec2 texcoord = vec2(0.5, 0.5)  // texture 중간에 있는 값 얻기
  gl_FragColor = texture2D(u_texture, texcoord);
}
```

Texture에서 나오는 데이터는 [많은 설정에 따라](https://webglfundamentals.org/webgl/lessons/ko/webgl-3d-textures.html) 달라집니다. 최소한 texture에 데이터를 생성하고 넣어야 하는데, 예를들어

```js
var tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
var level = 0;
var width = 2;
var height = 1;
var data = new Uint8Array([
  255, 0, 0, 255,   // 빨강 pixel
  0, 255, 0, 255,   // 초록 pixel
]);
gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data
);
```

초기화할 때 shader program에 있는 uniform 위치를 찾습니다.

```js
var someSamplerLoc = gl.getUniformLocation(someProgram, "u_texture");
```

렌더링할 때 texture unit에 texture를 할당합니다.

```js
var unit = 5;  // texture unit 선택
gl.activeTexture(gl.TEXTURE0 + unit);
gl.bindTexture(gl.TEXTURE_2D, tex);
```

그리고 texture를 할당한 unit을 shader에게 알려줍니다.

```js
gl.uniform1i(someSamplerLoc, unit);
```

##### buffers

버퍼는 개발자가 **GPU에 올릴 바이너리 배열 데이타**. 보통 버퍼에는 위치, 법선(normals), 텍스쳐 좌표, 버텍스 색 등과 같은 정보를 자유롭게 가질 수 있다.

##### attributes

애트리뷰트는 **버퍼에서 데이타를 가져와 버텍스 셰이더에 이를 제공할 방법을 지정하는데 사용**합니다. 가령, 3개의 위치를 32비트 부동소수점으로 버퍼에 넣었다면, 애트리뷰트는 버퍼에 쓰인 데이타가 버퍼의 어느 위치에 있고 몇 개를 어느 정도의 크기로 가져와야 하는지 알려주는 역화을 한다. 이 때, 무작위로 순서를 가져올 수 없고 버텍스 셰이더가 지정한 수만큼 실행. 이 수만큼 실행 때마다 버퍼의 다음 값이 순차적으로 애트리뷰트의 값으로 할당.

Attribute는 자료형으로 `float`, `vec2`, `vec3`, `vec4`, `mat2`, `mat3`, 그리고 `mat4`를 사용할 수 있습니다.

##### Uniforms

유니폼은 셰이더 실행하기 전에 정의하는 **전역 변수**. 이 전역 변수에 행렬 정보나 특정 필터 정보 또는 뷰포트 정보 등을 정의해두면 세이더가 이 변수의 데이타를 참고

참고로 uniform은 개별 shader program에 속합니다. 만약 이름이 같은 uniform을 가진 shader program이 여러 개 있다면 uniform은 둘 다 고유한 위치와 자체 값을 가집니다. `gl.uniform`을 호출하면 *현재 program*의 uniform만 설정됩니다. 현재 program은 `gl.useProgram`에 넘긴 마지막 program 입니다.

###### 자료형

```js
gl.uniform1f (floatUniformLoc, v);                 // float
gl.uniform1fv(floatUniformLoc, [v]);               // float 또는 float 배열
gl.uniform2f (vec2UniformLoc, v0, v1);             // vec2
gl.uniform2fv(vec2UniformLoc, [v0, v1]);           // vec2 또는 vec2 배열
gl.uniform3f (vec3UniformLoc, v0, v1, v2);         // vec3
gl.uniform3fv(vec3UniformLoc, [v0, v1, v2]);       // vec3 또는 vec3 배열
gl.uniform4f (vec4UniformLoc, v0, v1, v2, v4);     // vec4
gl.uniform4fv(vec4UniformLoc, [v0, v1, v2, v4]);   // vec4 또는 vec4 배열
 
gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // mat2 또는 mat2 배열
gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // mat3 또는 mat3 배열
gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // mat4 또는 mat4 배열
 
gl.uniform1i (intUniformLoc, v);                   // int
gl.uniform1iv(intUniformLoc, [v]);                 // int 또는 int 배열
gl.uniform2i (ivec2UniformLoc, v0, v1);            // ivec2
gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // ivec2 또는 ivec2 배열
gl.uniform3i (ivec3UniformLoc, v0, v1, v2);        // ivec3
gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // ivec3 또는 ivec3 배열
gl.uniform4i (ivec4UniformLoc, v0, v1, v2, v4);    // ivec4
gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // ivec4 또는 ivec4 배열
 
gl.uniform1i (sampler2DUniformLoc, v);             // sampler2D (texture)
gl.uniform1iv(sampler2DUniformLoc, [v]);           // sampler2D 또는 sampler2D 배열
 
gl.uniform1i (samplerCubeUniformLoc, v);           // samplerCube (texture)
gl.uniform1iv(samplerCubeUniformLoc, [v]);         // samplerCube 또는 samplerCube 배열
```

배열의 모든 uniform을 한번에 설정

```js
// shader
uniform vec2 u_someVec2[3];
 
// JavaScript에서 초기화 시
var someVec2Loc = gl.getUniformLocation(someProgram, "u_someVec2");
 
// 렌더링할 때
gl.uniform2fv(someVec2Loc, [1, 2, 3, 4, 5, 6]);  // set the entire array of u_someVec2
```

배열의 요소 개별적 설정

```js
// JavaScript에서 초기화할 때
var someVec2Element0Loc = gl.getUniformLocation(someProgram, "u_someVec2[0]");
var someVec2Element1Loc = gl.getUniformLocation(someProgram, "u_someVec2[1]");
var someVec2Element2Loc = gl.getUniformLocation(someProgram, "u_someVec2[2]");
 
// 렌더링할 때
gl.uniform2fv(someVec2Element0Loc, [1, 2]);  // 요소 0 설정
gl.uniform2fv(someVec2Element1Loc, [3, 4]);  // 요소 1 설정
gl.uniform2fv(someVec2Element2Loc, [5, 6]);  // 요소 2 설정
```

struct 생성

```js
struct SomeStruct {
  bool active;
  vec2 someVec2;
};
uniform SomeStruct u_someThing;
```

각 필드를 개별적 찾을 수 있슴

```js
var someThingActiveLoc = gl.getUniformLocation(someProgram, "u_someThing.active");
var someThingSomeVec2Loc = gl.getUniformLocation(someProgram, "u_someThing.someVec2");
```

##### Textures

텍스쳐는 셰이더에서 무작위로 접ㄱ이 가능한 배열로 된 데이타. 텍스처는 보통 이미지 데이터라고 생각할 수 있지만 텍스처 자체는 단순한 데이타이기 때문에 색상 뿐 아니라 다른 것도 쉽게 추가시킬 수 있다.

##### Varyings

베어링은 버텍스 셰이더에서 프래그먼트 셰이더로 데이타를 전달하는 방법을 제공. 버텍스 셰이더에서 제공하는 데이타를 베어링을 통해서 프렉먼트 셰이더에 전달해줌으로써 프래그먼트 셰이더에 정의된 특정 보간 처리를 수행할 수 있다. 그래서 베어링은 버텍스 셰이더(제공 측)와 프래그먼트 셰이더(사용 측) 둘 다 선언되어야 한다.

##### [Frame Buffer](http://iskim3068.tistory.com/21)

래스터 주사 방식에서 화면에 나타날 영상 정보를 일시적으로 저장하는 기억 장치.

##### [FiledOfView (FOV)](https://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html)

화각

##### Perspective 

원근 투영

```js
var m4 = {
  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);
 
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },
 
  ...
```



## 애트리뷰트와 버퍼

```js
// attribute는 buffer로부터 데이타를 받을 것입니다.
attribute vec4 a_position;
 
// 모든 shader는 main 함수를 가집니다.
void main() {
  // gl_Position은 버텍스 쉐이더에서
  // 설정을 담당하는 특수한 변수입니다.
  gl_Position = a_position;
}

```

위 예제에서 입력 애트리뷰트는 a_position 입니다. 이 애트리뷰트에서 사용 가능하도록 버퍼를 만들면 아래 코드와 같습니다.

```js
// 버퍼 생성
var positionBuffer = gl.createBuffer();

// bindPoint 선언, bufferData 호출하는 곳에 데이터와 bind 됩니다.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
];
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(positions),
  gl.STATIC_DRAW
);
// bufferData 를 실행하면 이전에 bindBuffer 를 호출한 buffer 를 바라보게 됩니다. 
// 여기서는 positionBuffer 에 해당

var positionAttributeLocation =
   gl.getAttribLocation(program, "a_position");
// 프로그램에서 a_position 애트리뷰트 참고

// WebGL 에게 buffer에서 데이터 받으라고 알림
gl.enableVertexAttribArray(positionAttributeLocation);

// 이 명령어는 buffer를 ARRAY_BUFFER bind point 에 할당. 이건 WebGL 내부에 있는 전역 변수
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// WebGL에서 현재 ARRAY_BUFFER bind piont 에 할당된 buffer에서 데이터를 가져오고, vertex 당 가져오는 방법을 알림.
var size = 2;          // 각 반복마다 2개씩 버퍼 데이타 참조
var type = gl.FLOAT;   // 32bit 부동 소수점 값
var normalize = false; // 데이터를 노말라이즈 하지 않는다.
var stride = 0;        // 0 = move forward size * sizeof(type) 각 반복마다 다음 위치
var offset = 0;        // 버퍼 시작 위치
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset
);

```



## 클립 / 화면 공간

클립 공간의 좌표값의 범위는 -1 ~ 1 입니다.

```js
var positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
];
```

위 positions 값을 gl.TRIANGLES 로 그리게 되면 canvas 사이즈가 500x500 이라고 했을 때 클립 좌표는 다음과 같이 화면 좌표로 변환 됩니다.

| 클립 공간 | 화면 공간 |
| --------- | --------- |
| 0, 0      | 250, 250  |
| 0, 0.5    | 250, 375  |
| 0.7, 0    | 425, 250  |



## 픽셀 단위로 그리기

u_resolution = 화면 해상도 (800x600)

```js
<script id="2d-vertex-shader" type="notjs">
//픽셀 단위 x, y좌표 애트리뷰트
attribute vec2 a_position;
 
//x축, y축 해상도 유니폼
uniform vec2 u_resolution;
 
void main() {
  // 픽셀을 0.0 ~ 1.0으로 위치 변환
  vec2 zeroToOne = a_position / u_resolution;
 
  // 0->1에서 0->2로 변환
  vec2 zeroToTwo = zeroToOne * 2.0;
 
  // 0->2에서 -1->+1로 변환(클립공간 좌표)
  vec2 clipSpace = zeroToTwo - 1.0;
 
  gl_Position = vec4(clipSpace, 0, 1);
}
</script>
```



## [2D projection 설명](https://webglfundamentals.org/webgl/lessons/ko/webgl-2d-matrices.html)

shader 안에 픽셀을 clip 공간으로 전환하는 코드

```js
...
// 사각형의 픽셀을 0.0에서 1.0사이로 전환
vec2 zeroToOne = position / u_resolution;

// 0->1에서 0->2로 전환
vec2 zeroToTwo = zeroToOne * 2.0;

// 0->2에서 -1->+1로 전환 (clipspace)
vec2 clipSpace = zeroToTwo - 1.0;

gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
```

###### 위 코드를 행렬로 변환 결과

```js
var m3 = {
  projection: function(width, height) {
    // 참고: 이 행렬은 Y축을 뒤집어서 0이 상단에 있도록 합니다.
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ];
  },
 
  ...
```

###### 수정된  vertex shader 코드

```js
attribute vec2 a_position;
 
uniform mat3 u_matrix;
 
void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
```

###### projection 행렬 적용 코드

```js
// 화면 그리기
function drawScene() {
    ...

    // 행렬 계산
    var projectionMatrix = m3.projection(
        gl.canvas.clientWidth, gl.canvas.clientHeight);

    ...

    // 행렬 곱하기
    var matrix = m3.multiply(projectionMatrix, translationMatrix);
    matrix = m3.multiply(matrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);

    ...
}
```



## [행렬 곱 순서](https://webglfundamentals.org/webgl/lessons/ko/webgl-2d-matrices.html)

SRT (Scale, Rotation, Translation)

이유는 원점을 중심으로 스케일, 회전하고 이동을 해야 하기 때문

