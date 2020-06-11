import { ErrorMapper } from "utils/ErrorMapper";
import { HarvesterManager } from "Harvester";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    // console.log(`Current game tick is ${Game.time}`);

    /*
    General layout of main loop
    * Attack / defend actions (TODO)
    * Harvest resources (TODO)
    * Spawn creeps (TODO)
    * Build structures (TODO)
    * Delete dead memory
    */

    // Harvest resources
    let HM = new HarvesterManager(Game);



    // for (const name in Game.creeps) {
    //     let creep = Game.creeps[name];
    //     if (creep.memory.role == 'Harvester') {
            // let target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            // if (target) {
            //     if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(target);
            //     }
            // }
    //     }
    // }


    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
});
