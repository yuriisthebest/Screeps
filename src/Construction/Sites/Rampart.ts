// Place ramparts on 'gates' of rooms and spawns

import { Site } from "Construction/Site";

/**
 * Ramparts are defensive structures
 *
 * Ramparts should be placed:
 *  On top of spawns
 *  At holes in the wall for entrances
 */
export class Rampart extends Site {
    /**
     * Ramparts can be build from level 3
     */
    requirements(): boolean {
        if (this.room.controller == null) {
            return false;
        }
        return this.room.controller.level >= 4;
    }

    /**
     * Ramparts should be build if ramparts are missing or not yet placed
     *  The ramparts are stored in the memory of each room
     *
     * Do not build ramparts if there are walls < 200.000
     */
    should_build(): boolean {
        if (this.room.memory.ramparts == undefined
            || this.room.memory.gates == undefined) { return true; }
        if (this.room.find(FIND_STRUCTURES,
            {
                filter: (struc: Structure) => struc.structureType == STRUCTURE_WALL
                    && struc.hits < 200000
            }).length > 0) { return false; }
        var placements = this.room.memory.ramparts;
        placements = placements.concat(this.room.memory.gates)
        for (const rampart of placements) {
            const ramp = new RoomPosition(rampart.x, rampart.y, rampart.roomName);
            if (!(ramp.lookFor(LOOK_CONSTRUCTION_SITES).length > 0
                && ramp.lookFor(LOOK_CONSTRUCTION_SITES)[0].structureType == STRUCTURE_RAMPART)
                && !(ramp.lookFor(LOOK_STRUCTURES).length > 0
                    && ramp.lookFor(LOOK_STRUCTURES).find(i => i.structureType == STRUCTURE_RAMPART))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return the positions of all ramparts that yet have to be build
     *  If a wall exists on that place, remove it
     */
    placement(): RoomPosition | RoomPosition[] {
        // Find the places ramparts should be build (except for gates)
        if (this.room.memory.ramparts == undefined) {
            return this.assign_ramparts();
        } else {
            let broken_ramps = [];
            var ramps = this.room.memory.ramparts;
            ramps = ramps.concat(this.room.memory.gates)
            for (const ramp_data of ramps) {
                const ramp = new RoomPosition(ramp_data.x, ramp_data.y, ramp_data.roomName);
                if ((ramp.lookFor(LOOK_CONSTRUCTION_SITES).length > 0
                    && ramp.lookFor(LOOK_CONSTRUCTION_SITES)[0].structureType == STRUCTURE_RAMPART)
                    || (ramp.lookFor(LOOK_STRUCTURES).length > 0
                        && ramp.lookFor(LOOK_STRUCTURES).find(i => i.structureType == STRUCTURE_RAMPART))) {
                    continue;
                }
                // If a wall has been placed on this spot, destroy it
                const wall = ramp.lookFor(LOOK_STRUCTURES).find(i => i.structureType == STRUCTURE_WALL)
                if (wall != undefined) {
                    wall.destroy();
                }
                broken_ramps.push(ramp);
            }
            return broken_ramps;
        }
    }

    /**
     * Find all places to put ramparts on (except gates, they are done with walls)
     *  Add these places to the ramparts memory and return them
     */
    assign_ramparts(): RoomPosition[] {
        var spawn_ramparts: RoomPosition[] = []
        for (const spawner in Game.spawns) {
            const spawn = Game.spawns[spawner];
            if (spawn.room.name == this.room.name) {
                spawn_ramparts.push(spawn.pos);
            }
        }
        this.room.memory.ramparts = spawn_ramparts;
        return spawn_ramparts;
    }

    /**
     * Return the associated structure constant of the site
     */
    get_structure_constant() {
        return STRUCTURE_RAMPART;
    }
}
