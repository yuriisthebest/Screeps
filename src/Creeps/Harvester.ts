import { Search } from "utils/Find";
import { EnergyCreep } from "./EnergyCreeps";

export class Harvester extends EnergyCreep {
    // Transfer energy to structures
    transfer_energy(creep: Creep) {
        // Transfer in order: [(Extension, spawn), controller]
        let storage: any = creep.pos.findClosestByPath(
            Search.search_structures(creep.room,
                [STRUCTURE_EXTENSION, STRUCTURE_SPAWN],
                this.filter_available_energy_capacity))
        // let storage: any = creep.pos.findClosestByPath(FIND_MY_SPAWNS, { filter: (energy_user: StructureSpawn) => energy_user.store.getFreeCapacity(RESOURCE_ENERGY) != 0 });
        if (storage == null) {
            storage = creep.room.controller;
        }
        if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
    }
}
