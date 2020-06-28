import { Search } from "utils/Find";
import { EnergyCreep } from "./EnergyCreeps";

export class Transporter extends EnergyCreep {
    /**
     * Transporters should go to containers, pickup energy
     *  then give energy to extensions, towers and storage
     *
     * Transporters are EnergyCreeps, but with different pickup values (collect energy)
     *
     * If the spawners and extensions are empty, use storage to fill them
     *
     * @param creep Creep without energy
     */
    collect_energy(creep: Creep) {
        let energy_resources;
        if (creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
            energy_resources = [FIND_DROPPED_RESOURCES, STRUCTURE_CONTAINER, STRUCTURE_STORAGE];
        } else {
            energy_resources = [FIND_DROPPED_RESOURCES, STRUCTURE_CONTAINER];
        }
        this.fetch_energy(creep, energy_resources)
    }

    /**
     * Given energy to extensions, towers, terminal, storage
     *
     * @param creep Creep with energy
     */
    transfer_energy(creep: Creep) {
        let storage: any = creep.pos.findClosestByPath(
            Search.search_structures(creep.room,
                [STRUCTURE_EXTENSION, STRUCTURE_SPAWN],
                this.filter_available_energy_capacity))
        // If no empty extensions / spawns have been found, check for towers
        if (storage == null) {
            storage = creep.pos.findClosestByPath(
                Search.search_structures(creep.room,
                    [STRUCTURE_TOWER],
                    this.filter_available_energy_capacity));
        }
        // when there are no towers, go to the terminal if it has less than 10.000 energy
        if (storage == null && creep.room.terminal != undefined
            && creep.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 10000) {
            storage = creep.room.terminal;
        }
        // when there is no terminal, go to the storage
        if (storage == null) {
            storage = creep.pos.findClosestByPath(
                Search.search_structures(creep.room,
                    [STRUCTURE_STORAGE],
                    this.filter_available_energy_capacity))
        }
        if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
    }
}
