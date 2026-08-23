'use client';

import React, { useEffect, useRef } from 'react';

interface NeuralNoiseCanvasProps {
  color?: [number, number, number];
  opacity?: number;
  speed?: number;
  className?: string;
}

export function NeuralNoiseCanvas({
  color = [0.71, 0.9, 0.1], // Default chartreuse tone (#B5E619)
  opacity = 0.55,
  speed = 0.0012,
  className = '',
}: NeuralNoiseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorRef = useRef<[number, number, number]>(color);
  const speedRef = useRef<number>(speed);

  // Keep refs up-to-date for the render loop without rebuilding the shader
  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, tX: window.innerWidth / 2, tY: window.innerHeight / 2 };
    let animationFrameId: number;
    let isDestroyed = false;

    const gl = (canvas.getContext('webgl', { powerPreference: 'high-performance', alpha: true }) || 
               canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
      console.warn('WebGL not supported for NeuralNoiseCanvas, falling back to CSS backdrop.');
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
        float scale = 6.0;
        for (int j = 0; j < 12; j++) {
          uv = rotate(uv, 0.9);
          sine_acc = rotate(sine_acc, 0.9);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.0 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.25;
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
        
        float noise = neuro_shape(uv, t, p);
        noise = 1.1 * pow(noise, 2.8);
        noise += pow(noise, 8.0);
        noise = max(0.0, noise - 0.4);
        noise *= (1.0 - length(vUv - 0.5) * 0.9);
        
        // Base dark tone (#001514) mixed with interactive color
        vec3 baseDark = vec3(0.0, 0.082, 0.078);
        vec3 col = mix(baseDark, u_color, clamp(noise * 0.85, 0.0, 1.0));
        
        gl_FragColor = vec4(col, clamp(noise * 0.7, 0.0, 1.0));
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, source: string, type: number) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error('Shader compilation error:', glCtx.getShaderInfoLog(shader));
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
      console.error('Program link error:', gl.getProgramInfoLog(program));
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

    function resizeCanvas() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75); // DPR clamp for mobile/perf
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uniforms.u_ratio) {
        gl.uniform1f(uniforms.u_ratio, canvas.width / canvas.height);
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches[0]) {
        pointer.tX = e.touches[0].clientX;
        pointer.tY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        pointer.tX = e.clientX;
        pointer.tY = e.clientY;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    function render(time: number) {
      if (isDestroyed || !gl) return;

      // Smooth pointer lerp
      pointer.x += (pointer.tX - pointer.x) * 0.08;
      pointer.y += (pointer.tY - pointer.y) * 0.08;

      gl.useProgram(program);
      
      if (uniforms.u_time) gl.uniform1f(uniforms.u_time, time);
      if (uniforms.u_pointer_position) {
        gl.uniform2f(
          uniforms.u_pointer_position,
          pointer.x / window.innerWidth,
          1.0 - pointer.y / window.innerHeight
        );
      }

      const currentColor = colorRef.current;
      if (uniforms.u_color) {
        gl.uniform3f(uniforms.u_color, currentColor[0], currentColor[1], currentColor[2]);
      }

      if (uniforms.u_speed) {
        gl.uniform1f(uniforms.u_speed, speedRef.current);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);

      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(vertexBuffer);
      }
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Fallback ambient glow in brand dark base */}
      <div 
        className="absolute inset-0 bg-[#001514] opacity-95 transition-colors duration-700" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 10%, rgba(181, 230, 25, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 85% 70%, rgba(142, 89, 47, 0.09) 0%, transparent 50%),
            radial-gradient(circle at 15% 85%, rgba(175, 194, 213, 0.05) 0%, transparent 50%)
          `
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity }}
      />
      {/* Subtle scanline / texture vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, transparent 40%, rgba(0, 21, 20, 0.8) 100%)'
        }}
      />
    </div>
  );
}
