import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useMineStore } from '../store/StoreContext';
import Button from "./ui/Button";

const FileUploader: React.FC = observer(() => {
    const mineStore = useMineStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Обработчик загрузки файла
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        await mineStore.loadFile(file);
    };

    // Обработчик нажатия на кнопку загрузки файла
    const handleLoadButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Обработчик загрузки демонстрационного файла
    const handleLoadDemoFile = async () => {
        try {
            // Устанавливаем состояние загрузки
            mineStore.setLoading(true);
            mineStore.setLoadingStatus('Загрузка демонстрационного файла...');

            // Загружаем демонстрационный файл из папки public
            const response = await fetch('/demo/MIM_Scheme.xml');

            if (!response.ok) {
                throw new Error(`Не удалось загрузить демонстрационный файл: ${response.statusText}`);
            }

            const blob = await response.blob();

            const file = new File([blob], 'MIM_Scheme_Demo.xml', { type: 'application/xml' });

            await mineStore.loadFile(file);
        } catch (error) {
            mineStore.setError(`Ошибка загрузки демонстрационного файла: ${(error as Error).message}`);
            mineStore.setLoading(false);
        }
    };

    // Компонент спиннера с процентами
    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-zinc-600"></div>
                <div
                    className="absolute inset-0 rounded-full border-8 border-cyan-500 border-t-transparent"
                    style={{
                        transform: 'rotate(-45deg)',
                        animation: 'spin 1.5s linear infinite'
                    }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-700 text-gray-100">
            <div className="w-full max-w-xl bg-zinc-800/90 p-10 rounded-lg shadow-xl border border-zinc-600">
                <h1 className="text-3xl font-bold mb-6 text-center text-cyan-300">Визуализация схемы шахты</h1>

                <div className="mb-8 text-center">
                    <p className="mb-6 text-lg">Загрузите файл MIM_Scheme.xml для отображения схемы шахты</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-2">
                        <Button
                            onClick={handleLoadButtonClick}
                            variant="secondary"
                        >
                            {mineStore.isLoading ? 'Загрузка...' : 'Загрузить свой файл'}
                        </Button>

                        <Button
                            onClick={handleLoadDemoFile}
                            variant="primary"
                        >
                            {mineStore.isLoading ? 'Загрузка...' : 'Загрузить демо-файл'}
                        </Button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xml"
                        className="hidden"
                    />
                </div>

                {mineStore.isLoading && (
                    <LoadingSpinner />
                )}

                {mineStore.error && (
                    <div className="mt-6 p-6 bg-red-900/80 text-white rounded-lg max-w-md mx-auto border border-red-700 shadow-md">
                        <p className="font-bold mb-3 text-red-300">Ошибка:</p>
                        <p>{mineStore.error}</p>
                    </div>
                )}
            </div>

            <p className="mt-8 text-sm text-zinc-400 max-w-md text-center">
                Просмотр и анализ трехмерной модели шахты. Поддерживаются файлы в формате MIM_Scheme.xml
            </p>
        </div>
    );
});

export default FileUploader;