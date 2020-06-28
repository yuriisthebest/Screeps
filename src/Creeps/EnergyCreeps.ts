import { BasicCreepManager } from "./BasicCreep";

export class EnergyCreep extends BasicCreepManager {
    /**
     * EnergyCreeps have two modes
     *  Fetch (task 0): Go to energy source and get energy
     *  Transfer (task 1): Spend energy
     *
     * Also, creeps that are almost dead should renew themselves
     *
     * @param creep A Creep to control
     */
    manage(creep: Creep) {
        // CODE TO RENEW CREEPS
        // if (creep.ticksToLive != undefined && creep.ticksToLive < 100) {
        //     creep.memory.dying = true;
        // } else if (creep.ticksToLive != undefined && creep.ticksToLive > 1200) {
        //     creep.memory.dying = false;
        // }
        // if (creep.memory.dying) {
        //     const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
        //     if (spawn != undefined) {
        //         if (spawn.renewCreep(creep) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(spawn);
        //         }
        //     }
        // } Don't forget to add the else clause for other tasks when uncommenting
        if (creep.memory.task == 0 || creep.memory.task == null) {
            this.collect_energy(creep);
            if (creep.store.getFreeCapacity() == 0) {
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
