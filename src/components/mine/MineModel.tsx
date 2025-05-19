import React, { useMemo } from 'react';
import * as THREE from 'three';
import { observer } from 'mobx-react-lite';
import { useMineStore } from '../../store/StoreContext';
import { calculateModelCenter } from '../../utils/threeHelpers';
import { useCreateMineModel } from '../../hooks/useCreateMineModel';
import { ModelData} from "../../models/types";

interface MineModelProps {
    scene: THREE.Scene | null;
}

const MineModel: React.FC<MineModelProps> = observer(({ scene }) => {
    const mineStore = useMineStore();

    // Вычисляем центр модели
    const modelData = useMemo<ModelData | null>(() => {
        if (!mineStore.hasData) return null;

        const result = calculateModelCenter(mineStore.nodes);
        return {
            center: new THREE.Vector3(result.center.x, result.center.y, result.center.z),
            dimensions: result.dimensions
        };
    }, [mineStore.hasData, mineStore.nodes]);

    // Используем хук для создания модели
    useCreateMineModel({ scene, modelData });

    return null;
});

export default MineModel;