import { BasicCreepManager } from "./BasicCreep";

export class Repair extends BasicCreepManager {
    /**
     * Repairers go and get energy to go and fix structures
     *
     * @param creep Repairer to order
     */
    manage(creep: Creep) {
        if (creep.memory.task == 0 || creep.memory.task == null) {
            this.collect_energy(creep);
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.task = 1;
                creep.say("Delivering");
            }
        } else if (creep.memory.task == 1) {
            this.transfer_energy(creep);
            // If all energy is given away, go fetch
            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.task = 0;
                creep.say("Fetching");
            }
        }
    }

    // Collect / fetch energy
    // Fetch from in order: [resource(on ground), tombstones, container, sources]
    collect_energy(creep: Creep) {
        let energy_resources = [FIND_DROPPED_RESOURCES,
            FIND_TOMBSTONES,
            // FIND_RUINS,
            STRUCTURE_CONTAINER,
            FIND_SOURCES_ACTIVE]
        this.fetch_energy(creep, energy_resources)
    }

    transfer_energy(creep: Creep) {
        const broken_structures = creep.room.find(FIND_STRUCTURES,
            { filter: (struc: Structure) => struc.hits != struc.hitsMax && struc.structureType != STRUCTURE_WALL });
        const target = broken_structures.pop();
        if (target == undefined) { return }
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}
