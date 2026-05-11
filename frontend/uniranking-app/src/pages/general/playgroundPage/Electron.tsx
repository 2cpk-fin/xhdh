// Electron.tsx
import * as THREE from 'three';

const NEON_PURPLE = 0xc026d3;
const LIGHT_PURPLE = 0xf5d0fe;

export class ElectronObject {
    mesh: THREE.Group;
    velocity: THREE.Vector3;
    radius: number;
    mass: number;
    rotationSpeed: THREE.Vector3;

    constructor(position: THREE.Vector3, radius: number) {
        this.mesh = new THREE.Group();
        this.radius = radius;
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            0
        );
        this.mass = radius;
        this.rotationSpeed = new THREE.Vector3(
            Math.random() * 0.01 + 0.005,
            Math.random() * 0.01 + 0.005,
            Math.random() * 0.01 + 0.005
        );

        this.mesh.position.copy(position);

        const geo = new THREE.IcosahedronGeometry(radius, 1);
        const edges = new THREE.EdgesGeometry(geo);
        const lineMat = new THREE.LineBasicMaterial({
            color: NEON_PURPLE,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
        });
        const network = new THREE.LineSegments(edges, lineMat);
        this.mesh.add(network);

        const pMat = new THREE.PointsMaterial({
            color: LIGHT_PURPLE,
            size: 0.06,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
        });
        const points = new THREE.Points(geo, pMat);
        this.mesh.add(points);

        const glowGeo = new THREE.SphereGeometry(radius * 0.7, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: NEON_PURPLE,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
        });
        this.mesh.add(new THREE.Mesh(glowGeo, glowMat));
    }

    update() {
        this.mesh.rotation.x += this.rotationSpeed.x;
        this.mesh.rotation.y += this.rotationSpeed.y;
        this.mesh.rotation.z += this.rotationSpeed.z;
        this.mesh.position.add(this.velocity);
    }
}