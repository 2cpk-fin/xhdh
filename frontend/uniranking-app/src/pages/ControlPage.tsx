import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ControlPage = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let animId: number;
        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 7.0;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const sphereGroup = new THREE.Group();
        const ringsGroup = new THREE.Group();

        const coreLight = new THREE.PointLight(0xd8b4fe, 5, 10);
        sphereGroup.add(coreLight);

        const SCALE = 4.2;
        sphereGroup.scale.set(SCALE, SCALE, SCALE);
        ringsGroup.scale.set(SCALE, SCALE, SCALE);

        const OFFSET_X = 2.8;
        const OFFSET_Y = -2.2;
        sphereGroup.position.set(OFFSET_X, OFFSET_Y, 0);
        ringsGroup.position.set(OFFSET_X, OFFSET_Y, 0);

        scene.add(sphereGroup);
        scene.add(ringsGroup);

        // ==========================================
        // --- CORE (DEEP DARK SPHERE) ---
        // ==========================================

        // 1. Dark core center (Black with deep purple emission)
        const coreSolidGeo = new THREE.SphereGeometry(0.2, 32, 32);
        const coreSolidMat = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0x1e1b4b,
            emissiveIntensity: 0.8
        });
        const coreSolid = new THREE.Mesh(coreSolidGeo, coreSolidMat);
        sphereGroup.add(coreSolid);


        // ==========================================
        // --- NETWORK (PARTICLES & CONNECTIONS) ---
        // ==========================================

        // Outer decorative structural lines
        [
            { r: 0.95, c: 0x7c3aed, d: 2, o: 0.6 },
            { r: 1.2, c: 0x3b82f6, d: 1, o: 0.4 },
            { r: 1.5, c: 0xd8b4fe, d: 1, o: 0.2 },
        ].forEach(({ r, c, d, o }) => {
            const geo = new THREE.IcosahedronGeometry(r, d);
            const edges = new THREE.EdgesGeometry(geo);
            sphereGroup.add(new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o })
            ));
        });

        // Network Nodes (Particles)
        const PC = 260;
        const pPos = new Float32Array(PC * 3);
        for (let i = 0; i < PC; i++) {
            const phi = Math.acos(1 - (2 * (i + 0.5)) / PC);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const r = 1.6 + (Math.random() - 0.5) * 0.3;
            pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pPos[i * 3 + 2] = r * Math.cos(phi);
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos.slice(), 3));
        sphereGroup.add(new THREE.Points(pGeo,
            new THREE.PointsMaterial({ color: 0xa855f7, size: 0.04, transparent: true, opacity: 0.8, sizeAttenuation: true })
        ));

        // Network Edges (Connections)
        let connCount = 0;
        for (let i = 0; i < PC && connCount < 70; i++) {
            for (let j = i + 1; j < PC && connCount < 70; j++) {
                const dx = pPos[i * 3] - pPos[j * 3];
                const dy = pPos[i * 3 + 1] - pPos[j * 3 + 1];
                const dz = pPos[i * 3 + 2] - pPos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < 0.6) {
                    const lg = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(pPos[i * 3], pPos[i * 3 + 1], pPos[i * 3 + 2]),
                        new THREE.Vector3(pPos[j * 3], pPos[j * 3 + 1], pPos[j * 3 + 2]),
                    ]);
                    sphereGroup.add(new THREE.Line(lg,
                        new THREE.LineBasicMaterial({ color: 0x581c87, transparent: true, opacity: (1 - dist / 0.6) * 0.4 })
                    ));
                    connCount++;
                }
            }
        }

        // ==========================================
        // --- ORBITAL RINGS ---
        // ==========================================

        const ringDefs = [
            { rx: 0, ry: 0, rz: 0, r: 1.9, count: 180 },
            { rx: Math.PI / 2, ry: 0, rz: 0, r: 2.15, count: 220 },
            { rx: Math.PI / 4, ry: Math.PI / 6, rz: 0, r: 2.4, count: 160 },
            { rx: Math.PI / 3, ry: Math.PI / 3, rz: Math.PI / 5, r: 2.7, count: 250 },
            { rx: Math.PI / 6, ry: Math.PI / 2, rz: Math.PI / 4, r: 3.0, count: 200 },
            { rx: 0.9, ry: 1.2, rz: 0.5, r: 3.3, count: 300 },
        ];

        const orbitData: any[] = [];
        const blockyRingsGroup = new THREE.Group();
        ringsGroup.add(blockyRingsGroup);

        const standardBox = new THREE.BoxGeometry(1, 1, 1);

        const palette = [
            0x3b82f6,
            0x7c3aed,
            0x2563eb,
            0x9333ea,
            0x60a5fa,
            0x6b21a8
        ];

        ringDefs.forEach((def, idx) => {
            const ringGroup = new THREE.Group();
            ringGroup.rotation.set(def.rx, def.ry, def.rz);
            blockyRingsGroup.add(ringGroup);

            for (let i = 0; i < def.count; i++) {
                const angle = (i / def.count) * Math.PI * 2;
                const spreadX = (Math.random() - 0.5) * 0.18;
                const spreadY = (Math.random() - 0.5) * 0.18;
                const spreadZ = (Math.random() - 0.5) * 0.18;

                const x = Math.cos(angle) * def.r + spreadX;
                const y = Math.sin(angle) * def.r + spreadY;
                const z = spreadZ;

                const scale = 0.02 + Math.random() * 0.08;

                const colorIdx = (i + Math.floor(Math.random() * 3)) % palette.length;
                const blockColor = palette[colorIdx];

                const matChance = Math.random();
                let mat;

                if (matChance > 0.85) {
                    mat = new THREE.MeshStandardMaterial({
                        color: blockColor,
                        emissive: blockColor,
                        emissiveIntensity: 1.5,
                    });
                } else if (matChance > 0.65) {
                    mat = new THREE.MeshPhysicalMaterial({
                        color: blockColor,
                        metalness: 0.1,
                        roughness: 0.1,
                        transmission: 0.9,
                        transparent: true,
                        opacity: 0.5
                    });
                } else {
                    mat = new THREE.MeshStandardMaterial({
                        color: blockColor,
                        metalness: 0.8,
                        roughness: 0.2,
                    });
                }

                const mesh = new THREE.Mesh(standardBox, mat);
                mesh.position.set(x, y, z);
                mesh.scale.set(scale, scale, scale);

                mesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );

                ringGroup.add(mesh);
            }

            for (let i = 0; i < def.count / 2; i++) {
                const angle = (i / (def.count / 2)) * Math.PI * 2;
                const innerR = def.r - 0.1;
                const x = Math.cos(angle) * innerR;
                const y = Math.sin(angle) * innerR;

                const wireColor = palette[(i % 2 === 0) ? 0 : 3];
                const wireGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04);
                const wireMat = new THREE.MeshBasicMaterial({
                    color: wireColor,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.3
                });
                const wire = new THREE.Mesh(wireGeo, wireMat);
                wire.position.set(x + (Math.random() - 0.5) * 0.06, y + (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.06);
                ringGroup.add(wire);
            }

            const pGeo = new THREE.BufferGeometry();
            const pCount = 120;
            const pPos = new Float32Array(pCount * 3);
            const pColors = new Float32Array(pCount * 3);

            const colorBlue = new THREE.Color(0x3b82f6);
            const colorPurple = new THREE.Color(0x9333ea);

            for (let i = 0; i < pCount; i++) {
                const angle = (Math.random() * Math.PI * 2);
                const radius = def.r + (Math.random() - 0.5) * 0.35;
                pPos[i * 3] = Math.cos(angle) * radius;
                pPos[i * 3 + 1] = Math.sin(angle) * radius;
                pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;

                const mixedColor = Math.random() > 0.5 ? colorBlue : colorPurple;
                pColors[i * 3] = mixedColor.r;
                pColors[i * 3 + 1] = mixedColor.g;
                pColors[i * 3 + 2] = mixedColor.b;
            }

            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

            const pMat = new THREE.PointsMaterial({
                size: 0.025,
                vertexColors: true,
                transparent: true,
                opacity: 0.6
            });
            const particles = new THREE.Points(pGeo, pMat);
            ringGroup.add(particles);

            const electronPath = new THREE.Group();
            electronPath.rotation.set(def.rx, def.ry, def.rz);
            blockyRingsGroup.add(electronPath);

            const electronGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
            const electronMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 2
            });
            const electron = new THREE.Mesh(electronGeo, electronMat);
            electronPath.add(electron);

            const electronGlowGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
            const electronGlowMat = new THREE.MeshBasicMaterial({
                color: palette[idx % palette.length],
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });
            const electronGlow = new THREE.Mesh(electronGlowGeo, electronGlowMat);
            electronPath.add(electronGlow);

            orbitData.push({
                group: ringGroup,
                electronPath: electronPath,
                electron: electron,
                electronGlow: electronGlow,
                radius: def.r,
                speed: 0.002 + idx * 0.0005,
                electronSpeed: 0.004 + idx * 0.0015,
                phase: (idx / ringDefs.length) * Math.PI * 2,
            });
        });

        // ==========================================
        // --- INTERACTION & ANIMATION ---
        // ==========================================

        let isDragging = false;
        let prevMouseX = 0;
        let prevMouseY = 0;
        let ringVelX = 0;
        let ringVelY = 0;

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
            mount.style.cursor = 'grabbing';
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - prevMouseX;
            const dy = e.clientY - prevMouseY;
            ringVelX = dy * 0.006;
            ringVelY = dx * 0.006;

            const qx = new THREE.Quaternion();
            const qy = new THREE.Quaternion();
            qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), ringVelX);
            qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ringVelY);
            ringsGroup.quaternion.premultiply(qy).premultiply(qx);

            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        };

        const onMouseUp = () => {
            isDragging = false;
            mount.style.cursor = 'grab';
        };

        const onResize = () => {
            if (!mount) return;
            const newWidth = mount.clientWidth || window.innerWidth;
            const newHeight = mount.clientHeight || window.innerHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        mount.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', onResize);

        let t = 0;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            t += 0.016;

            // Rotate the entire sphere group
            sphereGroup.rotation.y += 0.002;
            sphereGroup.rotation.x += 0.0003;

            // Pulse the inner core globe slightly
            const coreScale = 1 + Math.sin(t * 3) * 0.05;
            coreSolid.scale.set(coreScale, coreScale, coreScale);

            if (!isDragging) {
                ringVelX *= 0.94;
                ringVelY *= 0.94;
                if (Math.abs(ringVelX) > 0.00005 || Math.abs(ringVelY) > 0.00005) {
                    const qx = new THREE.Quaternion();
                    const qy = new THREE.Quaternion();
                    qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), ringVelX);
                    qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ringVelY);
                    ringsGroup.quaternion.premultiply(qy).premultiply(qx);
                }
            }

            orbitData.forEach((orb) => {
                orb.group.rotation.z -= orb.speed;
                const eAngle = t * orb.electronSpeed * 60 + orb.phase;
                orb.electron.position.x = Math.cos(eAngle) * orb.radius;
                orb.electron.position.y = Math.sin(eAngle) * orb.radius;
                orb.electronGlow.position.copy(orb.electron.position);
                orb.electron.rotation.x += 0.05;
                orb.electron.rotation.y += 0.05;
                const pulse = 1 + Math.sin(t * 8) * 0.15;
                orb.electron.scale.set(pulse, pulse, pulse);
                orb.electronGlow.scale.set(pulse, pulse, pulse);
            });

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animId);
            mount.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('resize', onResize);
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100%',
                height: '100%',
                minHeight: '100vh',
                cursor: 'grab'
            }}
        />
    );
};

export default ControlPage;