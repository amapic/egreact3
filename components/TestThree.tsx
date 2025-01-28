'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Patatoide() {
  const meshRef = useRef<THREE.Mesh>(null)
  const originalPositions = useMemo(() => {
    // Créer une sphère de base
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    return geometry.attributes.position.array.slice()
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // Modifier les vertices de la géométrie
    const positions = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const time = state.clock.elapsedTime
      
      // Ajouter une déformation basée sur le bruit
      const noise = Math.sin(time + i) * 0.2
      positions[i] = originalPositions[i] + noise
      positions[i + 1] = originalPositions[i + 1] + noise
      positions[i + 2] = originalPositions[i + 2] + noise
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#ff9f00" wireframe />
    </mesh>
  )
}

export default function TestThree() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Patatoide />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
