import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
    setupScene,
    addLighting
} from '../utils/threeHelpers';
import { cleanupThreeScene } from "../utils/threeCleanup";

// Хук для управления сценой Three.js
export const useThreeScene = (containerRef: React.RefObject<HTMLDivElement | null>) => {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const requestRef = useRef<number | null>(null);
    const [isSceneReady, setIsSceneReady] = useState(false);

    // Инициализация сцены
    useEffect(() => {
        if (!containerRef.current) return;

        // Убедимся, что контейнер пуст перед добавлением новых элементов
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        // Настройка базовой сцены
        const { scene, camera, renderer, controls } = setupScene(containerRef.current);
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        controlsRef.current = controls;

        // Добавление освещения
        addLighting(scene);

        // Анимационный цикл
        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);

            if (controlsRef.current) {
                controlsRef.current.update();
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };

        // Запускаем анимацию
        animate();

        // Обработчик изменения размера окна
        const handleResize = () => {
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        // Сцена готова
        setIsSceneReady(true);

        // Очистка при размонтировании
        return () => {
            window.removeEventListener('resize', handleResize);

            // Используем функцию для очистки сцены
            cleanupThreeScene(
                sceneRef.current,
                rendererRef.current,
                controlsRef.current,
                containerRef.current,
                requestRef.current
            );

            // Сбрасываем ссылки
            sceneRef.current = null;
            cameraRef.current = null;
            rendererRef.current = null;
            controlsRef.current = null;
            requestRef.current = null;

            setIsSceneReady(false);
        };
    }, [containerRef]);

    // Функция для сброса позиции камеры
    const resetCameraPosition = useCallback(() => {
        if (cameraRef.current) {
            cameraRef.current.position.set(0, 1000, 5000);
            cameraRef.current.lookAt(0, 0, 0);
        }
        if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    }, []);

    return {
        scene: sceneRef.current,
        camera: cameraRef.current,
        renderer: rendererRef.current,
        controls: controlsRef.current,
        isSceneReady,
        resetCameraPosition
    };
};
