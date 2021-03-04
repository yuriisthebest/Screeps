// memory extension samples
interface CreepMemory {
    role: number;
    room?: string;
    // working: boolean;
    task?: number;
    dying: boolean;
    path?: RoomPosition[];
}

interface SpawnMemory {
    timeout: number;
    scout_timer: number;
}

interface RoomMemory {
    construction_timeout: number;
    walls: RoomPosition[];
    gates: RoomPosition[];
    ramparts: RoomPosition[];
    evaluation_time: number;
    ownership: number;
    treat: number;
    purpose: number;
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
