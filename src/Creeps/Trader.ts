import { BasicCreepManager } from "./BasicCreep";

export class Trader extends BasicCreepManager {
    /**
     * A trader has 2 tasks
     *  get minerals
     *  give minerals to terminal
     *
     * The trader is similar to energy creeps but too different for inheritance
     *
     * @param creep The trader to manage
     */
    manage(creep: Creep) {
        if (creep.memory.task == 0 || creep.memory.task == null) {
            this.collect_minerals(creep);
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.task = 1;
                creep.say("Delivering minerals");
            }
        } else if (creep.memory.task == 1) {
            this.transfer_minerals(creep);
            // If all minerals are given away, go fetch
            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.task = 0;
                creep.say("Fetching minerals");
            }
        }
    }

    // Collect minerals
    collect_minerals(creep: Creep) {
        let storage = [STRUCTURE_STORAGE, STRUCTURE_CONTAINER]
        this.fetch_minerals(creep, storage)
    }

    // Go to terminal and give minerals
    transfer_minerals(creep: Creep) {
        const terminal = creep.room.terminal;
        if (terminal == undefined) {
            console.log(`Trader is in room ${creep.room.name} without terminal`)
            return;
        }
        for (const mineral of [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM,
            RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_OXYGEN,
            RESOURCE_HYDROGEN, RESOURCE_CATALYST]) {
            if (creep.transfer(terminal, mineral) == ERR_NOT_IN_RANGE) {
                creep.moveTo(terminal);
            }
        }
    }
}
