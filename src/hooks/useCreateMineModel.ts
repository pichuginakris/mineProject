import { useEffect } from 'react';
import * as THREE from 'three';
import { useMineStore } from '../store/StoreContext';
import {createTunnel, HORIZON_COLORS, HorizonInfo, MineElementInfo} from '../utils/threeHelpers';
import { removeObjectByName } from '../utils/threeCleanup';
import {Excavation, Horizon, ModelData, Node} from "../models/types";
import {MineStore} from "../store/MineStore";

interface UseCreateMineModelProps {
    scene: THREE.Scene | null;
    modelData: ModelData | null;
}

// Хук для создания и управления 3D-моделью шахты
export function useCreateMineModel({ scene, modelData }: UseCreateMineModelProps) {
    const mineStore = useMineStore();

    useEffect(() => {
        if (!scene || !modelData || !mineStore.hasData) return;

        // Очищаем предыдущую модель
        removeObjectByName(scene, 'mineGroup');

        const { center } = modelData;

        // Создаем корневую группу модели
        const mineGroup = new THREE.Group();
        mineGroup.name = 'mineGroup';
        scene.add(mineGroup);

        // Создаем выработки
        createExcavations(mineGroup, center, mineStore);
        // Создаем горизонты и туннели
        createHorizons(mineGroup, center, mineStore);

        // Очистка при размонтировании
        return () => {
            if (scene) {
                removeObjectByName(scene, 'mineGroup');
            }
        };
    }, [scene, modelData, mineStore]);

    return null;
}

// Вспомогательная функция для создания горизонтов
function createHorizons(parentGroup: THREE.Group, center: THREE.Vector3, mineStore: MineStore) {
    const horizonInfoMap: Record<string, HorizonInfo> = {};

    mineStore.horizons.forEach((horizon: Horizon, index: number) => {
        const sectionIds = horizon.Sections.split(',');
        const horizonColor = HORIZON_COLORS[index % HORIZON_COLORS.length];

        // Создаем группу для горизонта
        const horizonGroup = new THREE.Group();
        horizonGroup.name = `Horizon_${horizon.Id}`;
        parentGroup.add(horizonGroup);

        // Инициализируем информацию о горизонте
        horizonInfoMap[horizon.Id] = {
            name: horizon.Name,
            altitude: horizon.Altitude,
            color: horizonColor,
            sectionsTotal: sectionIds.length,
            sectionsValid: 0
        };

        // Создаем секции для горизонта
        const { valid, invalid } = createSections(
            horizonGroup,
            sectionIds,
            horizonColor,
            center,
            mineStore,
            horizonInfoMap[horizon.Id]
        );

        console.log(`Горизонт ${horizon.Name}: Отрисовано ${valid} секций, пропущено ${invalid} секций`);
    });

    return horizonInfoMap;
}

// Вспомогательная функция для создания выработок
function createExcavations(parentGroup: THREE.Group, center: THREE.Vector3, mineStore: MineStore): Record<string, MineElementInfo> {
    const excavationInfoMap: Record<string, MineElementInfo> = {};
    const excavations = Array.from(mineStore.excavations.values());

    excavations.forEach((excavation: Excavation, index: number) => {
        if (!excavation.Sections) return;

        const sectionIds = excavation.Sections.split(',').filter(id => id.trim() !== '');
        const excavationColor = HORIZON_COLORS[index % HORIZON_COLORS.length];

        // Создаем группу для выработки
        const excavationGroup = new THREE.Group();
        excavationGroup.name = `Excavation_${excavation.Id}`;
        parentGroup.add(excavationGroup);

        // Инициализируем информацию о выработке
        excavationInfoMap[excavation.Id] = {
            name: excavation.Name,
            excavationType: excavation.ExcavationType,
            color: excavationColor,
            sectionsTotal: sectionIds.length,
            sectionsValid: 0
        };

        // Создаем секции для выработки
        const { valid, invalid } = createSections(
            excavationGroup,
            sectionIds,
            excavationColor,
            center,
            mineStore,
            excavationInfoMap[excavation.Id]
        );

        console.log(`Выработка ${excavation.Name}: Отрисовано ${valid} секций, пропущено ${invalid} секций`);
    });

    return excavationInfoMap;
}


// Вспомогательная функция для создания секций
function createSections(
    parentGroup: THREE.Group,
    sectionIds: string[],
    color: number,
    center: THREE.Vector3,
    mineStore: MineStore,
    horizonInfo: HorizonInfo
) {
    let validSections = 0;
    let invalidSections = 0;

    sectionIds.forEach(sectionId => {
        const section = mineStore.sections.get(sectionId);
        if (!section) {
            invalidSections++;
            return;
        }

        const startNode = mineStore.nodes.get(section.StartNodeId);
        const endNode = mineStore.nodes.get(section.EndNodeId);

        if (!startNode || !endNode) {
            invalidSections++;
            return;
        }

        validSections++;
        horizonInfo.sectionsValid++;

        const startPos = createCenteredPosition(startNode, center);
        const endPos = createCenteredPosition(endNode, center);

        const { tunnel, startCap, endCap } = createTunnel(
            startPos,
            endPos,
            section.Thickness,
            color
        );

        parentGroup.add(tunnel);
        parentGroup.add(startCap);
        parentGroup.add(endCap);
    });

    return { valid: validSections, invalid: invalidSections };
}

// Вспомогательная функция для создания центрированной позиции
function createCenteredPosition(node: Node, center: THREE.Vector3) {
    return new THREE.Vector3(
        node.X - center.x,
        node.Z - center.z,
        node.Y - center.y
    );
}
