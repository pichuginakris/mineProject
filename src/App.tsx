import React from 'react';
import { StoreProvider } from './store/StoreContext';
import MineVisualization from "./components/MineVisualization";

const App: React.FC = () => {
    return (
        <StoreProvider>
            <MineVisualization />
        </StoreProvider>
    );
};

export default App;