/**
 * Abstract class to organize all construction sites
 */
export class Site {
    public room: NonNullRoom;
    constructor(room: NonNullRoom) {
        this.room = room;
        // if (room.controller == null) { this.room = new Room('a') }
        // else {
        //     this.room = room;
        // }
    }

    /**
     * Every construction site should implement the requirements for building the site
     */
    should_build(): boolean {
        console.log(`"should_build()" is not implemented for class: ${this.constructor.name}`)
        return false;
    }

    /**
     * Return the position of a valid, best palce to build the site
     */
    placement(): RoomPosition | RoomPosition[] {
        console.log(`"placement()" is not implemented for class: ${this.constructor.name}`)
        return new RoomPosition(-1, -1, this.room.name);
    }

    /**
     * Return the associated structure constant of the site
     */
    get_structure_constant(): BuildableStructureConstant | -1 {
        console.log(`"get_structure_constant()" is not implemented for class: ${this.constructor.name}`)
        return -1;
    }

    /**
     * Whether there is a terrain wall within 'distance' of the given position in the room
     *
     * @param room The room to check in
     * @param pos The position from where to check
     * @param distance The distance from which to check
     */
    protected near_wall(room: Room, pos: RoomPosition, distance: number): boolean {
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

    /**
     * Return the sum of the direct distance from all objects to the given position
     *
     * @param pos The position to check from
     * @param objects Objects to check
     */
    protected dist_to_objects(pos: RoomPosition, objects: any[]): number {
        let distance = 0;
        for (const obj of objects) {
            distance += pos.getRangeTo(obj);
        }
        return distance;
    }
}
