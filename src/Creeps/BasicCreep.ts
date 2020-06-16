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
        return struct.store.getUsedCapacity(RESOURCE_ENERGY) > 200;
    }

    /**
     * Order a creep to get energy from a place
     *
     * @param creep The creep which is ordered
     * @param energy_resources A strucutre or source containing energy
     */
    protected fetch_energy(creep: Creep,
        energy_resources: (StructureConstant | FindConstant)[]) {
        // Check for each given structure if there are places with energy
        //  If so, get that energy and stop looking
        let target = null;
        for (const resource_location of energy_resources) {
            // Find constants (used for sources, tombstones, ruins) are numbers
            if (typeof resource_location == "number") {
                target = creep.pos.findClosestByPath(resource_location,
                    { filter: (struc) => this.filter_available_energy });
            } else {
                // A strucutres (such as containers) have no FIND constant
                target = creep.pos.findClosestByPath(
                    Search.search_structures(creep.room,
                        [resource_location],
                        this.filter_available_energy));
            }
            // Tranfer from target or Move to target
            if (this.gather_move(creep, target)) {
                // If a target was found, stop looking for other targets
                break;
            }
        }
    }

    /**
     * Order a creep to take energy from a target, or move to it if out of reach
     *  Return false if the target is null
     *
     * @param creep Creep to order
     * @param target Target to take energy from
     */
    protected gather_move(creep: Creep, target: any): boolean {
        // Tranfer from target or Move to target
        if (target) {
            if (Transfer.take_energy(creep, target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            // Creep is gathering energy, stop looking for other sources
            return true;
        }
        return false;
    }
}
