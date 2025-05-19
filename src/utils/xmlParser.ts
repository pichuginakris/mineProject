import type {MineData, Node, Section, Excavation, Horizon} from '../models/types.ts';

// Функция для конвертации windows-1251 в UTF-8
export const decodeWindows1251 = (buffer: ArrayBuffer): string => {
    const decoder = new TextDecoder('windows-1251');
    return decoder.decode(buffer);
};

function getTextContent(element: Element, tagName: string, defaultValue: string = ""): string {
    return element.getElementsByTagName(tagName)[0]?.textContent || defaultValue;
}

function getNumberContent(element: Element, tagName: string, defaultValue: number = 0): number {
    return parseFloat(getTextContent(element, tagName, defaultValue.toString()));
}

function getBooleanContent(element: Element, tagName: string): boolean {
    return getTextContent(element, tagName) === "true";
}

export const parseXML = (xmlText: string, updateStatus?: (status: string) => void): MineData => {
    try {
        updateStatus?.('Разбор XML...');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Проверка наличия ошибок в разборе XML
        const parserError = xmlDoc.getElementsByTagName('parsererror');
        if (parserError.length > 0) {
            throw new Error(`Ошибка разбора XML: ${parserError[0].textContent}`);
        }

        const nodesMap = parseElements<Node>(xmlDoc, "Node", parseNode, updateStatus);
        const sectionsMap = parseElements<Section>(xmlDoc, "Section", parseSection, updateStatus);
        const excavationsMap = parseElements<Excavation>(xmlDoc, "Excavation", parseExcavation, updateStatus);
        const horizonsArray = parseElementsToArray<Horizon>(xmlDoc, "Horizon", parseHorizon, updateStatus);

        updateStatus?.('Разбор XML завершен!');
        return {
            nodes: nodesMap,
            sections: sectionsMap,
            excavations: excavationsMap,
            horizons: horizonsArray
        };
    } catch (error) {
        throw new Error(`Ошибка при парсинге XML: ${(error as Error).message}`);
    }
};

// Функция для парсинга коллекций элементов в Map
function parseElements<T extends { Id: string }>(
    xmlDoc: Document,
    tagName: string,
    parser: (element: Element) => T,
    updateStatus?: (status: string) => void
): Map<string, T> {
    updateStatus?.(`Обработка ${tagName}...`);
    const elements = xmlDoc.getElementsByTagName(tagName);
    const result = new Map<string, T>();

    for (let i = 0; i < elements.length; i++) {
        const item = parser(elements[i]);
        result.set(item.Id, item);
    }

    return result;
}

// Функция для парсинга коллекций элементов в массив
function parseElementsToArray<T>(
    xmlDoc: Document,
    tagName: string,
    parser: (element: Element) => T,
    updateStatus?: (status: string) => void
): T[] {
    updateStatus?.(`Обработка ${tagName}...`);
    const elements = xmlDoc.getElementsByTagName(tagName);
    const result: T[] = [];

    for (let i = 0; i < elements.length; i++) {
        result.push(parser(elements[i]));
    }

    return result;
}

// Парсеры для каждого типа элементов
function parseNode(element: Element): Node {
    return {
        Id: getTextContent(element, "Id"),
        Guid: getTextContent(element, "Guid"),
        X: getNumberContent(element, "X"),
        Y: getNumberContent(element, "Y"),
        Z: getNumberContent(element, "Z")
    };
}

function parseSection(element: Element): Section {
    return {
        Id: getTextContent(element, "Id"),
        Guid: getTextContent(element, "Guid"),
        StartNodeId: getTextContent(element, "StartNodeId"),
        EndNodeId: getTextContent(element, "EndNodeId"),
        Thickness: getNumberContent(element, "Thickness", 1)
    };
}

function parseExcavation(element: Element): Excavation {
    return {
        Id: getTextContent(element, "Id"),
        Guid: getTextContent(element, "Guid"),
        Sections: getTextContent(element, "Sections"),
        Name: getTextContent(element, "Name"),
        ObjectId: getTextContent(element, "ObjectId"),
        ExcavationType: getTextContent(element, "ExcavationType")
    };
}

function parseHorizon(element: Element): Horizon {
    return {
        Id: getTextContent(element, "Id"),
        Guid: getTextContent(element, "Guid"),
        Sections: getTextContent(element, "Sections"),
        Name: getTextContent(element, "Name"),
        Altitude: getNumberContent(element, "Altitude"),
        IsMine: getBooleanContent(element, "IsMine"),
        ObjectId: getTextContent(element, "ObjectId")
    };
}
