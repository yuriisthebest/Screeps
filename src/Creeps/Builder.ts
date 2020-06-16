import { EnergyCreep } from "./EnergyCreeps";

export class Builder extends EnergyCreep {
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
            if (lowest_work == 0) {
                const site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                if (site != null) { progressed_site = site; }
            }
            if (progressed_site == undefined) { }
            else if (creep.build(progressed_site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(progressed_site);
            }
        }
    }
}
