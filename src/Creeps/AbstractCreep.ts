import { Search } from "utils/Find";
import { Transfer } from "utils/Transfer";

/**
 * Abstract class that mimic the Creep class
 * Allows for creep differentiation
 */
export class BasicCreepManager {
    /**
     * Orders a creep to do its expected behavior
     *  Must be implemented by child classes
     *
     * @param creep Creep to order
     */
    manage(creep: Creep): void {
        console.log(`"manage_creep()" is not implemented for class: ${this.constructor.name}`);
    }

    /**
     * Filter function to be used in Search, find or look tasks
     *  Returns true when the structure has capacity, aka is not full
     *
     * @param struct The structure to check whether it has energy
     */
    protected filter_available_energy_capacity(struct: any): boolean {
        return struct.store.getFreeCapacity(RESOURCE_ENERGY) != 0;
    }

    /**
     * Filter function to be used in Search, find or look tasks
     *  Returns true when the structure has energy, aka is not empty
     *
     * @param struct The structure to check whether it has energy
     */
    protected filter_available_energy(struct: any): boolean {
        return struct.store.getUsedCapacity(RESOURCE_ENERGY) != 0;
    }

    /**
     * Order a creep to get energy from a place
     *
     * @param creep The creep which is ordered
     * @param energy_resources A
     */
    protected fetch_energy(creep: Creep,
        energy_resources: (StructureConstant | FindConstant)[]) {
        // Check for each given structure if there are places with energy
        //  If so, get that energy and stop looking
        let target = null;
        for (const resource_location of energy_resources) {
            if (typeof resource_location == "number") {
                target = creep.pos.findClosestByPath(resource_location,
                    { filter: (struc) => this.filter_available_energy });
            } else {
                // A container is not a number
                target = creep.pos.findClosestByPath(
                    Search.search_structures(creep.room,
                        [STRUCTURE_CONTAINER],
                        this.filter_available_energy));
            }
            if (target) {
                if (Transfer.take_energy(creep, target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                // Creep is gathering energy, stop looking for other sources
                break;
            }
        }
    }
}
