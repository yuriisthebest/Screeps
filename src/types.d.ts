// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
    role: number;
    room?: string;
    // working: boolean;
    task?: number;
}

interface SpawnMemory {
    timeout: number;
}

interface RoomMemory {
    construction_timeout: number;
}

interface Memory {
    uuid: number;
    log: any;
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
