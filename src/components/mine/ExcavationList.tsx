import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMineStore } from '../../store/StoreContext';

const ExcavationsList: React.FC = observer(() => {
    const mineStore = useMineStore();

    // Преобразуем Map в массив для удобства работы
    const excavations = Array.from(mineStore.excavations.values());

    return (
        <div className="mb-4">
            <p className="font-semibold text-cyan-200 mb-4 text-lg">Выработки:</p>
            <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {excavations.map((excavation) => (
                    <div
                        key={excavation.Id}
                        className="flex items-center p-3 rounded-md transition-colors hover:bg-zinc-700 border border-zinc-600"
                    >

                        <div className="flex flex-col">
                            <p className="truncate text-sm font-medium text-white overflow-y-auto ">{excavation.Name}</p>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default ExcavationsList;
