import { BasicCreepManager } from "./BasicCreep";

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
            FIND_RUINS,
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
            let lowest_work = progressed_site.progress / progressed_site.progressTotal;
            for (const site of sites) {
                const work_done = site.progress / site.progressTotal;
                if (work_done > lowest_work) {
                    lowest_work = work_done;
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
