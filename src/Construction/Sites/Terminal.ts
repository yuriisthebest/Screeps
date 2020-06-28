import { Site } from "Construction/Site";
import { Search } from "utils/Find";

export class Terminal extends Site {
    /**
     * Room (controller) should be level 6 for a terminal
     */
    requirements(): boolean {
        if (this.room.controller == undefined) {
            return false;
        }
        return this.room.controller.level >= 6;
    }

    /**
     * Build a terminal when there is none already, and there is an extractor and storage
     */
    should_build(): boolean {
        return (Search.search_structures(this.room, [STRUCTURE_TERMINAL]).length == 0
            && Search.search_construction_site(this.room, [STRUCTURE_TERMINAL]).length == 0
            && Search.search_structures(this.room, [STRUCTURE_EXTRACTOR]).length > 0
            && this.room.storage != undefined);
    }

    /**
     * Build the terminal between room mineral and room storage
     */
    placement(): RoomPosition | RoomPosition[] {
        const mineral = this.room.find(FIND_MINERALS).pop();
        const storage = this.room.storage;
        if (mineral == undefined) {
            console.log(`Tried to place a terminal in room without minerals`);
            return new RoomPosition(0, 0, this.room.name);
        }
        if (storage == undefined) {
            console.log(`Tried to place a terminal in room without storage`);
            return new RoomPosition(0, 0, this.room.name);
        }
        const x = Math.floor((mineral.pos.x + storage.pos.x) / 2);
        const y = Math.floor((mineral.pos.y + storage.pos.y) / 2);
        // TODO: If pos(x, y) is unavailable, circle around for suitable place
        return new RoomPosition(x, y, this.room.name);
    }

    /**
     * Return the associated structure constant of the site
     */
    get_structure_constant() {
        return STRUCTURE_TERMINAL;
    }
}
