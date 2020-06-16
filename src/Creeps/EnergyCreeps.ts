import { BasicCreepManager } from "./BasicCreep";

export class EnergyCreep extends BasicCreepManager {
    /**
     * EnergyCreeps have two modes
     *  Fetch (task 0): Go to energy source and get energy
     *  Transfer (task 1): Spend energy
     *
     * @param creep A Creep to control
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
            // FIND_TOMBSTONES,
            // FIND_RUINS,
            STRUCTURE_STORAGE,
            STRUCTURE_CONTAINER,
            FIND_SOURCES_ACTIVE]
        this.fetch_energy(creep, energy_resources)
    }

    transfer_energy(creep: Creep) {
        console.log(`tranfer_energy() is not implemented for EnergyCreep with role ${this.constructor.name}`)
    }
}
