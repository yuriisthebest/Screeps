import { Search } from "utils/Find";
import { BasicCreepManager } from "./AbstractCreep";

export class Harvester extends BasicCreepManager {

    /**
     * Harvesters have two modes
     *  Fetch (task 0): Go to energy source and get energy
     *  Transfer (task 1): Go to energy
     *
     * @param creep A harvester to control
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
    collect_energy(creep: Creep) {
        // Fetch from in order: [resource(on ground), tombstones, container, sources]
        let energy_resources = [FIND_DROPPED_RESOURCES,
            FIND_TOMBSTONES,
            STRUCTURE_CONTAINER,
            FIND_SOURCES_ACTIVE]
        this.fetch_energy(creep, energy_resources)
    }

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
