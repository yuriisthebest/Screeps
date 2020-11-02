import { Site } from "Construction/Site";

/**
 * Walls are defensive structures that are calculated once per room
 * They are checked every build tick to build or rebuild broken walls
 *
 * Walls are build around room exits to limit enemy movement
 * Leave holes for ramparts every three spaces to travel and defend
 */
export class Wall extends Site {
    /**
     * Walls can be build from level 3
     */
    requirements(): boolean {
        if (this.room.controller == null) {
            return false;
        }
        return this.room.controller.level >= 3;
    }

    /**
     * Walls should be build if walls are missing or not yet placed
     *  The walls are stored in the memory of each room
     */
    should_build(): boolean {
        if (this.room.memory.walls == undefined) { return true; }
        for (const wall_prop of this.room.memory.walls) {
            const wall = new RoomPosition(wall_prop.x, wall_prop.y, wall_prop.roomName);
            if (!(wall.lookFor(LOOK_CONSTRUCTION_SITES).length > 0
                && wall.lookFor(LOOK_CONSTRUCTION_SITES)[0].structureType == STRUCTURE_WALL)
                && !(wall.lookFor(LOOK_STRUCTURES).length > 0
                    && wall.lookFor(LOOK_STRUCTURES)[0].structureType == STRUCTURE_WALL)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Build walls next to room entrances, leave room for ramparts so creeps can move
     *  If walls have been calculated, some might have been destroyed.
     *  Check to see which are gone
     */
    placement(): RoomPosition | RoomPosition[] {
        if (this.room.memory.walls == undefined) {
            return this.assign_walls();
        } else {
            let broken_walls = [];
            for (const wall_prop of this.room.memory.walls) {
                const wall = new RoomPosition(wall_prop.x, wall_prop.y, wall_prop.roomName);
                if ((wall.lookFor(LOOK_CONSTRUCTION_SITES).length > 0
                    && wall.lookFor(LOOK_CONSTRUCTION_SITES)[0].structureType == STRUCTURE_WALL)
                    || (wall.lookFor(LOOK_STRUCTURES).length > 0
                        && wall.lookFor(LOOK_STRUCTURES)[0].structureType == STRUCTURE_WALL)) {
                    continue;
                }
                broken_walls.push(wall);
            }
            return broken_walls;
        }
    }

    /**
     * Assign the placement of walls to a room
     *  Place a list of all walls in the memory of the room
     *
     * Return the list with positions
     */
    assign_walls(): RoomPosition[] {
        // Find appropiate walls for each side separately
        let wall_positions: RoomPosition[] = [];
        let neighbor = new RoomPosition(25, 25, this.room.name);
        // For each exit tile, create a wall 2 spaces from it
        // For the first and last exit tiles, create wall exits
        let exits = this.room.find(FIND_EXIT_BOTTOM);
        for (const exit of exits) {
            wall_positions.push(new RoomPosition(exit.x, exit.y - 2, this.room.name))
            // First exit in a row
            if (!exit.isNearTo(neighbor)) {
                wall_positions.push(new RoomPosition(exit.x - 2, exit.y - 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x - 1, exit.y - 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x - 2, exit.y - 1, this.room.name))
            }
            // If exit last in row
            if (Game.map.getRoomTerrain(this.room.name).get(exit.x + 1, exit.y) == TERRAIN_MASK_WALL) {
                wall_positions.push(new RoomPosition(exit.x + 2, exit.y - 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x + 1, exit.y - 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x + 2, exit.y - 1, this.room.name))
            }
            neighbor = exit;
        }

        // Find top wall positions
        exits = this.room.find(FIND_EXIT_TOP);
        for (const exit of exits) {
            wall_positions.push(new RoomPosition(exit.x, exit.y + 2, this.room.name))
            // First exit in a row
            if (!exit.isNearTo(neighbor)) {
                wall_positions.push(new RoomPosition(exit.x - 2, exit.y + 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x - 1, exit.y + 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x - 2, exit.y + 1, this.room.name))
            }
            // If exit last in row
            if (Game.map.getRoomTerrain(this.room.name).get(exit.x + 1, exit.y) == TERRAIN_MASK_WALL) {
                wall_positions.push(new RoomPosition(exit.x + 2, exit.y + 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x + 1, exit.y + 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x + 2, exit.y + 1, this.room.name))
            }
            neighbor = exit;
        }

        // Find left wall positions
        exits = this.room.find(FIND_EXIT_LEFT);
        for (const exit of exits) {
            wall_positions.push(new RoomPosition(exit.x + 2, exit.y, this.room.name))
            // First exit in a row
            if (!exit.isNearTo(neighbor)) {
                wall_positions.push(new RoomPosition(exit.x + 2, exit.y - 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x + 2, exit.y - 1, this.room.name))
                wall_positions.push(new RoomPosition(exit.x + 1, exit.y - 2, this.room.name))
            }
            // If exit last in row
            if (Game.map.getRoomTerrain(this.room.name).get(exit.x, exit.y + 1) == TERRAIN_MASK_WALL) {
                wall_positions.push(new RoomPosition(exit.x + 2, exit.y + 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x + 2, exit.y + 1, this.room.name))
                wall_positions.push(new RoomPosition(exit.x + 1, exit.y + 2, this.room.name))
            }
            neighbor = exit;
        }

        // Find right wall positions
        exits = this.room.find(FIND_EXIT_RIGHT);
        for (const exit of exits) {
            wall_positions.push(new RoomPosition(exit.x - 2, exit.y, this.room.name))
            // First exit in a row
            if (!exit.isNearTo(neighbor)) {
                wall_positions.push(new RoomPosition(exit.x - 2, exit.y - 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x - 2, exit.y - 1, this.room.name))
                wall_positions.push(new RoomPosition(exit.x - 1, exit.y - 2, this.room.name))
            }
            // If exit last in row
            if (Game.map.getRoomTerrain(this.room.name).get(exit.x, exit.y + 1) == TERRAIN_MASK_WALL) {
                wall_positions.push(new RoomPosition(exit.x - 2, exit.y + 2, this.room.name))
                wall_positions.push(new RoomPosition(exit.x - 2, exit.y + 1, this.room.name))
                wall_positions.push(new RoomPosition(exit.x - 1, exit.y + 2, this.room.name))
            }
            neighbor = exit;
        }
        // Remove undestructable terrain from wall positions
        var positions = wall_positions.filter(function (wall, index, arr) {
            return Game.map.getRoomTerrain(wall.roomName).get(wall.x, wall.y) != TERRAIN_MASK_WALL
        })
        // TODO: Add gates and remove walls from those places
        var gates = this.assign_gates(positions)
        var positions = positions.filter(function (wall, index, arr) {
            return !gates.includes(wall)
        })
        // Store the wall positions in memory
        this.room.memory.walls = positions;
        return positions;
    }

    /**
     * Determine where in the wall holes should go for entrances
     * Leave a space every 3 spaces
     * Do not remove the
     *
     * @param wall_positions List of positions where walls should be created
     */
    assign_gates(wall_positions: RoomPosition[]): RoomPosition[] {
        var gates: RoomPosition[] = [];
        for (const wall of wall_positions) {
            if (wall.x % 3 == 0 && wall.x != 48) { gates.push(wall) }
            if (wall.y % 3 == 0 && wall.y != 48) { gates.push(wall) }
        }
        this.room.memory.gates = gates;
        return gates
    }

    /**
     * Return the associated Wall constant
     */
    get_structure_constant(): BuildableStructureConstant {
        return STRUCTURE_WALL;
    }
}
