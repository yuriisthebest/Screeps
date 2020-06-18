import { EnergyCreep } from "./EnergyCreeps";

export class Upgrader extends EnergyCreep {
    /**
     * Upgrader is an energy creep takes from storage and puts in controller
     */
    collect_energy(creep: Creep) {
        let energy_resources = [STRUCTURE_STORAGE]
        this.fetch_energy(creep, energy_resources)
    }

    /**
     * Give energy to controller
     */
    transfer_energy(creep: Creep) {
        const controller: StructureController | undefined = creep.room.controller;
        if (controller == undefined) {
            console.log(`${this.constructor.name} is in room without controller`)
            return
        }
        if (creep.transfer(controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
    }
}
