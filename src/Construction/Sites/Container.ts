import { Search } from "utils/Find";
import { Site } from "Construction/Site"

export class Container extends Site {

    constructor(room: NonNullRoom) {
        super(room);
    }

    // Create containers when available
    //  # containers < 5
    //  1 container per source and mineral
    should_build(): boolean {
        const containers = (Search.search_structures(this.room, [STRUCTURE_CONTAINER]).length
            + Search.search_construction_site(this.room, [STRUCTURE_CONTAINER]).length)
        if (containers >= 5) { return false; }
        const resources = this.room.find(FIND_SOURCES);
        const harvest_count = this.room.find(FIND_MINERALS).length + resources.length;
        if (harvest_count > containers) { return true; }
        return false;
    }

    /**
     * Place an continer such that it is next to a SOURCE, which has no other containers
     * Pick position near ???
     */
    placement(): RoomPosition {
        const resources = this.room.find(FIND_SOURCES);
        let best_position;
        for (const resource of resources) {
            let has_container = false;
            const res_x = resource.pos.x;
            const res_y = resource.pos.y;
            for (const x of _.range(-1, 2)) {
                for (const y of _.range(-1, 2)) {
                    const pos = new RoomPosition(res_x + x, res_y + y, this.room.name)
                    const things = pos.look()
                    let possible_position = true;
                    for (const thing of things) {
                        if (thing.constructionSite?.structureType == STRUCTURE_CONTAINER
                            || thing.structure?.structureType == STRUCTURE_CONTAINER) {
                            has_container = true;
                            break
                        }
                        if (thing.constructionSite != undefined
                            || thing.structure != undefined
                            || thing.terrain == "wall") { possible_position = false }
                    }
                    // This x, y spot is a potential position, if this source has no container
                    if (possible_position) {
                        best_position = pos;
                    }
                }
            }
            if (has_container) { continue }
            if (best_position == undefined) {
                console.log(`Could not find suitable position for suitable container at source
                            (${resource.pos.x}, ${resource.pos.y}) in room ${this.room.name}`);
            } else {
                return best_position;
            }
        }
        console.log(`Could not place any containers in room ${this.room.name}`);
        return new RoomPosition(0, 0, this.room.name);
    }

    // Return the constant for extension
    get_structure_constant(): BuildableStructureConstant {
        return STRUCTURE_CONTAINER;
    }
}
