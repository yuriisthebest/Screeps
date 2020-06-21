import { Search } from "utils/Find";
import { Site } from "Construction/Site"

export class Extension extends Site {

    constructor(room: NonNullRoom) {
        super(room);
    }

    // Extensions can only be placed from level 2 in a room with a controller
    requirements(): boolean {
        if (this.room.controller == null) {
            return false;
        }
        return this.room.controller.level >= 2;
    }

    // Create extensions when available
    should_build(): boolean {
        if (this.room.controller == undefined) { return false }
        let available_extensions = (CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][this.room.controller.level]
            - (Search.search_structures(this.room, [STRUCTURE_EXTENSION]).length
                + this.room.find(FIND_MY_CONSTRUCTION_SITES,
                    { filter: (struc: ConstructionSite) => struc.structureType == STRUCTURE_EXTENSION }).length))
        return available_extensions > 0;
    }

    /**
     * Place an extension such that it is not within 2 tiles of wall, not near other structures
     * Close to a source, spawn and controller
     */
    placement(): RoomPosition {
        if (this.room.controller == null) {
            console.log('Tried to place extension in room without controller');
            return new RoomPosition(-1, -1, this.room.name);
        }
        let lowest_cost = 1000;
        let best_position: RoomPosition = new RoomPosition(0, 0, this.room.name);
        // Iterate over every tile
        for (const x of _.range(2, 50 - 2)) {
            for (const y of _.range(2, 50 - 2)) {
                const pos = new RoomPosition(x, y, this.room.name);
                // Sip this position if near structure or wall
                if (pos.findInRange(FIND_STRUCTURES, 1).length > 0) { continue }
                if (pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1).length > 0) { continue }
                if (this.near_wall(this.room, pos, 2)) { continue }
                // Calculate cost of tile (distance to source + spawn + controller)
                const source = pos.findClosestByRange(FIND_SOURCES);
                const spawn = pos.findClosestByRange(FIND_MY_SPAWNS);
                const cost = this.dist_to_objects(pos, [source, spawn, this.room.controller]);
                if (cost < lowest_cost) {
                    lowest_cost = cost;
                    best_position = pos;
                }
            }
        }
        return best_position;
    }

    // Return the constant for extension
    get_structure_constant(): BuildableStructureConstant {
        return STRUCTURE_EXTENSION;
    }
}
