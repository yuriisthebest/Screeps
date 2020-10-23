import { Extension } from "./Sites/Extension"
import { Container } from "./Sites/Container";
import { Road } from "./Sites/Road";
import { Storage } from "./Sites/Storage";
import { Tower } from "./Sites/Tower";
import { Extractor } from "./Sites/Extractor";
import { Terminal } from "./Sites/Terminal";
import { Wall } from "./Sites/Wall";
import { Flag_color } from "Constants/globals";

export class BasicConstruction {
    /**
     * Manage construction per owned room
     * TODO: Have different rooms, such as main and outposts
     *
     * === Constructions ===
     * Extensions - Always until cap
     *
     * @param room Room to construct in
     */
    static manage_construction(room: Room) {
        if (room.controller == null) { }
        // Don't construct more sites when there already exists some
        else if (!room.controller.my) { }
        else if (room.memory.construction_timeout > 0) { room.memory.construction_timeout -= 1 }
        else {
            // The room can check once to build something before going on cooldown
            room.memory.construction_timeout = ((room.name == 'sim') ? 10 : 113);
            // All possible sites
            const sites = [new Extension(room),
            new Container(room),
            new Storage(room),
            new Tower(room),
            new Extractor(room),
            new Terminal(room),
            new Wall(room)]
            for (const site of sites) {
                if (site.requirements() && site.should_build()) {
                    let position = site.placement();
                    // placement either returns a single position or multiple positions
                    if (position instanceof RoomPosition) {
                        this.construct(room, position, site.get_structure_constant());
                    } else {
                        for (const pos of position) {
                            // pos.createFlag(`Construction site ${Math.floor(Math.random() * 100000)}`, Flag_color['debug'], Flag_color['debug'])
                            this.construct(room, pos, site.get_structure_constant());
                        }
                    }
                }
            }
        }
    }

    static construct(room: Room, position: RoomPosition, structure: StructureConstant): void {
        const code = room.createConstructionSite(position, structure);
        if (code == 0) { console.log(`Created ${structure} site at (${position.x}, ${position.y}, ${room.name})`) }
        else { console.log(`Failed to create ${structure} construction site: code ${code}\n* Tried to place site at (${position.x}, ${position.y})`) }
    }
}
