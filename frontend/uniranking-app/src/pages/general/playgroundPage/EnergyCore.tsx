/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDarkMode } from '@/hooks/useDarkMode';

const EnergyCore = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let animId: number;

        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 5.5;

        const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.1 : 0.3);
        scene.add(ambientLight);

        const sphereGroup = new THREE.Group();
        const ringsGroup = new THREE.Group();

        const coreLight = new THREE.PointLight(0x06b6d4, isDarkMode ? 20 : 5, 15);
        sphereGroup.add(coreLight);

        const SCALE = 2.4;
        sphereGroup.scale.set(SCALE, SCALE, SCALE);
        ringsGroup.scale.set(SCALE, SCALE, SCALE);

        scene.add(sphereGroup);
        scene.add(ringsGroup);

        const coreSolidGeo = new THREE.SphereGeometry(0.2, 32, 32);
        const coreSolidMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            emissive: 0x0891b2,
            emissiveIntensity: 0.5,
        });
        const coreSolid = new THREE.Mesh(coreSolidGeo, coreSolidMat);
        sphereGroup.add(coreSolid);

        Array.from({ length: 25 }, (_, i) => {
            const t = i / 24;
            const r = 0.23 + t * (0.48 - 0.23);
            const opacity = 0.35 * (1 - t) + 0.04 * t;
            const color = new THREE.Color().lerpColors(
                new THREE.Color(0x06b6d4),
                new THREE.Color(0x0284c7),
                t
            );
            return { r, opacity, color };
        }).forEach(({ r, opacity, color }) => {
            const geo = new THREE.SphereGeometry(r, 24, 24);
            const mat = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity,
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            sphereGroup.add(new THREE.Mesh(geo, mat));
        });

        const outerGeo = new THREE.SphereGeometry(0.65, 24, 24);
        const outerMat = new THREE.MeshBasicMaterial({
            color: 0x0369a1,
            transparent: true,
            opacity: 0.02,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        sphereGroup.add(new THREE.Mesh(outerGeo, outerMat));

        const NEON_CYAN = 0x06b6d4;
        const NEON_BLUE = 0x3b82f6;

        const net0p28Group = new THREE.Group();
        const net0p95Group = new THREE.Group();
        const net1p2Group = new THREE.Group();
        sphereGroup.add(net0p28Group, net0p95Group, net1p2Group);

        [
            { r: 0.28, c: NEON_BLUE, d: 1, o: 0.9, target: net0p28Group },
            { r: 0.95, c: NEON_CYAN, d: 2, o: 0.6, target: net0p95Group },
            { r: 1.2, c: NEON_BLUE, d: 1, o: 0.4, target: net1p2Group },
        ].forEach(({ r, c, d, o, target }) => {
            const geo = new THREE.IcosahedronGeometry(r, d);
            const edges = new THREE.EdgesGeometry(geo);
            target.add(new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({
                    color: c,
                    transparent: true,
                    opacity: isDarkMode ? Math.min(1, o * 1.8) : o,
                    blending: THREE.AdditiveBlending,
                })
            ));
        });

        const PC = 180;
        const pPos = new Float32Array(PC * 3);
        for (let i = 0; i < PC; i++) {
            const phi = Math.acos(1 - (2 * (i + 0.5)) / PC);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const r = 1.3 + (Math.random() - 0.5) * 0.25;
            pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pPos[i * 3 + 2] = r * Math.cos(phi);
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos.slice(), 3));
        sphereGroup.add(new THREE.Points(pGeo,
            new THREE.PointsMaterial({
                color: isDarkMode ? 0xa5f3fc : NEON_CYAN,
                size: isDarkMode ? 0.05 : 0.04,
                transparent: true,
                opacity: 0.9,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
            })
        ));

        let connCount = 0;
        for (let i = 0; i < PC && connCount < 50; i++) {
            for (let j = i + 1; j < PC && connCount < 50; j++) {
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
                        new THREE.LineBasicMaterial({
                            color: NEON_BLUE,
                            transparent: true,
                            opacity: (1 - dist / 0.6) * (isDarkMode ? 0.9 : 0.5),
                            blending: THREE.AdditiveBlending,
                        })
                    ));
                    connCount++;
                }
            }
        }

        const icoEdges: any[] = [];
        [
            { r: 0.95, color: NEON_CYAN, detail: 2, group: net0p95Group },
            { r: 1.2, color: NEON_BLUE, detail: 1, group: net1p2Group },
        ].forEach(({ r, color, detail, group }) => {
            const geo = new THREE.IcosahedronGeometry(r, detail);
            const edgesGeo = new THREE.EdgesGeometry(geo);
            const ePos = edgesGeo.getAttribute('position');
            for (let i = 0; i < ePos.count; i += 2) {
                icoEdges.push({
                    from: new THREE.Vector3(ePos.getX(i), ePos.getY(i), ePos.getZ(i)),
                    to: new THREE.Vector3(ePos.getX(i + 1), ePos.getY(i + 1), ePos.getZ(i + 1)),
                    radius: r,
                    color,
                    group,
                });
            }
            geo.dispose();
            edgesGeo.dispose();
        });

        const adjMap = new Map<string, number[]>();
        const vecKey = (v: THREE.Vector3) => `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;

        icoEdges.forEach((edge, idx) => {
            const kf = vecKey(edge.from);
            const kt = vecKey(edge.to);
            if (!adjMap.has(kf)) adjMap.set(kf, []);
            if (!adjMap.has(kt)) adjMap.set(kt, []);
            adjMap.get(kf)!.push(idx);
            adjMap.get(kt)!.push(idx);
        });

        const meshElectrons: any[] = [];
        for (let i = 0; i < 150; i++) {
            const edgeIdx = Math.floor(Math.random() * icoEdges.length);
            const edge = icoEdges[edgeIdx];
            const eGeo = new THREE.SphereGeometry(isDarkMode ? 0.007 : 0.005, 5, 5);
            const eMat = new THREE.MeshBasicMaterial({
                color: edge.color,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: isDarkMode ? 1.0 : 0.8
            });
            const eMesh = new THREE.Mesh(eGeo, eMat);
            edge.group.add(eMesh);
            meshElectrons.push({
                mesh: eMesh,
                edgeIdx,
                t: Math.random(),
                speed: 0.008 + Math.random() * 0.008,
                forward: Math.random() > 0.5,
            });
        }

        let isDragging = false;
        let prevMouseX = 0;
        let prevMouseY = 0;
        let ringVelX = 0;
        let ringVelY = 0;

        const applyRotation = (velX: number, velY: number) => {
            const layers = [
                { group: ringsGroup, factor: 0.5 },
                { group: net1p2Group, factor: 2 },
                { group: net0p95Group, factor: 5 },
                { group: net0p28Group, factor: 10 },
            ];
            layers.forEach(({ group, factor }) => {
                const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), velX * factor);
                const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), velY * factor);
                group.quaternion.premultiply(qy).premultiply(qx);
            });
        };

        const onMouseDown = (e: MouseEvent) => { isDragging = true; prevMouseX = e.clientX; prevMouseY = e.clientY; mount.style.cursor = 'grabbing'; };
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - prevMouseX;
            const dy = e.clientY - prevMouseY;
            ringVelX = dy * 0.002;
            ringVelY = dx * 0.002;
            applyRotation(ringVelX, ringVelY);
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        };
        const onMouseUp = () => { isDragging = false; mount.style.cursor = 'grab'; };

        const onResize = () => {
            const newWidth = mount.clientWidth;
            const newHeight = mount.clientHeight;
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        };

        mount.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', onResize);

        let time = 0;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            time += 0.016;

            sphereGroup.rotation.y += 0.002;
            sphereGroup.rotation.x += 0.0003;

            const coreScale = 1 + Math.sin(time * 3) * 0.05;
            coreSolid.scale.set(coreScale, coreScale, coreScale);

            if (!isDragging) {
                ringVelX *= 0.94;
                ringVelY *= 0.94;
                if (Math.abs(ringVelX) > 0.00005 || Math.abs(ringVelY) > 0.00005) applyRotation(ringVelX, ringVelY);
            }

            meshElectrons.forEach((e) => {
                e.t += e.forward ? e.speed : -e.speed;
                if (e.t >= 1 || e.t <= 0) {
                    const edge = icoEdges[e.edgeIdx];
                    const currentVertex = e.t >= 1 ? edge.to : edge.from;
                    const key = vecKey(currentVertex);
                    const neighbors = (adjMap.get(key) || []).filter(idx => idx !== e.edgeIdx && icoEdges[idx].radius === edge.radius);

                    if (neighbors.length > 0) {
                        const nextIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
                        const nextEdge = icoEdges[nextIdx];
                        e.forward = vecKey(nextEdge.from) === key;
                        e.edgeIdx = nextIdx;
                        e.t = e.forward ? 0 : 1;
                        (e.mesh.material as THREE.MeshBasicMaterial).color.setHex(nextEdge.color);
                        if (e.mesh.parent !== nextEdge.group) nextEdge.group.attach(e.mesh);
                    } else {
                        e.forward = !e.forward;
                        e.t = Math.max(0, Math.min(1, e.t));
                    }
                }
                const edge = icoEdges[e.edgeIdx];
                e.mesh.position.lerpVectors(edge.from, edge.to, e.t);
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
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [isDarkMode]);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100%',
                height: '100%',
                cursor: 'grab',
            }}
        />
    );
};

export default EnergyCore;