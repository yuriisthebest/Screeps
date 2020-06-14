export class Placement {

    /**
     * Place an extension such that it is not within 2 tiles of wall, not near other structures
     * Close to a source, spawn and controller
     *
     * @param room The room to place an extension in
     */
    static extension(room: Room): RoomPosition {
        if (room.controller == null) {
            console.log('Tried to place extension in room without controller');
            return new RoomPosition(-1, -1, room.name);
        }
        let controller_pos_x = room.controller.pos.x;
        let controller_pos_y = room.controller.pos.y;
        let lowest_cost = 1000;
        let best_position: RoomPosition = new RoomPosition(0, 0, room.name);
        // Iterate over every tile
        for (const x of _.range(2, 50 - 2)) {
            for (const y of _.range(2, 50 - 2)) {
                const pos = new RoomPosition(x, y, room.name);
                // Sip this position if near structure or wall
                if (pos.findInRange(FIND_STRUCTURES, 1).length > 0) { continue }
                if (pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1).length > 0) { continue }
                if (this.near_wall(room, pos, 2)) { continue }
                // Calculate cost of tile (distance to source + spawn + controller)
                const source = pos.findClosestByRange(FIND_SOURCES);
                const spawn = pos.findClosestByRange(FIND_MY_SPAWNS);
                const cost = this.dist_to_objects(pos, [source, spawn, room.controller]);
                if (cost < lowest_cost) {
                    lowest_cost = cost;
                    best_position = pos;
                }
            }
        }
        return best_position;
    }

    private static near_wall(room: Room, pos: RoomPosition, distance: number): boolean {
        const terrain = new Room.Terrain(room.name);
        for (const x of _.range(-distance, distance)) {
            for (const y of _.range(-distance, distance)) {
                // If a lation in the terrain is a wall, then the given position is near a wall
                if (terrain.get(pos.x + x, pos.y + y) == TERRAIN_MASK_WALL) {
                    return true;
                }
            }
        }
        return false;
    }

    private static dist_to_objects(pos: RoomPosition, objects: any[]): number {
        let distance = 0;
        for (const obj of objects) {
            distance += pos.getRangeTo(obj);
        }
        return distance;
    }
}
