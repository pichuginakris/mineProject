import React from 'react';
import { observer } from 'mobx-react-lite';
import FileUploader from './FileUploader';
import MineRenderer from './MineRenderer';
import { useMineStore } from '../store/StoreContext';

const MineVisualization: React.FC = observer(() => {
    const mineStore = useMineStore();

    return (
        <div className="mine-visualization">
            {!mineStore.hasData ? (
                // Если данные не загружены, показываем компонент загрузки файла
                <FileUploader />
            ) : (
                // Если данные загружены, показываем 3D визуализацию
                <MineRenderer />
            )}
        </div>
    );
});

export default MineVisualization;