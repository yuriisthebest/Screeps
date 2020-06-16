import { Site } from "Construction/Site";
import { Search } from "utils/Find";

export class Storage extends Site {
    /**
     * Storage can be build from level 3
     */
    requirements(): boolean {
        if (this.room.controller == null) {
            return false;
        }
        return this.room.controller.level >= 3;
    }

    /**
     * Construct storage if there is not already one
     */
    should_build(): boolean {
        return this.room.storage == undefined;
    }

    /**
     * Build the storage 2-3 tiles from the controller, near sources
     */
    placement(): RoomPosition {
        // Placement will only be called when the requirements are met
        if (this.room.controller != undefined) {
            const c_pos = this.room.controller.pos;
            // for (x _.range())
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
