import { CreepClasses } from "globals";

export class CreepManager {
    constructor(Game: Game) {
        // Manage every creep every tick
        for (const name in Game.creeps) {
            let creep = Game.creeps[name];
            const manager = this.assign_manager(creep);
            manager.manage(creep)
        }
    }

    /**
     * Assign the corresponding manager to the creep
     *
     * @param creep The creep to manage
     */
    private assign_manager(creep: Creep) {
        return CreepClasses[creep.memory.role];
    }
}
