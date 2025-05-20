import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type { Node } from '../models/types.ts';

// Цвета для горизонтов
export const HORIZON_COLORS = [
    0xff3d3d, // яркий красный
    0x4dff4d, // яркий зеленый
    0x4d4dff, // яркий синий
    0xffdd3d, // яркий желтый
    0xff3dff, // яркий пурпурный
    0x3dffff, // яркий голубой
    0xff9f3d, // яркий оранжевый
    0xb43dff, // яркий фиолетовый
    0xff6e6e, // светло-красный
    0x6eff6e, // светло-зеленый
    0x6e6eff, // светло-синий
    0xf0f03d, // светло-желтый
    0x3dffb4, // бирюзовый
    0xffc2a3, // персиковый
    0xff4da6, // розовый
    0xa3cfff, // светло-голубой
    0x25c9d0  // сине-зеленый
];

export interface MineElementInfo {
    // Общие свойства
    name: string;
    color: number;
    sectionsTotal: number;
    sectionsValid: number;

    // Опциональные свойства для горизонтов
    altitude?: number;
    // Опциональные свойства для выработок
    excavationType?: string;
}

export type HorizonInfo = MineElementInfo;

// Функция настройки базовой сцены Three.js
export function setupScene(mountElement: HTMLDivElement): {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
} {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x373737);

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        50000
    );
    camera.position.set(0, 1000, 5000);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountElement.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 50000;
    controls.maxPolarAngle = Math.PI * 0.8;

    return { scene, camera, renderer, controls };
}

// Функция добавления освещения в сцену
export function addLighting(scene: THREE.Scene): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
}

// Функция создания туннеля между двумя точками
export function createTunnel(
    startPos: THREE.Vector3,
    endPos: THREE.Vector3,
    thickness: number,
    color: number
): {
    tunnel: THREE.Mesh;
    startCap: THREE.Mesh;
    endCap: THREE.Mesh;
} {
    const tunnelRadius = Math.max(thickness * 0.8, 5);

    const path = new THREE.LineCurve3(startPos, endPos);
    const tunnelGeometry = new THREE.TubeGeometry(
        path,
        1,
        tunnelRadius,
        8,
        false
    );

    // Материал с прозрачностью
    const tunnelMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        shininess: 100
    });

    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);

    // Вспомогательная функция для создания заглушки
    function createCap(position: THREE.Vector3, lookAtPos: THREE.Vector3) {
        const capGeometry = new THREE.CylinderGeometry(
            tunnelRadius, tunnelRadius, 2, 16, 1, false
        );

        const cap = new THREE.Mesh(capGeometry, tunnelMaterial);
        cap.position.copy(position);
        cap.lookAt(lookAtPos);
        cap.rotateX(Math.PI / 2);

        return cap;
    }

    // Создаем заглушки на обоих концах
    const startCap = createCap(startPos, endPos);
    const endCap = createCap(endPos, startPos);

    return { tunnel, startCap, endCap };
}


// Функция для центрирования модели (вычисление смещения)
export const calculateModelCenter = (nodes: Map<string, Node>) => {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    nodes.forEach(node => {
        minX = Math.min(minX, node.X);
        maxX = Math.max(maxX, node.X);
        minY = Math.min(minY, node.Y);
        maxY = Math.max(maxY, node.Y);
        minZ = Math.min(minZ, node.Z);
        maxZ = Math.max(maxZ, node.Z);
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const dimensions = {
        width: maxX - minX,
        height: maxY - minY,
        depth: maxZ - minZ
    };

    return {
        center: { x: centerX, y: centerY, z: centerZ },
        dimensions
    };
};
