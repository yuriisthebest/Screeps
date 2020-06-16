import { EnergyCreep } from "./EnergyCreeps";

export class Repair extends EnergyCreep {

    // Repair all non-wall broken strucutres with energy
    transfer_energy(creep: Creep) {
        const broken_structures = creep.room.find(FIND_STRUCTURES,
            {
                filter: (struc: Structure) => struc.hits != struc.hitsMax
                    && struc.structureType != STRUCTURE_WALL
            });
        // const target = broken_structures.pop();
        let target;
        let most_broken = 2; // Anything >= 1
        for (const struc of broken_structures) {
            if (struc.hits / struc.hitsMax < most_broken) {
                most_broken = struc.hits / struc.hitsMax;
                target = struc;
            }
        }
        if (target == undefined) {
            creep.moveTo(new RoomPosition(25, 25, creep.room.name))
            return
        }
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}
