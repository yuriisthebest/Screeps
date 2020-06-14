import { CreepType } from "globals";

export class Search {
    // Find all specified structures in a room
    static search_structures(room: Room, types: StructureConstant[], filter?: any): AnyOwnedStructure[] {
        return room.find(FIND_MY_STRUCTURES,
            {
                filter: (struc: Structure) => {
                    if (filter == undefined) {
                        return types.includes(struc.structureType)
                    }
                    else {
                        return types.includes(struc.structureType) && filter(struc)
                    }
                }
            })
    }

    static search_creeps(room: Room, types: CreepType[]): Creep[] {
        return room.find(FIND_MY_CREEPS,
            { filter: (creep: Creep) => types.includes(creep.memory.role) })
    }
}
