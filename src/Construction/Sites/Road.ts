import { Site } from "Construction/Site";

export class Road extends Site {
    /**
     * Roads can always be build from level 3
     */
    requirements(): boolean {
        if (this.room.controller == null) {
            return false;
        }
        return this.room.controller.level >= 3;
    }

    /**
     * Road requirements
     */
    should_build(): boolean {
        return true;
    }

    /**
     * Return the position of a valid, best palce to build the site
     */
    placement(): RoomPosition | RoomPosition[] {
        console.log(`"placement()" is not implemented for class: ${this.constructor.name}`);
        return new RoomPosition(-1, -1, this.room.name);
    }

    /**
     * Return the associated structure constant of the site
     */
    get_structure_constant() {
        return STRUCTURE_ROAD;
    }
}
