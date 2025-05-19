import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useMineStore } from '../store/StoreContext';
import { useThreeScene } from '../hooks/useThreeScene';
import MineModel from './mine/MineModel';
import MineControls from './mine/MineControls';

const MineRenderer = observer(() => {
    const mineStore = useMineStore();
    const mountRef = useRef<HTMLDivElement | null>(null);

    const { scene, isSceneReady, resetCameraPosition } = useThreeScene(mountRef);

    // Обработчик для сброса к исходному загрузчику файлов
    const handleBack = () => {
        mineStore.reset();
    };

    return (
        <div className="relative w-full h-screen">
            {/* Контейнер для Three.js */}
            <div ref={mountRef} className="w-full h-full" />

            {/* Отрисовка модели шахты, когда сцена готова */}
            {isSceneReady && <MineModel scene={scene} />}

            {/* Панель управления */}
            <MineControls
                onBack={handleBack}
                onResetView={resetCameraPosition}
            />
        </div>
    );
});

export default MineRenderer;