# 랜더 요약

Application.renderer.render(this.stage)

- renderer
  - CanvasRenderer
    - displayObject.renderCanvas(this)
      - Container._renderCanvas(renderer)
        - Graphics._renderCanas(renderer)
          - renderer.plugins.graphics.render(this)
            - CanvasGraphicsRenderer.render(**graphics**)
  - WebGLRenderer
    - displayObject.renderWebGL(this)
      - Container._renderWebGL(renderer)
        - Graphics._renderWebGL(renderer)
          - renderer.setObjectRenderer(renderer.plugins.graphics)
          - renderer.plugis.graphics.render(this)
            - GraphicsRenderer.render(**graphics**)

