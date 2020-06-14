import { CreepType } from "globals";

export class Search {
    // Find all specified structures in a room
    static search_structures(room: Room, types: StructureConstant[], filter?: any): AnyStructure[] {
        return room.find(FIND_STRUCTURES,
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

    /**
     * Check a room for construction sites of specific types
     *
     * @param room Room to check
     * @param types List of structures to check for
     */
    static search_construction_site(room: Room, types: StructureConstant[]): ConstructionSite[] {
        return room.find(FIND_MY_CONSTRUCTION_SITES,
            { filter: (struc: ConstructionSite) => types.includes(struc.structureType) })
    }
}
