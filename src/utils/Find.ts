import { CreepType } from "Constants/globals";

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

    /**
     * Querry for flags in a room and return all correct flags
     *  The room must be visible
     *  Queries can consist of colors and / or names
     */
    static search_flags(room: Room,
        req_color: ColorConstant | null = null,
        req_color2: ColorConstant | null = null,
        req_name: string | null = null): Flag[] {
        let correct_flags = [];
        for (const flag_id in Game.flags) {
            const flag = Game.flags[flag_id];
            // Check for correct room
            if (flag.room != room) { continue; }
            // Check for correct main color
            if (req_color != null) {
                if (flag.color != req_color) { continue; }
            }
            // Check for correct secondary color
            if (req_color2 != null) {
                if (flag.secondaryColor != req_color2) { continue; }
            }
            // Check for correct name
            if (req_name != null) {
                if (flag.name != req_name) { continue; }
            }
            // Querry allows for flag
            correct_flags.push(flag);
        }
        return correct_flags
    }
}
