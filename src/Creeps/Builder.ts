import { BasicCreepManager } from "./AbstractCreep";

export class Builder extends BasicCreepManager {

    /**
     * Get energy and build in a specific order, TBD
     *
     * @param creep A builder to control
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
            STRUCTURE_CONTAINER,
            FIND_SOURCES_ACTIVE]
        this.fetch_energy(creep, energy_resources)
    }

    // Transfer energy to structures
    transfer_energy(creep: Creep) {
        // Give energy to construction sites
        const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        // Find site closest to finish
        let progressed_site = sites.pop();
        if (progressed_site == undefined) { }
        else {
            let lowest_work = progressed_site.progressTotal - progressed_site.progress;
            for (const site of sites) {
                const work_left = site.progressTotal - site.progress;
                if (lowest_work == undefined || work_left < lowest_work) {
                    lowest_work = work_left;
                    progressed_site = site;
                }
            }
            if (progressed_site == undefined) { }
            else if (creep.build(progressed_site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(progressed_site);
            }
        }
    }
}
