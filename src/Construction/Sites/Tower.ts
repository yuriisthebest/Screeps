import { Site } from "Construction/Site";
import { Search } from "utils/Find";

export class Tower extends Site {
    /**
     * Limited towers per room level
     */
    requirements(): boolean {
        if (this.room.controller == undefined) { return false }
        const towers = (Search.search_structures(this.room, [STRUCTURE_TOWER]).length
            + Search.search_construction_site(this.room, [STRUCTURE_TOWER]).length);
        return towers < CONTROLLER_STRUCTURES.tower[this.room.controller.level];
    }

    /**
     * Always build a tower if able
     */
    should_build(): boolean {
        return true;
    }

    /**
     * Build towers next to spawn, near sources
     *  (Better solution: spawn near 'most dangerous' gate, near a path / storage)
     */
    placement(): RoomPosition | RoomPosition[] {
        const spawn = this.room.find(FIND_MY_SPAWNS).pop();
        if (spawn == undefined) {
            console.log(`Tried to construct a ${this.constructor.name} in room without spawn`);
            return new RoomPosition(0, 0, this.room.name);
        }
        const spawn_pos = spawn.pos;
        let best_position: RoomPosition | undefined;
        let best_score;
        const sources = this.room.find(FIND_SOURCES);
        for (const x of [-1, 1]) {
            for (const y of [-1, 1]) {
                const pos = new RoomPosition(spawn_pos.x + x, spawn_pos.y + y, this.room.name);
                if (this.room.lookForAt(LOOK_TERRAIN, pos)[0] == 'wall') { continue };
                if (this.room.lookForAt(LOOK_STRUCTURES, pos).length > 0) { continue };
                if (this.room.lookForAt(LOOK_CONSTRUCTION_SITES, pos).length > 0) { continue };
                const score = this.dist_to_objects(pos, [sources])
                if (best_score == null || score < best_score) {
                    best_score = score;
                    best_position = pos;
                }
            }
        }
        if (best_position != undefined) {
            return best_position;
        } else {
            console.log(`could not find valid place for ${this.constructor.name}`);
            return new RoomPosition(0, 0, this.room.name);
        }
    }

    /**
     * Return the associated Tower constant
     */
    get_structure_constant(): BuildableStructureConstant {
        return STRUCTURE_TOWER;
    }
}
