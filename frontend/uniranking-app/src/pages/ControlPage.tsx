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

        const coreSolidGeo = new THREE.SphereGeometry(0.2, 32, 32);
        const coreSolidMat = new THREE.MeshStandardMaterial({
            color: 0xcf42d6,
            emissive: 0xe30eed,
            emissiveIntensity: 0.5,
        });
        const coreSolid = new THREE.Mesh(coreSolidGeo, coreSolidMat);
        sphereGroup.add(coreSolid);

        // Lớp glow xếp chồng — 25 lớp từ 0.23 đến 0.48
        Array.from({ length: 25 }, (_, i) => {
            const t = i / 24; // 0 → 1
            const r = 0.23 + t * (0.48 - 0.23);
            const opacity = 0.35 * (1 - t) + 0.04 * t; // giảm dần từ 0.35 → 0.04
            // Màu chuyển dần từ 0xe030f0 → 0x6a0090
            const color = new THREE.Color().lerpColors(
                new THREE.Color(0xe030f0),
                new THREE.Color(0x6a0090),
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

        // Lớp ngoài cùng mờ nhất (giữ nguyên)
        [
            { r: 0.65, opacity: 0.02, color: 0x4a0070 },
        ].forEach(({ r, opacity, color }) => {
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

        // ==========================================
        // --- NETWORK (PARTICLES & CONNECTIONS) ---
        // ==========================================

        const NEON_PURPLE = 0xc026d3;
        const NEON_BLUE = 0x00d4ff;

        // Mỗi lớp mạng lưới có Group riêng để kéo độc lập
        const net0p28Group = new THREE.Group(); // lồng lõi  — không kéo theo chuột
        const net0p95Group = new THREE.Group(); // lớp 1 — nhanh nhất (4×)
        const net1p2Group = new THREE.Group(); // lớp 2 — (3×)
        const net1p5Group = new THREE.Group(); // lớp 3 — chậm nhất (2×)
        sphereGroup.add(net0p28Group, net0p95Group, net1p2Group, net1p5Group);

        [
            { r: 0.28, c: NEON_BLUE, d: 1, o: 0.9, target: net0p28Group },
            { r: 0.95, c: NEON_PURPLE, d: 2, o: 0.6, target: net0p95Group },
            { r: 1.2, c: NEON_BLUE, d: 1, o: 0.4, target: net1p2Group },
            { r: 1.5, c: NEON_PURPLE, d: 1, o: 0.2, target: net1p5Group },
        ].forEach(({ r, c, d, o, target }) => {
            const geo = new THREE.IcosahedronGeometry(r, d);
            const edges = new THREE.EdgesGeometry(geo);
            target.add(new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({
                    color: c,
                    transparent: true,
                    opacity: o,
                    blending: THREE.AdditiveBlending,
                })
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
            new THREE.PointsMaterial({
                color: NEON_PURPLE,
                size: 0.04,
                transparent: true,
                opacity: 0.9,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
            })
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
                        new THREE.LineBasicMaterial({
                            color: NEON_BLUE,
                            transparent: true,
                            opacity: (1 - dist / 0.6) * 0.5,
                            blending: THREE.AdditiveBlending,
                        })
                    ));
                    connCount++;
                }
            }
        }

        // ==========================================
        // --- ELECTRONS CHẠY TRÊN MẠNG LƯỚI ---
        // ==========================================

        // detail phải khớp với lớp render để electron nằm đúng trên cạnh
        const icoEdges: {
            from: THREE.Vector3;
            to: THREE.Vector3;
            radius: number;
            color: number;
            group: THREE.Group;
        }[] = [];

        [
            { r: 0.95, color: NEON_PURPLE, detail: 2, group: net0p95Group },
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

        // Adjacency map
        const adjMap = new Map<string, number[]>();
        const vecKey = (v: THREE.Vector3) =>
            `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;

        icoEdges.forEach((edge, idx) => {
            const kf = vecKey(edge.from);
            const kt = vecKey(edge.to);
            if (!adjMap.has(kf)) adjMap.set(kf, []);
            if (!adjMap.has(kt)) adjMap.set(kt, []);
            adjMap.get(kf)!.push(idx);
            adjMap.get(kt)!.push(idx);
        });

        // 96 electron — add vào group của lớp mạng tương ứng
        const meshElectrons: {
            mesh: THREE.Mesh;
            edgeIdx: number;
            t: number;
            speed: number;
            forward: boolean;
        }[] = [];

        for (let i = 0; i < 256; i++) {
            const edgeIdx = Math.floor(Math.random() * icoEdges.length);
            const edge = icoEdges[edgeIdx];

            const eGeo = new THREE.SphereGeometry(0.005, 5, 5);
            const eMat = new THREE.MeshBasicMaterial({
                color: edge.color,
                blending: THREE.AdditiveBlending,
            });
            const eMesh = new THREE.Mesh(eGeo, eMat);
            // Add vào group của lớp → quay cùng lớp khi kéo chuột
            edge.group.add(eMesh);

            meshElectrons.push({
                mesh: eMesh,
                edgeIdx,
                t: Math.random(),
                speed: 0.008 + Math.random() * 0.008,
                forward: Math.random() > 0.5,
            });
        }

        // ==========================================
        // --- ORBITAL RINGS (Simple Neon Lines) ---
        // ==========================================

        /* const ringDefs = [
            { rx: 0, ry: 0, rz: 0, r: 3.8 },
            { rx: Math.PI / 2, ry: 0, rz: 0, r: 4.3 },
            { rx: Math.PI / 4, ry: Math.PI / 6, rz: 0, r: 4.8 },
            { rx: Math.PI / 3, ry: Math.PI / 3, rz: Math.PI / 5, r: 5.4 },
            { rx: Math.PI / 6, ry: Math.PI / 2, rz: Math.PI / 4, r: 6.0 },
            { rx: 0.9, ry: 1.2, rz: 0.5, r: 6.6 },
        ];

        const orbitData: {
            electronGroup: THREE.Group;
            electron: THREE.Mesh;
            radius: number;
            electronSpeed: number;
            phase: number;
        }[] = [];

        const SEGMENTS = 128;

        ringDefs.forEach((def, idx) => {
            const points: THREE.Vector3[] = [];
            for (let i = 0; i <= SEGMENTS; i++) {
                const angle = (i / SEGMENTS) * Math.PI * 2;
                points.push(new THREE.Vector3(
                    Math.cos(angle) * def.r,
                    Math.sin(angle) * def.r,
                    0
                ));
            }
            const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
            const ringMat = new THREE.LineBasicMaterial({
                color: NEON_PURPLE,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending,
            });
            const ring = new THREE.Line(ringGeo, ringMat);
            ring.rotation.set(def.rx, def.ry, def.rz);
            ringsGroup.add(ring);

            const electronGroup = new THREE.Group();
            electronGroup.rotation.set(def.rx, def.ry, def.rz);
            ringsGroup.add(electronGroup);

            const electronGeo = new THREE.SphereGeometry(0.045, 8, 8);
            const electronMat = new THREE.MeshBasicMaterial({
                color: 0xe879f9,
                blending: THREE.AdditiveBlending,
            });
            const electron = new THREE.Mesh(electronGeo, electronMat);
            electronGroup.add(electron);

            orbitData.push({
                electronGroup,
                electron,
                radius: def.r,
                electronSpeed: 0.004 + idx * 0.0015,
                phase: (idx / ringDefs.length) * Math.PI * 2,
            });
        }); */

        // ==========================================
        // --- INTERACTION & ANIMATION ---
        // ==========================================

        let isDragging = false;
        let prevMouseX = 0;
        let prevMouseY = 0;
        let ringVelX = 0;
        let ringVelY = 0;

        // Áp dụng rotation phân tầng cho từng group
        // Vành đai ngoài: 1× (chậm nhất)
        // lớp r=1.5:      2×
        // lớp r=1.2:      3×
        // lớp r=0.95:     4× (= tốc độ vành đai cũ trước khi giảm)
        const applyRotation = (velX: number, velY: number) => {
            const layers: { group: THREE.Object3D; factor: number }[] = [
                { group: ringsGroup, factor: 0.5 },
                { group: net1p5Group, factor: 0.75 },
                { group: net1p2Group, factor: 2 },
                { group: net0p95Group, factor: 5 },
                { group: net0p28Group, factor: 10 },
            ];
            layers.forEach(({ group, factor }) => {
                const qx = new THREE.Quaternion();
                const qy = new THREE.Quaternion();
                qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), velX * factor);
                qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), velY * factor);
                group.quaternion.premultiply(qy).premultiply(qx);
            });
        };

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
            // 0.003 = giảm đôi so với 0.006 cũ → vành đai chậm lại ×2
            ringVelX = dy * 0.002;
            ringVelY = dx * 0.002;
            applyRotation(ringVelX, ringVelY);
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

            // Rotate sphere group (lõi + lồng r=0.28 quay cùng)
            sphereGroup.rotation.y += 0.002;
            sphereGroup.rotation.x += 0.0003;

            // Pulse core
            const coreScale = 1 + Math.sin(t * 3) * 0.05;
            coreSolid.scale.set(coreScale, coreScale, coreScale);

            // Inertia — giữ nguyên hệ số phân tầng
            if (!isDragging) {
                ringVelX *= 0.94;
                ringVelY *= 0.94;
                if (Math.abs(ringVelX) > 0.00005 || Math.abs(ringVelY) > 0.00005) {
                    applyRotation(ringVelX, ringVelY);
                }
            }

            // Electron chạy trên orbital rings
            /* orbitData.forEach((orb) => {
                const eAngle = t * orb.electronSpeed * 60 + orb.phase;
                orb.electron.position.x = Math.cos(eAngle) * orb.radius;
                orb.electron.position.y = Math.sin(eAngle) * orb.radius;
            }); */

            // Electron trượt trên mạng lưới Icosahedron
            meshElectrons.forEach((e) => {
                e.t += e.forward ? e.speed : -e.speed;

                if (e.t >= 1 || e.t <= 0) {
                    const edge = icoEdges[e.edgeIdx];
                    const currentVertex = e.t >= 1 ? edge.to : edge.from;
                    const key = vecKey(currentVertex);

                    const neighbors = (adjMap.get(key) || []).filter(
                        (idx) =>
                            idx !== e.edgeIdx &&
                            icoEdges[idx].radius === edge.radius
                    );

                    if (neighbors.length > 0) {
                        const nextIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
                        const nextEdge = icoEdges[nextIdx];
                        const nextKey = vecKey(nextEdge.from);

                        e.forward = nextKey === key;
                        e.edgeIdx = nextIdx;
                        e.t = nextKey === key ? 0 : 1;

                        (e.mesh.material as THREE.MeshBasicMaterial).color.setHex(nextEdge.color);

                        // Chuyển mesh sang group mới nếu khác lớp
                        if (e.mesh.parent !== nextEdge.group) {
                            nextEdge.group.attach(e.mesh);
                        }
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
                cursor: 'grab',
            }}
        />
    );
};

export default ControlPage;