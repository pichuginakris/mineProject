import React from 'react';
import { observer } from 'mobx-react-lite';
import MineStatistics from './MineStatistics';
import HorizonsList from './HorizonsList';
import Button from '../ui/Button';

interface MineControlsProps {
    onBack: () => void;
    onResetView: () => void;
}

const MineControls: React.FC<MineControlsProps> = observer(({ onBack, onResetView }) => {
    return (
        <div className="absolute top-0 left-0 bg-zinc-800/90 text-gray-100 p-8 rounded-lg shadow-xl max-w-md border border-zinc-600">
            {/* Статистика */}
            <MineStatistics />

            {/* Горизонты */}
            <HorizonsList />

            {/* Кнопки */}
            <div className="flex justify-between gap-2">
                <Button
                    onClick={onBack}
                    variant="secondary"
                >
                    Загрузить другой файл
                </Button>

                <Button
                    onClick={onResetView}
                    variant="primary"
                >
                    Сбросить вид
                </Button>
            </div>
        </div>
    );
});

export default MineControls;