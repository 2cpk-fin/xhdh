// ElectronPage.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NavBar from '../../../components/NavBar';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ElectronObject } from './Electron';

const ElectronPage = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();

    const electrons = useRef<ElectronObject[]>([]);
    const selectedElectron = useRef<ElectronObject | null>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 12;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        electrons.current = [];
        for (let i = 0; i < 24; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 6,
                0
            );
            const electron = new ElectronObject(pos, 0.4 + Math.random() * 0.4);
            electrons.current.push(electron);
            scene.add(electron.mesh);
        }

        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        const handleMouseDown = (e: MouseEvent) => {
            const rect = mount.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / mount.clientWidth) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / mount.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let target: any = intersects[0].object;
                while (target.parent && !(target.parent instanceof THREE.Scene)) {
                    target = target.parent;
                }
                const found = electrons.current.find(el => el.mesh === target);
                if (found) {
                    selectedElectron.current = found;
                    mount.style.cursor = 'grabbing';
                }
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = mount.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / mount.clientWidth) * 2 - 1;
            const y = -((e.clientY - rect.top) / mount.clientHeight) * 2 + 1;

            if (selectedElectron.current) {
                const vector = new THREE.Vector3(x, y, 0.5);
                vector.unproject(camera);
                const dir = vector.sub(camera.position).normalize();
                const distance = -camera.position.z / dir.z;
                const pos = camera.position.clone().add(dir.multiplyScalar(distance));

                selectedElectron.current.velocity.copy(
                    pos.clone().sub(selectedElectron.current.mesh.position).multiplyScalar(0.3)
                );
                selectedElectron.current.mesh.position.copy(pos);
            }
        };

        const handleMouseUp = () => {
            selectedElectron.current = null;
            mount.style.cursor = 'default';
        };

        mount.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        const onResize = () => {
            if (!mount) return;
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);

            electrons.current.forEach(el => {
                if (selectedElectron.current !== el) {
                    el.update();
                    if (Math.abs(el.mesh.position.x) > 9) el.velocity.x *= -1;
                    if (Math.abs(el.mesh.position.y) > 5) el.velocity.y *= -1;
                }
            });

            for (let i = 0; i < electrons.current.length; i++) {
                for (let j = i + 1; j < electrons.current.length; j++) {
                    const e1 = electrons.current[i];
                    const e2 = electrons.current[j];
                    const dist = e1.mesh.position.distanceTo(e2.mesh.position);

                    if (dist < e1.radius + e2.radius) {
                        const normal = e1.mesh.position.clone().sub(e2.mesh.position).normalize();
                        const relVel = e1.velocity.clone().sub(e2.velocity);
                        if (relVel.dot(normal) < 0) {
                            const impulse = normal.multiplyScalar(relVel.dot(normal) * -1);
                            e1.velocity.add(impulse);
                            e2.velocity.sub(impulse);
                        }
                    }
                }
            }

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            mount.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', onResize);
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [isDarkMode]);

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-700 bg-[var(--bg-main)]">
            <NavBar />
            <main className="flex-1 relative overflow-hidden">
                <div className="absolute top-24 left-8 z-20">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/playground')}
                        className="text-[var(--text-primary)] opacity-40 hover:opacity-100 gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Playground
                    </Button>
                </div>

                <div ref={mountRef} className="absolute inset-0 z-0" />

                <div className="absolute bottom-10 left-0 right-0 pointer-events-none select-none text-center z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-20">
                        Containment field active • Collision physics enabled
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ElectronPage;