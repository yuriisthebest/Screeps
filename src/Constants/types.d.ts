// memory extension samples
interface CreepMemory {
    role: number;
    room?: string;
    // working: boolean;
    task?: number;
    dying: boolean;
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

// Room object that is not null
type NonNullRoom = NonNullable<Room>;

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
