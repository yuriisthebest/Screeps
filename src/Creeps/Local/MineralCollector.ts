import { CreepType } from "Constants/globals";
import { Search } from "utils/Find";
import { Transfer } from "utils/Transfer";
import { BasicCreepManager } from "../BasicCreep";

export class MineralCollector extends BasicCreepManager {
    /**
     * DIRECT DUPLICATE FROM COLLECTOR (WITH CHANGES FOR MINERALS)
     *
     * The collector just moves on a container (next to mineral) and harvests it
     *
     * Find containers next to minerals without other collectors nearby
     * Send collector to it
     * Harvest mineral if container has capacity, and mineral is harvestable
     */
    manage(creep: Creep): void {
        // Find available container to stand on
        const containers = Search.search_structures(creep.room, [STRUCTURE_CONTAINER],
            (cont: StructureContainer) => {
                const nearby = cont.pos.findClosestByRange(FIND_MY_CREEPS,
                    { filter: (creep: Creep) => creep.memory.role == CreepType.mineralist && creep.pos.isNearTo(cont.pos) })
                const near_source = cont.pos.findInRange(FIND_MINERALS, 1).length > 0;
                if (nearby == null && near_source) { return true }
                else { return nearby == creep && near_source }
            })

        const container = creep.pos.findClosestByRange(containers);
        if (container == null) {
            console.log(`Mineralist is in room without containers`);
            return;
        }
        // When the mineralist is on the container, start harvesting if container has space
        if (container.structureType != STRUCTURE_CONTAINER) { return }
        const extractor = Search.search_structures(creep.room, [STRUCTURE_EXTRACTOR]).pop()
        // Do nothing (harvest) when there is a extractor with a cooldown
        if (extractor instanceof StructureExtractor
            && extractor.cooldown > 0) { return }
        if (creep.pos.isEqualTo(container.pos)
            && container.store.getFreeCapacity() > creep.getActiveBodyparts(WORK)) {
            const target = creep.pos.findInRange(FIND_MINERALS, 1);
            const code = Transfer.take_energy(creep, target.pop());
            if (code != 0 && code != ERR_NOT_ENOUGH_RESOURCES) {
                console.log(`Mineralist tried to take energy from source but got code ${code}`)
            }
        } else {
            creep.moveTo(container);
        }
    }
}
