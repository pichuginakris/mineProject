import { makeObservable, observable, action, computed } from 'mobx';
import type { Node, Section, Excavation, Horizon, MineData } from '../models/types';
import { decodeWindows1251, parseXML } from '../utils/xmlParser';

export class MineStore {
    // Данные шахты
    @observable nodes: Map<string, Node> = new Map();
    @observable sections: Map<string, Section> = new Map();
    @observable excavations: Map<string, Excavation> = new Map();
    @observable horizons: Horizon[] = [];

    // Состояние загрузки
    @observable isLoading: boolean = false;
    @observable loadingProgress: number = 0;
    @observable loadingStatus: string = '';
    @observable error: string | null = null;

    constructor() {
        makeObservable(this);
    }

    // Вычисляемое свойство для проверки наличия данных
    @computed get hasData(): boolean {
        return this.nodes.size > 0 && this.sections.size > 0;
    }

    // Вычисляемое свойство для статистики
    @computed get statistics() {
        return {
            nodesCount: this.nodes.size,
            sectionsCount: this.sections.size,
            excavationsCount: this.excavations.size,
            horizonsCount: this.horizons.length
        };
    }

    // Действие для установки состояния загрузки
    @action.bound
    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    // Действие для установки статуса загрузки
    @action.bound
    setLoadingStatus(status: string) {
        this.loadingStatus = status;
    }

    // Действие для установки прогресса загрузки
    @action.bound
    setLoadingProgress(progress: number) {
        this.loadingProgress = progress;
    }

    // Действие для установки ошибки
    @action.bound
    setError(error: string | null) {
        this.error = error;
    }

    // Действие для обновления статуса загрузки
    @action.bound
    updateLoadingStatus(status: string) {
        this.loadingStatus = status;
    }

    // Действие для сохранения данных шахты
    @action.bound
    setMineData(data: MineData) {
        this.nodes = data.nodes;
        this.sections = data.sections;
        this.excavations = data.excavations;
        this.horizons = data.horizons;
    }

    // Действие для сброса данных
    @action.bound
    reset() {
        this.nodes = new Map();
        this.sections = new Map();
        this.excavations = new Map();
        this.horizons = [];
        this.error = null;
        this.isLoading = false;
        this.loadingProgress = 0;
        this.loadingStatus = '';
    }

    // Действие для загрузки файла
    @action.bound
    async loadFile(file: File) {
        try {
            this.setLoading(true);
            this.setError(null);
            this.setLoadingStatus(`Загрузка файла: ${file.name}...`);
            this.setLoadingProgress(0);

            // Чтение файла
            const fileData = await this.readFileAsArrayBuffer(file);
            this.setLoadingProgress(30);

            // Конвертация из windows-1251 в UTF-8
            this.setLoadingStatus('Конвертация из windows-1251 в UTF-8...');
            const xmlText = decodeWindows1251(fileData);
            this.setLoadingProgress(50);

            // Парсинг XML
            this.setLoadingStatus('Парсинг XML...');
            const parsedData = parseXML(xmlText, this.updateLoadingStatus);
            this.setLoadingProgress(90);

            // Сохранение данных в хранилище
            this.setMineData(parsedData);
            this.setLoadingProgress(100);

            // Вывод статистики в консоль
            console.log(`Загружено узлов: ${parsedData.nodes.size}`);
            console.log(`Загружено секций: ${parsedData.sections.size}`);
            console.log(`Загружено выработок: ${parsedData.excavations.size}`);
            console.log(`Загружено горизонтов: ${parsedData.horizons.length}`);

            this.setLoading(false);
            this.setLoadingStatus('');
        } catch (err) {
            this.setError(`Ошибка при загрузке файла: ${(err as Error).message}`);
            this.setLoading(false);
            this.setLoadingStatus('');
        }
    }

    // Вспомогательный метод для чтения файла как ArrayBuffer
    private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target?.result) {
                    resolve(e.target.result as ArrayBuffer);
                } else {
                    reject(new Error('Ошибка чтения файла'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Ошибка чтения файла'));
            };

            reader.readAsArrayBuffer(file);
        });
    }
}

const mineStore = new MineStore();

export default mineStore;