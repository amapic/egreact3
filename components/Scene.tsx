"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { OrbitControls, MeshTransmissionMaterial } from "@react-three/drei";
import {
  Canvas,
  useFrame,
  extend,
  useThree,
  AmbientLight,
} from "@react-three/fiber";
import { lerp, damp } from "three/src/math/MathUtils";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import React from "react";

extend({ Bloom });
const CustomGeometryParticles = (props: {
  count: number;
  caca: (value: boolean) => void;
}) => {
  const { count, caca } = props;
  const frameCountRef = useRef(0);
  const points = useRef();
  const referencePoints = useRef(); // Points de référence non affichés
  const sphereRefs = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3());
  const maxRadius = 0.01; // Rayon maximum de déplacement de la caméra

  const fpsBuffer = useRef<number[]>([]);
  const lastTime = useRef(performance.now());

  const particleTimesteps = useRef(null);
  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uFlash: { value: 0.0 },
  });

  const { camera } = useThree();
  const cameraDirection = useRef(new THREE.Vector3());
  const leaderFrequency = 10000;
  // Tableau pour stocker les temps de dernière interaction pour chaque point
  const lastInteractionTimes = useRef(new Float32Array(count).fill(-1));
  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying float vDistance;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      // Calculer la distance avec la souris dans l'espace de projection
      vec2 screenPosition = projectedPosition.xy / projectedPosition.w;
      vDistance = length(screenPosition - uMouse);

      gl_Position = projectedPosition;
      // La taille de base est multipliée par l'inverse de la distance à la caméra
      gl_PointSize = 20.0 * (1.0 / -viewPosition.z);
      // gl_PointSize = 10.0;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uFlash;
    varying float vDistance;

    void main() {
      // Créer un point rond
      vec2 center = gl_PointCoord - 0.5;
      float dot = 1.0 - smoothstep(0.0, 0.5, length(center));

      // Couleur basée sur la distance à la souris
      vec3 blueColor = vec3(0.0, 0.5, 1.0);
      vec3 pinkColor = vec3(1.0, 0.2, 0.8);
      vec3 flashColor = vec3(1.0, 1.0, 1.0);
      
      float colorMix = smoothstep(0.5, 0.0, vDistance);
      vec3 baseColor = mix(blueColor, pinkColor, colorMix);
      
      // Mélanger avec la couleur de l'éclair
      vec3 finalColor = mix(baseColor, flashColor, uFlash);

      gl_FragColor = vec4(finalColor, dot);
    }
  `;

  

  useFrame((state) => {
    // if (isScrolling) return;

    // Calcul des FPS
    const now = performance.now();
    const delta = now - lastTime.current;
    const currentFps = 1000 / delta;

    fpsBuffer.current.push(currentFps);
    if (fpsBuffer.current.length > 30) {
      fpsBuffer.current.shift();
    }

    // Moyenne des FPS sur les 30 dernières frames
    const averageFps =
      fpsBuffer.current.reduce((a, b) => a + b) / fpsBuffer.current.length;
    if (frameCountRef.current % 10 === 0) {
      // Update FPS display every 10 frames
      console.log(Math.round(averageFps));
    }

    lastTime.current = now;
  });

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const distance = 1;

    for (let i = 0; i < count; i++) {
      const golden_ratio = (1 + Math.sqrt(5)) / 2;
      const theta = (2 * Math.PI * i) / golden_ratio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);

      let sphereX = distance * Math.sin(phi) * Math.cos(theta);
      let sphereY = distance * Math.sin(phi) * Math.sin(theta);
      let sphereZ = distance * Math.cos(phi);

      positions.set([sphereX, sphereY, sphereZ], i * 3);
    }

    return positions;
  }, [count]);

  const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t;

  // Initialiser les timesteps aléatoires une seule fois
  useEffect(() => {
    particleTimesteps.current = new Float32Array(count).map(
      () => 0.05 + Math.random() * 0.2 // Valeurs entre 0.05 et 0.15
    );
  }, [count]);

  const lastUpdate = useRef(0);
  const targetFPS = 50; // 50 fois par seconde
  const frameInterval = 1 / targetFPS;

  useFrame((state) => {
    const { clock, camera, mouse } = state;

    lastUpdate.current = clock.elapsedTime; // Sauvegarder le nouveau timestamp

    const currentTime = clock.elapsedTime;
    uniforms.current.uTime.value = currentTime;

    // console.log(camera.rotation.x, camera.rotation.y, camera.rotation.z);
    frameCountRef.current++;

    // Déclencher un éclair aléatoirement
    if (Math.random() < 0.005) {
      uniforms.current.uFlash.value = 1.0;
      setTimeout(() => {
        uniforms.current.uFlash.value = 0.0;
      }, 100);
    }

    // Paramètres de Halvorsen
    const a = -5.5;
    const b = 3.5;
    const d = -1;
    let normalTimestep = 0.1;
    let leaderTimestep = 0.1; // Timestep plus élevé pour les leaders

    if (frameCountRef.current == 100) {
      caca(true);
    }
    if (frameCountRef.current > 100) {
      normalTimestep = 0.001;
      leaderTimestep = 0.001;
    }
    // Paramètres de dilatation et retour
    const dilationStrength = 0.3;
    const dilationRadius = 1.0;
    const returnSpeed = 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const isLeader = i % leaderFrequency === 0;
      const timestep = leaderTimestep;

      const pos = new THREE.Vector3(
        points.current.geometry.attributes.position.array[i3],
        points.current.geometry.attributes.position.array[i3 + 1],
        points.current.geometry.attributes.position.array[i3 + 2]
      );

      // Équations de Halvorsen avec le timestep variable
      const dx = pos.y * timestep;
      const dy = pos.z * timestep;
      const dz =
        (-a * pos.x - b * pos.y - pos.z + d * Math.pow(pos.x, 3)) * timestep;

      points.current.geometry.attributes.position.array[i3] += dx;
      points.current.geometry.attributes.position.array[i3 + 1] += dy;

      points.current.geometry.attributes.position.array[i3 + 2] += dz;

      // }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particlesPosition.length / 3}
            array={new Float32Array(particlesPosition.length / 3).map((_, i) =>
              i % leaderFrequency === 0 ? 50.0 : 20.0
            )}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms.current}
          transparent={true}
          depthWrite={false}
        />
      </points>
      <points ref={referencePoints} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition.slice()}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
      <group>
        {Array(Math.floor(count / leaderFrequency))
          .fill(null)
          .map((_, index) => (
            <mesh
              key={index}
              ref={(el) => (sphereRefs.current[index] = el)}
              position={[
                points.current?.geometry.attributes.position.array[
                  index * leaderFrequency * 3
                ] || 0,
                points.current?.geometry.attributes.position.array[
                  index * leaderFrequency * 3 + 1
                ] || 0,
                points.current?.geometry.attributes.position.array[
                  index * leaderFrequency * 3 + 2
                ] || 0,
              ]}
            >
              <sphereGeometry args={[0.01, 16, 16]} />
              <meshBasicMaterial
                color={[0, 127, 255]}
                // emissive="#0000ff"
                // emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
          ))}
      </group>
    </>
  );
};

const ChangeCameraPosition = ({
  param,
}: {
  param: React.RefObject<number>;
}) => {
  const { camera } = useThree();
  const posCamera = useRef("pos1");
  const targetZ = useRef(-0.1686306495657644); // Valeur z initiale
  const mouse = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3());
  const maxRadius = 0.01; // Rayon maximum de déplacement de la caméra
  
  useFrame(({ camera }) => {
    // Calculer la position cible de la caméra
    const theta = mouse.current.x * Math.PI * 2; // Angle horizontal

    const phi = mouse.current.y * Math.PI * 0.5; // Angle vertical

    // Calculer la nouvelle position cible sur une sphère
    targetPosition.current.x = maxRadius * Math.sin(theta) * Math.cos(phi);
    targetPosition.current.y = maxRadius * Math.sin(phi);
    targetPosition.current.z = maxRadius * Math.cos(theta) * Math.cos(phi);

    // Appliquer un lerp à la position de la caméra
    // camera.position.x = lerp(camera.position.x, targetPosition.current.x, 0.05);
    // camera.position.y = lerp(camera.position.y, targetPosition.current.y, 0.05);
    // camera.position.z = lerp(camera.position.z, targetPosition.current.z, 0.05);

    // Faire regarder la caméra vers l'origine
    // camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normaliser les coordonnées de la souris entre -0.5 et 0.5
      // mouse.current.x = (event.clientX / window.innerWidth - 0.5);
      // mouse.current.y = (event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  
  useFrame(() => {
    // Applique le lissage à chaque frame
    if (posCamera.current === "pos2") {
      const smoothFactor = 0.1;
      const newZ = lerp(camera.position.z, targetZ.current, smoothFactor);
      camera.position.z = newZ;
    }
  });
  // Fonction d'interpolation linéaire (lerp)
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const MiseEnPosition1 = () => {
    camera.position.set(-0.43, -8.56, -0.09);
    camera.rotation.set(1.58, -0.05, 1.79);
    posCamera.current = "pos1";
  };

  const MiseEnPosition2 = () => {
    const element = document.getElementById("screen2");
    if (!element) return; // Protection contre element null

    if (window.scrollY - element.offsetTop > 0) {
      camera.rotation.set(1.76, -1.04, 1.79);

      camera.position.set(
        -1.513451287958616,
        -0.8576845145905376,
        -0.1686306495657644
      );
      posCamera.current = "pos2";
      // -(window.scrollY - element.offsetTop) / (3 * window.innerHeight);

      // camera.position.set(1.764931612524174 ,-1.047042362292991, 1.7940590045378362)
      //  camera.rotation.set(-1.513451287958616 ,-0.8576845145905376 ,-0.1686306495657644)
    }
  };

  const GlissementCamera = () => {
    const element = document.getElementById("screen3");
    if (!element) return;

    if (window.scrollY - element.offsetTop > 0) {
      camera.rotation.set(1.76, -1.04, 1.79);

      // Calcul de la position z cible
      const targetPosition =
        -0.1686306495657644 -
        (window.scrollY - element.offsetTop) / (3 * window.innerHeight);

      // Mise à jour de la valeur cible
      targetZ.current = targetPosition;

      // Position avec lerp pour un mouvement plus doux
      const smoothFactor = 0.1; // Ajustez cette valeur entre 0 et 1 pour modifier la vitesse de lissage
      const newZ = lerp(camera.position.z, targetZ.current, smoothFactor);

      camera.position.set(-1.513451287958616, -0.8576845145905376, newZ);
    }
  };

  useEffect(() => {
    if (document && typeof window !== "undefined") {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            // interference entre les deux fonctions
            if (posCamera.current === "pos1") {
              MiseEnPosition2();
            }
            GlissementCamera();
            ticking = false;
          });

          ticking = true;
        }
      };

      document.addEventListener("scroll", handleScroll);
      return () => document.removeEventListener("scroll", handleScroll);
    }
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois

  useEffect(() => {
    // camera.position.set(camera.position.x, camera.position.y, param.current/100);
    // console.log(param.current);
    if (typeof window !== "undefined") {
      const initGSAP = async () => {
        const gsap = (await import("gsap")).default;
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        const ScrollToPlugin = (await import("gsap/ScrollToPlugin")).default;

        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        //marche pas se déclenche qd screen 2 pas créé
        ScrollTrigger.create({
          trigger: document.getElementById("screen2"),
          start: "top 95%",
          end: "bottom 95%",
          onEnter: () => {
            // change1();
          },
        });

        ScrollTrigger.create({
          trigger: document.getElementById("screen1"),
          start: "bottom top",
          // markers: true,
          onEnter: () => {
            // caca2()
          },
          onEnterBack: () => {
            MiseEnPosition1();
          },
        });
      };

      initGSAP();
    }
  }, [param.current]);

  return null;
};

export const Scene = ({
  param,
  caca,
}: {
  param: React.RefObject<number>;
  caca: (value: boolean) => void;
}) => {
  return (
    <div
      id="screen1"
      className="fixed top-0 left-0 w-full h-screen bg-grey"
      style={{ width: "100%", height: "100vh" }}
    >
      <Canvas
        camera={{
          position: [-0.43, -8.56, -0.09],
          rotation: [1.58, -0.05, 1.79],
          far: 15,
        }}
        // position: [-5.2, -8, -0.5] }
        // -0.45 -0.2 -0.71
        gl={{
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#101010", 1);
        }}
      >
        <ambientLight intensity={0.5} />
        <CustomGeometryParticles caca={caca} count={10000} />
        <EffectComposer>
          <Bloom
            intensity={0.1}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.1}
            mipmapBlur
          />
        </EffectComposer>
        {/* <OrbitControls
          // enableZoom={false}
          // enablePan={false}
          // enableRotate={true}
        /> */}
        <ChangeCameraPosition param={param} />
        {/* <axesHelper args={[1]} /> */}
      </Canvas>
    </div>
  );
};

export default Scene;
