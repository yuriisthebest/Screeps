import { Search } from "utils/Find";
import { Placement } from "./Placements";

export class BasicConstruction {
    /**
     * Manage construction per owned room
     * TODO: Have different rooms, such as main and outposts
     *
     * === Constructions ===
     * Extensions - Always until cap
     *
     * @param room Room to construct in
     */
    static manage_construction(room: Room) {
        if (room.controller == null) { }
        // Don't construct more sites when there already exists some
        else if (!room.controller.my
            || room.find(FIND_MY_CONSTRUCTION_SITES).length > 5) { }
        else if (room.memory.construction_timeout > 0) { room.memory.construction_timeout -= 1 }
        else {
            // The room can check once to build something before going on cooldown
            room.memory.construction_timeout = 113;
            // Create extensions when available
            let available_extensions = (CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level]
                - (Search.search_structures(room, [STRUCTURE_EXTENSION]).length
                    + room.find(FIND_MY_CONSTRUCTION_SITES,
                        { filter: (struc: ConstructionSite) => struc.structureType == STRUCTURE_EXTENSION }).length))
            if (available_extensions > 0) {
                // Detemine position of extension and place it
                let position = Placement.extension(room);
                const code = this.construct(room, position, STRUCTURE_EXTENSION);
                if (code == 0) { console.log(`Created extension site at (${position.x}, ${position.y}, ${room.name})`) }
                else { console.log(`Failed to create extension construction site: code ${code}\n* Tried to place site at (${position.x}, ${position.y})`) }
            }
        }
    }

    static construct(room: Room, position: RoomPosition, structure: StructureConstant): Number {
        return room.createConstructionSite(position, structure);
    }
}
