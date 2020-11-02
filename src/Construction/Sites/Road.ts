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
     * Roads should be build when there are roads missing from the network
     */
    should_build(): boolean {
        return false;
    }

    /**
     * Roads should be build around special structures:
     *  Spawn, Containers, Storage
     * And roads should be build to storage from:
     *  Spawn, Containers, Extension flags, ~Room Entranches, ~Towers, ~Industry
     * Also note roads should be:
     *  Within extension rows?
     *
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
