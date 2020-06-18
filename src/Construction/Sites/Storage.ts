import { Site } from "Construction/Site";
import { Search } from "utils/Find";

export class Storage extends Site {
    /**
     * Storage can be build from level 4
     */
    requirements(): boolean {
        if (this.room.controller == null) {
            return false;
        }
        return this.room.controller.level >= 4;
    }

    /**
     * Construct storage if there is not already one (In making)
     */
    should_build(): boolean {
        return this.room.storage == undefined
            && Search.search_construction_site(this.room, [STRUCTURE_STORAGE]).length != 1;
    }

    /**
     * Build the storage 2-3 tiles from the controller, near sources, 1 tile from wall
     */
    placement(): RoomPosition {
        // Placement will only be called when the requirements are met
        if (this.room.controller != undefined) {
            const c_pos = this.room.controller.pos;
            const sources = this.room.find(FIND_SOURCES);
            let min_score = null;
            let best_position;
            for (const x of _.range(-3, 4)) {
                for (const y of _.range(-3, 4)) {
                    const pos = new RoomPosition(c_pos.x + x, c_pos.y + y, this.room.name);
                    // if (pos.findInRange(FIND_STRUCTURES, 0).length > 0) { continue }
                    if (this.near_wall(this.room, pos, 1)) { continue }
                    const score = this.dist_to_objects(pos, sources);
                    if (min_score == null || score < min_score) {
                        min_score = score;
                        best_position = pos;
                    }
                }
            }
            if (best_position != undefined) {
                return best_position
            } else {
                console.log(`"Room ${this.room.name} does not
                    have a valid place for ${this.constructor.name}`);
                return new RoomPosition(-1, -1, this.room.name);
            }
        }
        console.log(`"Room ${this.room.name} does not
                    have a controller for ${this.constructor.name}`);
        return new RoomPosition(-1, -1, this.room.name);
    }

    /**
     * Return the associated structure constant of the site
     */
    get_structure_constant() {
        return STRUCTURE_STORAGE;
    }
}
