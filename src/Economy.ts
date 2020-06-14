import { CreepType } from "globals";
import { Search } from "utils/Find";
import { Transfer } from "utils/Take";

export class EconomyManager {

    constructor(Game: Game) {
        /*
        Harvesters have two modes
        * Fetch (task 0): Go to energy source and get energy
        * Transfer (task 1): Go to energy
        */
        for (const name in Game.creeps) {
            let creep = Game.creeps[name];
            switch (creep.memory.role) {
                case CreepType.harvester: {
                    // If fetch
                    // Fetch from in order: [resource(on ground), tombstones, container, sources]
                    if (creep.memory.task == 0 || creep.memory.task == null) {
                        let energy_resources = [FIND_DROPPED_RESOURCES, FIND_TOMBSTONES, STRUCTURE_CONTAINER, FIND_SOURCES_ACTIVE]
                        let target = null;
                        for (const resource_location of energy_resources) {
                            if (typeof resource_location == "number") {
                                target = creep.pos.findClosestByPath(resource_location);
                            } else {
                                target = creep.pos.findClosestByPath(Search.search_structures(creep.room, [STRUCTURE_CONTAINER]));
                            }
                            if (target) {
                                if (Transfer.take_energy(creep, target) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target);
                                }
                                // Creep is gathering energy, stop looking for other sources
                                break;
                            }
                        }
                        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                            creep.memory.task = 1;
                            creep.say("Delivering");
                        }

                        // If transfer
                        // Transfer in order: [(Extension, spawn), controller]
                    } else if (creep.memory.task == 1) {
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
                        // If all energy is given away, go fetch
                        if (creep.store[RESOURCE_ENERGY] == 0) {
                            creep.memory.task = 0;
                            creep.say("Fetching");
                        }
                    }
                    break;
                }
                case CreepType.builder: {
                    // Get energy and build in a spefic order, TBD
                    // If fetch (SAME CODE AS HARVESTER)
                    // Fetch from in order: [resource(on ground), tombstones, container, sources]
                    if (creep.memory.task == 0 || creep.memory.task == null) {
                        let energy_resources = [FIND_DROPPED_RESOURCES, FIND_TOMBSTONES, STRUCTURE_CONTAINER, FIND_SOURCES_ACTIVE]
                        let target = null;
                        for (const resource_location of energy_resources) {
                            if (typeof resource_location == "number") {
                                target = creep.pos.findClosestByPath(resource_location);
                            } else {
                                // A container is not a number
                                target = creep.pos.findClosestByPath(Search.search_structures(creep.room, [STRUCTURE_CONTAINER]));
                            }
                            if (target) {
                                if (Transfer.take_energy(creep, target) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target);
                                }
                                // Creep is gathering energy, stop looking for other sources
                                break;
                            }
                        }
                        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                            creep.memory.task = 1;
                            creep.say("Delivering");
                        }
                    } else if (creep.memory.task == 1) {
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
                        // If all energy is given away, go fetch
                        if (creep.store[RESOURCE_ENERGY] == 0) {
                            creep.memory.task = 0;
                            creep.say("Fetching");
                        }
                    }
                    break;
                }
            }
        }
    }

    private filter_available_energy_capacity(struct: any): boolean {
        return struct.store.getFreeCapacity(RESOURCE_ENERGY) != 0;
    }
}
