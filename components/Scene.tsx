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

import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import React from "react";

extend({ Bloom });
const CustomGeometryParticles = (props) => {
  const { count } = props;
  const points = useRef();
  const referencePoints = useRef(); // Points de référence non affichés
  const sphereRefs = useRef([]);
  const lastResetTime = useRef(0);
  const particleTimesteps = useRef(null);
  const [uniforms] = useState({
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

  const mousePos = useRef({ x: 0, y: 0 });

  

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      const mouse3D = new THREE.Vector3(x, y, 0.5);

      mouse3D.unproject(camera);
      //console.log("mouse3D", mouse3D);
      //console.log("camera", camera.position);
      const dir = mouse3D.sub(camera.position).normalize();
      // console.log("dir", dir);
      const distance = -camera.position.z / dir.z;
      // console.log("distance", distance);
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      // console.log("pos", pos);

      mousePos.current = {
        x: (pos.x + 1) * 0.5,
        y: (pos.y + 1) * 0.5,
      };
      // console.log(x, y);

      // Direction dans laquelle regarde la caméra
      const cameraDirectionLocal = new THREE.Vector3();
      camera.getWorldDirection(cameraDirectionLocal);
      // console.log("camera direction", cameraDirectionLocal);
      cameraDirection.current = cameraDirectionLocal;
      // camera.curren
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera]);

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

  useFrame((state) => {
    const { clock, camera, mouse } = state;
    const currentTime = clock.elapsedTime;
    uniforms.uTime.value = currentTime;

    // console.log(camera.position.x, camera.position.y, camera.position.z);

    // Déclencher un éclair aléatoirement
    if (Math.random() < 0.005) {
      uniforms.uFlash.value = 1.0;
      setTimeout(() => {
        uniforms.uFlash.value = 0.0;
      }, 100);
    }

    // Paramètres de Halvorsen
    const a = -5.5;
    const b = 3.5;
    const d = -1;
    let normalTimestep = 0.1;
    let leaderTimestep = 0.1; // Timestep plus élevé pour les leaders
    // Une particule sur 1000 sera un leader
    const P = new THREE.Vector3(
      mousePos.current.x * 2.0 - 1.0,
      mousePos.current.y * 2.0 - 1.0,
      0.0
    );

    // Direction de la caméra (normalisée)
    const D = new THREE.Vector3();
    camera.getWorldDirection(D);
    D.normalize();

    if (currentTime > 1) {
      normalTimestep = 0.001;
      leaderTimestep = 0.001;
    }
    // Paramètres de dilatation et retour
    const dilationStrength = 0.3;
    const dilationRadius = 1.0;
    const returnSpeed = 0.5;

    // Setup raycaster
    const planeNormal = new THREE.Vector3(0, 0, 1);
    const planeConstant = 0;
    const plane = new THREE.Plane(planeNormal, planeConstant);
    const raycaster = new THREE.Raycaster();
    const mousePosition = new THREE.Vector3();

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, mousePosition);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Utiliser le timestep spécifique à la particule
      const isLeader = i % leaderFrequency === 0;
      // const timestep = isLeader ? leaderTimestep : particleTimesteps.current[i];
      const timestep = leaderTimestep;
      // Position actuelle du point
      // const pos = {
      //   x: points.current.geometry.attributes.position.array[i3],
      //   y: points.current.geometry.attributes.position.array[i3 + 1],
      //   z: points.current.geometry.attributes.position.array[i3 + 2]
      // };

      const pos = new THREE.Vector3(
        points.current.geometry.attributes.position.array[i3],
        points.current.geometry.attributes.position.array[i3 + 1],
        points.current.geometry.attributes.position.array[i3 + 2]
      );

      // Calcul de la distance point-droite
      const AP = pos.clone().sub(P);
      const projection = P.clone().add(D.clone().multiplyScalar(AP.dot(D)));
      const distance = pos.distanceTo(projection);

      // console.log("Distance à la droite:", distance);
      // console.log("Position particule:", pos);
      // console.log("Position souris:", P);
      // console.log("Direction caméra:", D);
      // console.log("Point projeté:", projection);

      // Direction vers l'extérieur (depuis l'origine vers le point)
      const outwardDir = pos.clone().normalize();

      // Effet de répulsion basé sur la distance
      const strength = Math.max(0.1 / (1.0 + distance * distance), 0.01);
      const repulsion = outwardDir.multiplyScalar(strength * 0.5);

      // Appliquer la répulsion
      // if (distance < 0.5) { // Limite la zone d'effet
      //   points.current.geometry.attributes.position.array[i3] += repulsion.x;
      //   points.current.geometry.attributes.position.array[i3 + 1] += repulsion.y;
      //   points.current.geometry.attributes.position.array[i3 + 2] += repulsion.z;

      //   // Mettre à jour le temps d'interaction pour le retour progressif
      //   lastInteractionTimes.current[i] = currentTime;
      // }
      // Position de référence
      // const refPos = {
      //   x: referencePoints.current.geometry.attributes.position.array[i3],
      //   y: referencePoints.current.geometry.attributes.position.array[i3 + 1],
      //   z: referencePoints.current.geometry.attributes.position.array[i3 + 2]
      // };

      // const isLeader = i % leaderFrequency === 0;
      // const timestep = isLeader ? leaderTimestep : particleTimesteps.current[i];

      const refPos = {
        x: referencePoints.current.geometry.attributes.position.array[i3],
        y: referencePoints.current.geometry.attributes.position.array[i3 + 1],
        z: referencePoints.current.geometry.attributes.position.array[i3 + 2],
      };

      // Équations de Halvorsen avec le timestep variable
      const dx = refPos.y * timestep;
      const dy = refPos.z * timestep;
      const dz =
        (-a * refPos.x - b * refPos.y - refPos.z + d * Math.pow(refPos.x, 3)) *
        timestep;

      // Mise à jour des positions de référence
      referencePoints.current.geometry.attributes.position.array[i3] += dx;
      referencePoints.current.geometry.attributes.position.array[i3 + 1] += dy;
      referencePoints.current.geometry.attributes.position.array[i3 + 2] += dz;

      // Calculer le facteur de mélange avec la vitesse de retour
      const timeSinceInteraction =
        currentTime - lastInteractionTimes.current[i];
      const t = Math.max(0, Math.min(1, timeSinceInteraction * returnSpeed));
      const mixFactor = t * t * t; // Garde la progression cubique pour la douceur

      if (distance < 0.0) {
        // Limite la zone d'effet
        // points.current.geometry.attributes.position.array[i3] += repulsion.x;
        // points.current.geometry.attributes.position.array[i3 + 1] += repulsion.y;
        // points.current.geometry.attributes.position.array[i3 + 2] += repulsion.z;
        // Mettre à jour le temps d'interaction pour le retour progressif
        // lastInteractionTimes.current[i] = currentTime;
        // if ( 1 == 0) {
        //   // Calculer la distance à l'origine
        //   const distToOrigin = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
        //   // Direction depuis l'origine vers la particule (normalisée)
        //   const dirFromOrigin = {
        //     x: distToOrigin > 0 ? pos.x / distToOrigin : 0,
        //     y: distToOrigin > 0 ? pos.y / distToOrigin : 0,
        //     z: distToOrigin > 0 ? pos.z / distToOrigin : 0
        //   };
        //   // Position avec effet de dilatation radiale
        //   const dilatedPos = {
        //     x: pos.x + dirFromOrigin.x * dilation,
        //     y: pos.y + dirFromOrigin.y * dilation,
        //     z: pos.z + dirFromOrigin.z * dilation
        //   };
        //   // Mélange entre position dilatée et position de référence
        //   points.current.geometry.attributes.position.array[i3] =
        //     dilatedPos.x * (1 - mixFactor) + referencePoints.current.geometry.attributes.position.array[i3] * mixFactor;
        //   points.current.geometry.attributes.position.array[i3 + 1] =
        //     dilatedPos.y * (1 - mixFactor) + referencePoints.current.geometry.attributes.position.array[i3 + 1] * mixFactor;
        //   points.current.geometry.attributes.position.array[i3 + 2] =
        //     dilatedPos.z * (1 - mixFactor) + referencePoints.current.geometry.attributes.position.array[i3 + 2] * mixFactor;
      } else {
        // Si pas d'effet de dilatation, suivre directement la position de référence
        points.current.geometry.attributes.position.array[i3] =
          referencePoints.current.geometry.attributes.position.array[i3];
        points.current.geometry.attributes.position.array[i3 + 1] =
          referencePoints.current.geometry.attributes.position.array[i3 + 1];
        points.current.geometry.attributes.position.array[i3 + 2] =
          referencePoints.current.geometry.attributes.position.array[i3 + 2];
      }
    }

    // Mise à jour des positions des sphères leaders
    sphereRefs.current.forEach((sphere, index) => {
      if (sphere) {
        sphere.position.set(
          points.current.geometry.attributes.position.array[
            index * leaderFrequency * 3
          ],
          points.current.geometry.attributes.position.array[
            index * leaderFrequency * 3 + 1
          ],
          points.current.geometry.attributes.position.array[
            index * leaderFrequency * 3 + 2
          ]
        );
      }
    });

    points.current.geometry.attributes.position.needsUpdate = true;
    referencePoints.current.geometry.attributes.position.needsUpdate = true;
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
          uniforms={uniforms}
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

const ChangeCameraPosition = () => {
  const { camera } = useThree();

    const caca = () => {
      camera.position.set(0.45, -0.2, -0.71);
    }

    const caca2 = () => {
      camera.position.set(-5.2, -8, -0.5);
    }

  useEffect(() => {
    if (typeof window !== "undefined") {

      const initGSAP = async () => {
        const gsap = (await import("gsap")).default;
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        const ScrollToPlugin = (await import("gsap/ScrollToPlugin")).default;

        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        ScrollTrigger.create({
          trigger: document.getElementById("screen2"),
          start: "bottom bottom",
          // markers: true,
          onEnter: () => {
            caca()
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
            caca2()
          }
        });
      };


      initGSAP();
    }
  }, []);

  return null;
};

export const Scene = () => {
  const sphere = new THREE.SphereGeometry(0.01, 32, 32);

  return (
    <div
      id="screen1"
      className="fixed top-0 left-0 w-full h-screen bg-grey"
      style={{ width: "100%", height: "100vh" }}
    >
      <Canvas
        // ref={canvasRef}
        camera={{ position: [-5.2, -8, -0.5] }}
        // -0.45 -0.2 -0.71
        gl={{
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#101010", 1);
        }}
      >
        <ambientLight intensity={0.5} />
        <CustomGeometryParticles count={20000} />
        <EffectComposer>
          <Bloom
            intensity={0.1}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.1}
            mipmapBlur
          />
        </EffectComposer>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
        />
        <ChangeCameraPosition />
        {/* <axesHelper args={[1]} /> */}
      </Canvas>
    </div>
  );
};

export default Scene;
