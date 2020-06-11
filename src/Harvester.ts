export class HarvesterManager {
    harvesters: Creep[] = new Array();

    constructor(Game: Game) {
        /*
        Harvesters have two modes
        * Fetch (task 0): Go to energy source and get energy
        * Transfer (task 1): Go to energy
        */
        for (const name in Game.creeps) {
            let creep = Game.creeps[name];
            if (creep.memory.role == 'Harvester') {
                // If fetch
                if (creep.memory.task == 0 || creep.memory.task == null) {
                    let target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                    if (target) {
                        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    // If the energy buffer is full, go transfer
                    if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                        creep.memory.task = 1;
                        creep.say("Delivering");
                    }

                    // If transfer
                } else if (creep.memory.task == 1) {
                    let storage: any = creep.pos.findClosestByRange(FIND_MY_SPAWNS, { filter: (energy_user: StructureSpawn) => energy_user.store.getFreeCapacity(RESOURCE_ENERGY) != 0 });
                    if (storage == null) {
                        storage = creep.room.controller;
                    }
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                    // for (const structure of [FIND_MY_SPAWNS, creep.room.controller]) {
                    //     let storage: Structure | null | undefined;
                    //     if (structure instanceof Number) {
                    //         storage = creep.pos.findClosestByRange(FIND_MY_SPAWNS, { filter: (energy_user: StructureSpawn) => energy_user.store.getFreeCapacity(RESOURCE_ENERGY) != 0 });
                    //     } else {
                    //         storage = creep.room.controller;
                    //     }
                    //     if (storage != null && creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    //         creep.moveTo(storage);
                    //     }
                    // }
                    // If all energy is given away, go fetch
                    if (creep.store[RESOURCE_ENERGY] == 0) {
                        creep.memory.task = 0;
                        creep.say("Fetching");
                    }
                }
            }
        }

    }

    send_to_sources(): void {

    }
}
