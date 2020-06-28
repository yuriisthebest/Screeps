import { Site } from "Construction/Site";
import { Search } from "utils/Find";

export class Extractor extends Site {
    /**
     * Controller has to be level 6 or higher
     */
    requirements(): boolean {
        if (this.room.controller == undefined) {
            // This room does not have a controller, thus no level 6
            return false;
        }
        return this.room.controller.level >= 6;
    }

    /**
     * Build a extractor if there is not already one
     */
    should_build(): boolean {
        const extractors = (Search.search_structures(this.room, [STRUCTURE_EXTRACTOR]).length
            + Search.search_construction_site(this.room, [STRUCTURE_EXTRACTOR]).length)
        return extractors == 0;
    }

    /**
     * Return the position of the mineral in the room to place the extractor on
     */
    placement(): RoomPosition | RoomPosition[] {
        const mineral = this.room.find(FIND_MINERALS);
        const location = mineral.pop()?.pos;
        if (location != undefined) {
            return location;
        }
        console.log(`This room (${this.room.name}) does not contain a mineral`);
        return new RoomPosition(0, 0, this.room.name);
    }

    /**
     * Return the associated structure constant of the site
     */
    get_structure_constant() {
        return STRUCTURE_EXTRACTOR;
    }
}
