import { Site } from "Construction/Site";
import { Search } from "utils/Find";

export class Tower extends Site {
    /**
     *
     */
    requirements(): boolean {
        return false;
    }

    /**
     *
     */
    should_build(): boolean {
        return false;
    }

    /**
     * Build walls next to room entrances, leave room for ramparts so creeps can move
     */
    placement(): RoomPosition | RoomPosition[] {
        return RoomPosition(-1, -1, 'sim');
    }

    /**
     * Return the associated Wall constant
     */
    get_structure_constant(): BuildableStructureConstant {
        return STRUCTURE_WALL;
    }
}
