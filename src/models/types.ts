import * as THREE from "three";

export interface Node {
    Id: string;
    Guid: string;
    X: number;
    Y: number;
    Z: number;
}

export interface Section {
    Id: string;
    Guid: string;
    StartNodeId: string;
    EndNodeId: string;
    Thickness: number;
}

export interface Excavation {
    Id: string;
    Guid: string;
    Sections: string;
    Name: string;
    ObjectId: string;
    ExcavationType: string;
}

export interface Horizon {
    Id: string;
    Guid: string;
    Sections: string;
    Name: string;
    Altitude: number;
    IsMine: boolean;
    ObjectId: string;
}

export interface MineData {
    nodes: Map<string, Node>;
    sections: Map<string, Section>;
    excavations: Map<string, Excavation>;
    horizons: Horizon[];
}

export interface ModelData {
    center: THREE.Vector3;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
}
