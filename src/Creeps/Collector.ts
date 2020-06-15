import { BasicCreepManager } from "./BasicCreep";
import { Search } from "utils/Find";
import { Transfer } from "utils/Transfer";
import { CreepType } from "Constants/globals";

export class Collector extends BasicCreepManager {

    /**
     * The collector just moves on a container (next to source / deposit) and harvests it
     * Currently only implemented for sources
     */
    manage(creep: Creep): void {
        // Find available container to stand on
        const containers = Search.search_structures(creep.room, [STRUCTURE_CONTAINER],
            (cont: StructureContainer) => {
                const nearby = cont.pos.findClosestByRange(FIND_CREEPS,
                    { filter: (creep: Creep) => creep.memory.role == CreepType.collector && creep.pos.isNearTo(cont.pos) })
                if (nearby == null) { return true }
                else { return nearby == creep }

                // const all_collectors = Search.search_creeps(cont.room, [CreepType.collector])
                // if (all_collectors.length > 0) {
                //     return cont.pos.findClosestByRange(FIND_CREEPS,
                //         {filter: (creep: Creep) => })
                // }
                // return false;
            })

        const container = creep.pos.findClosestByRange(containers);
        // console.log(`test`)
        if (container == null) {
            console.log(`Collector is in room without containers`);
            return;
        }
        // When the collector is on the container, start harvesting
        if (creep.pos.isEqualTo(container.pos)) {
            const target = creep.pos.findInRange(FIND_SOURCES, 1);
            const code = Transfer.take_energy(creep, target.pop());
            if (code != 0) {
                console.log(`Collector tried to take energy from source but got code ${code}`)
            }
        } else {
            creep.moveTo(container);
        }
    }
}
