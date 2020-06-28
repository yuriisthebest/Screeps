import { BasicCreepManager } from "./BasicCreep";
import { Search } from "utils/Find";
import { Transfer } from "utils/Transfer";
import { CreepType } from "Constants/globals";

export class Collector extends BasicCreepManager {

    /**
     * The collector just moves on a container (next to source) and harvests it
     * Currently only implemented for sources
     *
     * Find containers next to sources without other collectors nearby
     * Send collector to it
     * Harvest source if container has capacity
     */
    manage(creep: Creep): void {
        // Find available container to stand on
        const containers = Search.search_structures(creep.room, [STRUCTURE_CONTAINER],
            (cont: StructureContainer) => {
                const nearby = cont.pos.findClosestByRange(FIND_MY_CREEPS,
                    { filter: (creep: Creep) => creep.memory.role == CreepType.collector && creep.pos.isNearTo(cont.pos) })
                const near_source = cont.pos.findInRange(FIND_SOURCES, 1).length > 0;
                if (nearby == null && near_source) { return true }
                else { return nearby == creep && near_source }
            })

        const container = creep.pos.findClosestByRange(containers);
        if (container == null) {
            console.log(`Collector is in room without containers`);
            return;
        }
        // When the collector is on the container, start harvesting
        if (container.structureType != STRUCTURE_CONTAINER) { return }
        if (creep.pos.isEqualTo(container.pos) && container.store.getFreeCapacity() > 20) {
            const target = creep.pos.findInRange(FIND_SOURCES, 1);
            const code = Transfer.take_energy(creep, target.pop());
            if (code != 0 && code != ERR_NOT_ENOUGH_RESOURCES) {
                console.log(`Collector tried to take energy from source but got code ${code}`)
            }
        } else {
            creep.moveTo(container);
        }
    }
}
