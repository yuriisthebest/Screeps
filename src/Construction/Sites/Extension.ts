import { Search } from "utils/Find";
import { Site } from "Construction/Site"
import { Flag_color } from "Constants/globals";
import { Storage } from "./Storage";

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
    placement_old(): RoomPosition {
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

    /**
     * Place an extension such that it is not within 2 tiles of wall, not near other structures
     * Close to a source, spawn and controller
     *
     * Better, Place extensions around diagonal paths near the controller (storage)
     *
     * Place a flag near the storage to indicate the start of a diagonal path
     *  The diagonal path will move away from the storage, with MAX_LENGTH 6
     *
     * If no extensions can be placed, a new flag is created
     */
    placement(): RoomPosition {
        if (this.room.controller == null) {
            console.log('Tried to place extension in room without controller');
            return new RoomPosition(-1, -1, this.room.name);
        }
        const MAX_LENGTH = 3; // 4 Extensions per length = 12 per row
        // Find position of storage or its flag
        let storage_pos
        if (this.room.storage) {
            storage_pos = this.room.storage.pos;
        } else {
            let flag = Search.search_flags(this.room,
                Flag_color['storage'], Flag_color['storage'])
            // Take the position of the flag, or create a storage flag and take that position
            if (flag.length == 0) {
                // Find a place for the storage and create a flag
                storage_pos = new Storage(this.room).placement();
                const code = storage_pos.createFlag('Storage', Flag_color['storage'], Flag_color['storage'])
                if (code != 'Storage') {
                    console.log(`Failed to place flag 'Storage', code: ${code}`);
                }
            } else {
                storage_pos = flag[0].pos;
            }
        }
        // Find flags in the room
        const flags = Search.search_flags(this.room,
            Flag_color['extension'],
            Flag_color['extension']);
        for (const flag of flags) {
            // Try to place an extension at a flag
            const position = this.place_extension(flag.pos, storage_pos, MAX_LENGTH);
            if (position != null) { return position; }
        }
        // No extensions are possible at the current flags, create a new flag, add extension
        const pos = this.extension_flag_position(storage_pos, MAX_LENGTH);
        pos.createFlag(`Extension${flags.length}`,
            Flag_color['extension'], Flag_color['extension']);
        const position = this.place_extension(pos, storage_pos, MAX_LENGTH);
        if (position != null) { return position }
        else {
            console.log(`No extension can be placed at new flag (${pos.x}, ${pos.y}, ${pos.roomName})`)
            return new RoomPosition(-1, -1, this.room.name);
        }
    }

    /**
     * Place an extension next to the diagonal from the flag away from storage position
     *
     * Return a position if possible, else return null
     */
    place_extension(flag: RoomPosition, storage: RoomPosition,
        max_length: number): RoomPosition | null {
        // Calculate the direction of the diagonal
        const dirX = ((flag.x > storage.x) ? 1 : -1);
        const dirY = ((flag.y > storage.y) ? 1 : -1);
        // Keep following the diagonal, until max_length
        for (const k of _.range(max_length)) {
            // First, try placing outer extensions, then inner
            for (const i of _.range(-1, 1)) {
                const place1 = new RoomPosition(flag.x + dirX * (k + 1),
                    flag.y + dirY * (k + i), this.room.name);
                // Return the first place if valid
                if (this.valid_position(place1)) { return place1; }

                const place2 = new RoomPosition(flag.x + dirX * (k + i),
                    flag.y + dirY * (k + 1), this.room.name)
                // Return the second place if valid
                if (this.valid_position(place2)) { return place2; }
            }
        }
        // If none of the possible places is valid, return null
        return null;
    }

    /**
     * Check if a position in the room is valid for an extension
     *
     * Extensions must be build on a free place and should not touch a wall
     */
    valid_position(pos: RoomPosition): Boolean {
        // if (pos.x < 1 || pos.x > 48) { return false; }
        // if (pos.y < 1 || pos.y > 48) { return false; }
        if (pos.lookFor(LOOK_STRUCTURES).length >= 1) { return false; }
        if (pos.lookFor(LOOK_CONSTRUCTION_SITES).length >= 1) { return false; }
        if (Game.map.getRoomTerrain(this.room.name).get(pos.x, pos.y) == TERRAIN_MASK_WALL) { return false }
        if (this.near_wall(this.room, pos, 1)) { return false; }
        return true;
    }

    /**
     * Find a location for a new flag
     *
     * :param storage: The position of the storage in the room
     */
    extension_flag_position(storage: RoomPosition, max_length: number): RoomPosition {
        let best_score = 0;
        let best_position: RoomPosition = new RoomPosition(0, 0, this.room.name);
        // Iterate over every tile
        for (const x of _.range(2, 50 - 2)) {
            for (const y of _.range(2, 50 - 2)) {
                const pos = new RoomPosition(x, y, this.room.name);
                // Skip this position if near the storage
                if (pos.getRangeTo(storage) <= 2) { continue; }
                // Skip this position if near structure or wall
                if (pos.findInRange(FIND_STRUCTURES, 1).length > 0) { continue }
                if (pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1).length > 0) { continue }
                if (this.near_wall(this.room, pos, 2)) { continue }

                // Calculate score of tile (amount of placable extensions)
                let score = 0;
                const dirX = ((pos.x > storage.x) ? 1 : -1);
                const dirY = ((pos.y > storage.y) ? 1 : -1);
                for (const k of _.range(max_length)) {
                    // If the diagonal point is near the edge or obstructed, stop
                    if (pos.x + dirX * k < 1 || pos.x + dirX * k > 48) { break; }
                    if (pos.y + dirY * k < 1 || pos.y + dirY * k > 48) { break; }
                    const diagonal = new RoomPosition(pos.x + dirX * k,
                        pos.y + dirY * k, this.room.name)
                    if (!this.valid_position(diagonal)) { break; }
                    // First, try placing outer extensions, then inner
                    for (const i of _.range(-1, 2)) {
                        const place1 = new RoomPosition(pos.x + dirX * (k + 1),
                            pos.y + dirY * (k + i), this.room.name);
                        // Return the first place if valid
                        if (this.valid_position(place1)) { score += 1; }

                        const place2 = new RoomPosition(pos.x + dirX * (k + i),
                            pos.y + dirY * (k + 1), this.room.name)
                        // Return the second place if valid
                        if (this.valid_position(place2)) { score += 1; }
                    }
                }
                // New best, when score is better, or score is equal but closer to the storage
                if (score > best_score ||
                    (score == best_score &&
                        pos.getRangeTo(storage) < best_position.getRangeTo(storage))) {
                    best_score = score;
                    best_position = pos;
                }
            }
        }
        console.log(`Found position for new extension flag at (${best_position.x}, ${best_position.y}, ${best_position.roomName})`)
        return best_position;
    }

    // Return the constant for extension
    get_structure_constant(): BuildableStructureConstant {
        return STRUCTURE_EXTENSION;
    }
}
