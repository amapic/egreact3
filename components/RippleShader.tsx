'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Vector2 } from 'three'

interface ClickPoint {
  position: Vector2;
  time: number;
}

const RippleShaderMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const clicksRef = useRef<ClickPoint[]>(Array(10).fill(null).map(() => ({
    position: new Vector2(0, 0),
    time: 0
  })))
  const clickIndexRef = useRef(0)
  const startTimeRef = useRef(Date.now())
  const lastMoveTime = useRef(0)
  const moveThreshold = 30

  // Paramètres ajustables
  const WAVE_SPEED = 0.1      // Vitesse de propagation (défaut: 0.5)
  const WAVE_LIFETIME = 1.5   // Durée de vie en secondes (défaut: 3.0)
  const WAVE_SPREAD = 0.1     // Vitesse d'expansion (défaut: 0.5)

  const shaderData = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uClicks: { value: Array(10).fill().map(() => new Vector2(0, 0)) },
        uClickTimes: { value: new Float32Array(10) },
        uColor1: { value: new THREE.Vector3(0.0, 0.0, 0.2) },
        uColor2: { value: new THREE.Vector3(16/255, 16/255, 16/255) },
        uWaveSpeed: { value: WAVE_SPEED },
        uWaveLifetime: { value: WAVE_LIFETIME },
        uWaveSpread: { value: WAVE_SPREAD },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uBaseRadius: { value: 0.4 },      // Rayon du cercle central
        uHaloStep: { value: 0.5 },       // Pas de dégradé du halo (plus petit = plus doux)
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uClicks[10];
        uniform float uClickTimes[10];
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uWaveSpeed;
        uniform float uWaveLifetime;
        uniform float uWaveSpread;
        uniform float uBaseRadius;
        uniform float uHaloStep;
        uniform vec2 uResolution;
        varying vec2 vUv;

        void main() {
          vec3 color = vec3(0.0);
          
          // Correction d'aspect pour toutes les coordonnées
          vec2 center = vec2(0.5);
          vec2 aspect = vec2(uResolution.x/uResolution.y, 1.0);
          vec2 scaledUv = (vUv - center) * aspect + center;
          
          // Cercle bleu avec halo
          float baseDist = distance(scaledUv, center);
          float haloIntensity = 1.0 - smoothstep(uBaseRadius - uHaloStep, uBaseRadius + uHaloStep, baseDist);
          vec3 blueColor = vec3(0.0, 0.0, 0.5);
          vec3 baseColor = blueColor * pow(haloIntensity, 2.0);

          // Ondes avec correction d'aspect
          vec3 waveColor = vec3(0.0);
          for(int i = 0; i < 10; i++) {
            vec2 clickPos = uClicks[i];
            float clickTime = uClickTimes[i];
            if(clickTime == 0.0) continue;
            
            vec2 scaledClickPos = (clickPos - center) * aspect + center;
            float clickDist = distance(scaledClickPos, center);
            
            // On ignore les clics en dehors du cercle de base
            if(clickDist > uBaseRadius) continue;
            
            float dist = distance(scaledUv, scaledClickPos);
            
            float timeSinceClick = uTime - clickTime;
            float speed = uWaveSpeed + timeSinceClick * uWaveSpread;
            float radius = timeSinceClick * speed;
            
            float wave = sin(dist * 50.0 - timeSinceClick * 4.0) * 0.5 + 0.5;
            float fadeOut = 1.0 - smoothstep(0.0, uWaveLifetime, timeSinceClick);
            float distanceFade = smoothstep(radius + 0.1, radius - 0.1, dist);
            wave *= fadeOut * distanceFade;
            
            waveColor += mix(uColor1, uColor2, wave) * wave * 0.5;
          }

          // Halo noir extérieur qui écrase progressivement les couleurs
          float haloIntensity2 = smoothstep(uBaseRadius - 0.1, uBaseRadius + 0.1, baseDist);
          vec3 backgroundColor = vec3(16.0/255.0, 16.0/255.0, 16.0/255.0);
          
          // Mélange final
          color = mix(baseColor + waveColor, backgroundColor, pow(haloIntensity2, 2.0));
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }),
    [WAVE_SPEED, WAVE_LIFETIME, WAVE_SPREAD] // Dépendances pour useMemo
  )

  useFrame(() => {
    if (materialRef.current) {
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000
      materialRef.current.uniforms.uTime.value = elapsedTime
      materialRef.current.uniforms.uClickTimes.value = new Float32Array(
        clicksRef.current.map(click => click.time)
      )
    }
  })

  const handleMouseMove = (event: MouseEvent) => {
    const currentTime = Date.now()
    if (currentTime - lastMoveTime.current > moveThreshold) {
      const x = event.clientX / window.innerWidth
      const y = 1.0 - event.clientY / window.innerHeight
      const currentTimeInSeconds = (currentTime - startTimeRef.current) / 1000
      
      clicksRef.current[clickIndexRef.current] = {
        position: new Vector2(x, y),
        time: currentTimeInSeconds
      }

      if (materialRef.current) {
        // Mise à jour des positions
        const positions = materialRef.current.uniforms.uClicks.value
        positions[clickIndexRef.current].set(x, y)
        
        // Mise à jour des temps
        const times = new Float32Array(clicksRef.current.map(click => click.time))
        materialRef.current.uniforms.uClickTimes.value = times
      }
      
      clickIndexRef.current = (clickIndexRef.current + 1) % 10
      lastMoveTime.current = currentTime
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={shaderData.uniforms}
        vertexShader={shaderData.vertexShader}
        fragmentShader={shaderData.fragmentShader}
      />
    </mesh>
  )
}

const RippleShaderFiber = ({ animate }: { animate: boolean }) => {
  return (
    <div id="ripple" className="absolute top-0 left-0 w-full h-screen" style={{ zIndex: -1 }}>
      <Canvas
        frameloop={animate ? "always" : "never"}
        camera={{
          position: [0, 0, 1],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <RippleShaderMaterial />
      </Canvas>
    </div>
  )
}

export default RippleShaderFiber