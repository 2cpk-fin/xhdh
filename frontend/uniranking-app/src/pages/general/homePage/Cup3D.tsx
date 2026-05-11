// Cup3D.tsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const CupModel = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((_state, delta) => {
        meshRef.current.rotation.y += delta * 0.5;
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef} castShadow receiveShadow>
                <cylinderGeometry args={[0.7, 0.4, 2, 32]} />
                <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.2} />

                <mesh position={[0, -1.2, 0]} castShadow>
                    <cylinderGeometry args={[0.5, 0.6, 0.4, 32]} />
                    <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.2} />
                </mesh>

                <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <torusGeometry args={[0.4, 0.08, 16, 50, Math.PI]} />
                    <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.2} />
                </mesh>

                <mesh position={[-0.8, 0.3, 0]} rotation={[0, Math.PI, Math.PI / 2]} castShadow>
                    <torusGeometry args={[0.4, 0.08, 16, 50, Math.PI]} />
                    <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.2} />
                </mesh>
            </mesh>
        </Float>
    );
};

interface Cup3DProps {
    className?: string;
    style?: React.CSSProperties;
}

const Cup3D = ({ className, style }: Cup3DProps) => {
    return (
        <div className={className} style={{ ...style, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={2.5} castShadow />
                <pointLight position={[-5, -10, -5]} intensity={1} color="#c026d3" />
                <pointLight position={[0, 5, -5]} intensity={0.5} color="#ffffff" />
                <CupModel />
            </Canvas>
        </div>
    );
};

export default Cup3D;