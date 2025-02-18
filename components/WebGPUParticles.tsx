"use client";
import { useEffect, useRef } from 'react';

const WebGPUParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Shader WGSL pour les particules
  const particleShader = `
    struct Particle {
      position: vec2<f32>,
      velocity: vec2<f32>,
      color: vec4<f32>,
    };

    struct Uniforms {
      deltaTime: f32,
      mousePos: vec2<f32>,
    };

    @binding(0) @group(0) var<uniform> uniforms: Uniforms;
    @binding(1) @group(0) var<storage, read_write> particles: array<Particle>;

    @compute @workgroup_size(64)
    fn computeMain(@builtin(global_invocation_id) id: vec3<u32>) {
      let i = id.x;
      if (i >= arrayLength(&particles)) {
        return;
      }

      var particle = particles[i];
      
      // Update position based on velocity
      particle.position = particle.position + particle.velocity * uniforms.deltaTime;
      
      // Bounce off edges
      if (particle.position.x < -1.0 || particle.position.x > 1.0) {
        particle.velocity.x = -particle.velocity.x;
      }
      if (particle.position.y < -1.0 || particle.position.y > 1.0) {
        particle.velocity.y = -particle.velocity.y;
      }

      // Mouse interaction
      let mouseDir = uniforms.mousePos - particle.position;
      let dist = length(mouseDir);
      if (dist < 0.1) {
        particle.velocity = particle.velocity + normalize(mouseDir) * 0.1;
      }

      particles[i] = particle;
    }

    struct VertexOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) color: vec4<f32>,
    };

    @vertex
    fn vertexMain(@location(0) position: vec2<f32>, @location(1) color: vec4<f32>) -> VertexOutput {
      var output: VertexOutput;
      output.position = vec4<f32>(position, 0.0, 1.0);
      output.color = color;
      return output;
    }

    @fragment
    fn fragmentMain(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
      return color;
    }
  `;

  useEffect(() => {
    const initWebGPU = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Vérifier le support WebGPU
      if (!navigator.gpu) {
        console.error('WebGPU not supported');
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        console.error('No adapter found');
        return;
      }

      const device = await adapter.requestDevice();
      const context = canvas.getContext('webgpu');
      if (!context) {
        console.error('No WebGPU context');
        return;
      }

      // Configuration du canvas
      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({
        device,
        format,
        alphaMode: 'premultiplied',
      });

      // Création des particules
      const NUM_PARTICLES = 1000;
      const particles = new Float32Array(NUM_PARTICLES * 6); // position(2) + velocity(2) + color(2)
      
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const baseIndex = i * 6;
        // Position aléatoire
        particles[baseIndex] = Math.random() * 2 - 1;     // x
        particles[baseIndex + 1] = Math.random() * 2 - 1; // y
        // Vélocité aléatoire
        particles[baseIndex + 2] = (Math.random() - 0.5) * 0.1;
        particles[baseIndex + 3] = (Math.random() - 0.5) * 0.1;
        // Couleur
        particles[baseIndex + 4] = Math.random();
        particles[baseIndex + 5] = Math.random();
      }

      // Création des buffers
      const particleBuffer = device.createBuffer({
        size: particles.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
      });
      new Float32Array(particleBuffer.getMappedRange()).set(particles);
      particleBuffer.unmap();

      // Création du pipeline
      const pipeline = device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: device.createShaderModule({
            code: particleShader,
          }),
          entryPoint: 'computeMain',
        },
      });

      // Animation loop
      let animationFrameId: number;
      const render = () => {
        // Update uniforms
        // Render particles
        // Request next frame
        animationFrameId = requestAnimationFrame(render);
      };

      render();

      return () => {
        cancelAnimationFrame(animationFrameId);
        device.destroy();
      };
    };

    initWebGPU();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ background: 'black' }}
    />
  );
};

export default WebGPUParticles;