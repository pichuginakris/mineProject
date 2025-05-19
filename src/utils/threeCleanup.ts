import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Очищает объект Three.js и его потомков, освобождая память
export function disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            if (child.geometry) {
                child.geometry.dispose();
            }

            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((material) => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    });
}


// Удаляет объект из сцены по имени и освобождает ресурсы
export function removeObjectByName(scene: THREE.Scene, name: string): void {
    const object = scene.getObjectByName(name);
    if (object) {
        scene.remove(object);
        disposeObject(object);
    }
}


// Полностью очищает сцену Three.js и освобождает все ресурсы
export function cleanupThreeScene(
    scene: THREE.Scene | null,
    renderer: THREE.WebGLRenderer | null,
    controls: OrbitControls | null,
    container: HTMLElement | null,
    renderLoopId: number | null
): void {
    // Останавливаем цикл рендеринга
    if (renderLoopId !== null) {
        cancelAnimationFrame(renderLoopId);
    }

    // Удаляем элемент рендерера из DOM
    if (container && renderer) {
        container.removeChild(renderer.domElement);
    }

    // Очищаем сцену
    if (scene) {
        // Удаляем все объекты со сцены
        while (scene.children.length > 0) {
            const object = scene.children[0];
            scene.remove(object);
        }
        scene.clear();
    }

    // Освобождаем ресурсы рендерера
    if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
    }

    // Освобождаем ресурсы контролов
    if (controls) {
        controls.dispose();
    }
}