// store/StoreContext.tsx - Контекст для доступа к хранилищу MobX

import React, { createContext, useContext } from 'react';
import { MineStore } from './MineStore';
import mineStore from './MineStore';

// Интерфейс для контекста хранилищ
interface StoreContextInterface {
    mineStore: MineStore;
}

// Создаем контекст
export const StoreContext = createContext<StoreContextInterface>({
    mineStore
});

// Провайдер для предоставления хранилищ компонентам
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const stores: StoreContextInterface = {
        mineStore
    };

    return (
        <StoreContext.Provider value={stores}>
            {children}
        </StoreContext.Provider>
    );
};

// Хук для удобного доступа к хранилищам
export const useStores = () => useContext(StoreContext);

// Хук для доступа непосредственно к хранилищу шахты
export const useMineStore = () => {
    const { mineStore } = useStores();
    return mineStore;
};