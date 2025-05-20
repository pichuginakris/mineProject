import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMineStore } from '../../store/StoreContext';
import { HORIZON_COLORS } from '../../utils/threeHelpers';

const HorizonsList: React.FC = observer(() => {
    const mineStore = useMineStore();

    return (
        <div className="mb-4">
            <p className="font-semibold text-cyan-200 mb-4 text-lg">Горизонты:</p>
            <div className="grid grid-cols-2 gap-4  max-h-64 overflow-y-auto">
                {mineStore.horizons.map((horizon, index) => (
                    <div
                        key={horizon.Id}
                        className="flex items-center p-3 rounded-md transition-colors hover:bg-zinc-700 border border-zinc-600"
                    >
                        <span
                            className="inline-block w-4 h-4 mr-3 rounded-full"
                            style={{
                                backgroundColor: `#${HORIZON_COLORS[index % HORIZON_COLORS.length].toString(16).padStart(6, '0')}`,
                                boxShadow: `0 0 6px #${HORIZON_COLORS[index % HORIZON_COLORS.length].toString(16).padStart(6, '0')}`
                            }}
                        ></span>
                        <div className="flex flex-col">
                            <span className="truncate text-sm font-medium text-white">{horizon.Name}</span>
                            <span className="text-xs text-zinc-300">({horizon.Altitude}м)</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default HorizonsList;
