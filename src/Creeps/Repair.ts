import { EnergyCreep } from "./EnergyCreeps";

export class Repair extends EnergyCreep {

    /**
     * Repair all structures on the map
     *  Only repair walls placed by me (locations must be in memory)
     *
     * First repair structures, then repair ramparts and walls in increments
     *  Repair such structures as: Closest first, repair some loads, then the next
     *
     * @param creep The creep
     */
    transfer_energy(creep: Creep) {
        // Find all broken structures that aren't walls or ramparts
        const broken_structures = creep.room.find(FIND_STRUCTURES,
            {
                filter: (struc: Structure) => struc.hits != struc.hitsMax
                    && struc.structureType != STRUCTURE_WALL
                    && struc.structureType != STRUCTURE_RAMPART
            });
        // First repair any broken structure (repair in binned fashion)
        let target;
        let most_broken = Number.MAX_SAFE_INTEGER; // Anything >= 1
        for (const struc of broken_structures) {
            if (~~((struc.hits / struc.hitsMax) * 10) < most_broken) {
                most_broken = ~~((struc.hits / struc.hitsMax) * 10);
                target = struc;
            }
        }
        // Normal structures don't have damage
        // Repair walls and ramparts
        // Note: target = undefined, most_broken = MAX
        const carry_cap = creep.store.getCapacity() * 0.5 * 100;
        if (target == undefined) {
            // Find ramparts and wall that are in the memory
            const protectives = creep.room.find(FIND_STRUCTURES, {
                filter: (struc: Structure) => struc.hits != struc.hitsMax
                    && ((struc.structureType == STRUCTURE_RAMPART
                        && (struc.room.memory.gates.find(i => i.x == struc.pos.x
                            && i.y == struc.pos.y)
                            || struc.room.memory.ramparts.find(i => i.x == struc.pos.x
                                && i.y == struc.pos.y)))
                        || (struc.structureType == STRUCTURE_WALL
                            && struc.room.memory.walls.find(i => i.x == struc.pos.x
                                && i.y == struc.pos.y)))
            })
            // console.log(protectives)
            // Bin the damage values, so creeps don't just repair once and move
            // Bin such that objects within (0.5-10)*carry capacity*energy have same value.
            // TODO: could use 0.95 * most_broken to avoid weird behavior
            for (const struc of protectives) {
                if (~~(struc.hits / carry_cap) < most_broken - 1) {
                    most_broken = ~~(struc.hits / carry_cap)
                    target = struc;
                }
            }
        }
        if (target == undefined) {
            creep.moveTo(new RoomPosition(25, 25, creep.room.name))
            return
        }
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { maxRooms: 1 });
        }
    }
}
