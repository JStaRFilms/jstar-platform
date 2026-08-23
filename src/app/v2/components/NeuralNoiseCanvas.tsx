'use client';

import React, { useEffect, useRef } from 'react';

interface NeuralNoiseProps {
  color?: [number, number, number];
  opacity?: number;
  speed?: number;
}

export const NeuralNoiseCanvas: React.FC<NeuralNoiseProps> = ({
  color = [0.71, 0.90, 0.10], // Default chartreuse: #B5E619 in normalized RGB
  opacity = 0.85,
  speed = 0.0012,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl = (canvasEl.getContext('webgl') ||
      canvasEl.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
      return;
    }

    const vsSource = `
      precision mediump float;
      varying vec2 vUv;
      attribute vec2 a_position;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform vec3 u_color;
      uniform float u_speed;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 8.0;
        for (int j = 0; j < 14; j++) {
          uv = rotate(uv, 1.0);
          sine_acc = rotate(sine_acc, 1.0);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.2;
        }
        return res.x + res.y;
      }

      void main() {
        vec2 uv = 0.5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0.0, 1.0);
        p = 0.5 * pow(1.0 - p, 2.0);
        float t = u_speed * u_time;
        vec3 col = vec3(0.0);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.0);
        noise = max(0.0, noise - 0.5);
        noise *= (1.0 - length(vUv - 0.5));
        col = u_color * noise;
        gl_FragColor = vec4(col, noise * 0.85);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, source: string, type: number) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    const uniforms = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_ratio: gl.getUniformLocation(program, 'u_ratio'),
      u_pointer_position: gl.getUniformLocation(program, 'u_pointer_position'),
      u_color: gl.getUniformLocation(program, 'u_color'),
      u_speed: gl.getUniformLocation(program, 'u_speed'),
    };

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let animationId: number;

    const resizeCanvas = () => {
      if (!canvasEl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasEl.width = canvasEl.clientWidth * dpr;
      canvasEl.height = canvasEl.clientHeight * dpr;
      if (uniforms.u_ratio) {
        gl.uniform1f(uniforms.u_ratio, canvasEl.width / (canvasEl.height || 1));
      }
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    gl.uniform3f(uniforms.u_color, color[0], color[1], color[2]);
    gl.uniform1f(uniforms.u_speed, speed);

    const render = () => {
      const currentTime = performance.now();
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.15;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.15;

      gl.uniform1f(uniforms.u_time, currentTime);
      const rect = canvasEl.getBoundingClientRect();
      const normX = (pointer.current.x - rect.left) / (rect.width || 1);
      const normY = 1 - (pointer.current.y - rect.top) / (rect.height || 1);

      gl.uniform2f(uniforms.u_pointer_position, normX, normY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (e: PointerEvent) => {
      pointer.current.tX = e.clientX;
      pointer.current.tY = e.clientY;
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(vertexBuffer);
    };
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0 pointer-events-none"
      style={{ opacity }}
    />
  );
};

export default NeuralNoiseCanvas;
