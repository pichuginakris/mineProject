import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMineStore } from '../../store/StoreContext';

const MineStatistics: React.FC = observer(() => {
    const mineStore = useMineStore();

    return (
        <div className="mb-4">
            <p className="font-semibold text-cyan-200 mb-3 text-lg">Статистика:</p>
            <div className="grid grid-cols-2 gap-2">
                <p>Узлов: <span className="font-mono text-cyan-200">{mineStore.statistics.nodesCount}</span></p>
                <p>Секций: <span className="font-mono text-cyan-200">{mineStore.statistics.sectionsCount}</span></p>
                <p>Выработок: <span className="font-mono text-cyan-200">{mineStore.statistics.excavationsCount}</span></p>
                <p>Горизонтов: <span className="font-mono text-cyan-200">{mineStore.statistics.horizonsCount}</span></p>
            </div>
        </div>
    );
});

export default MineStatistics;