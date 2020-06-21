import { ErrorMapper } from "utils/ErrorMapper";
import { CreepManager } from "Economy";
import { SpawnManager } from "Spawn";
import { BasicConstruction } from "Construction/Construction";
import { CombatManager } from "CombatManager";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

    /*
    General layout of main loop
    * Attack / defend actions (TODO)
    * Harvest resources (TODO)
    * Spawn creeps (TODO)
    * Build structures (TODO)
    * Delete dead memory
    * Create pixels
    */

    // Manage Millitia
    const CM = new CombatManager(Game);
    CM.manage_towers();

    // Harvest resources
    const HM = new CreepManager(Game);

    // Spawning creeps, check every 21 ticks
    if (Game.time % 21 == 0) {
        let manager = new SpawnManager()
        for (const spawner in Game.spawns) {
            let spawn = Game.spawns[spawner]
            manager.manage(spawn);
        }
    }

    // Create economical construction sites
    // Check every 113 ticks
    for (const room_id in Game.rooms) {
        const room = Game.rooms[room_id];
        BasicConstruction.manage_construction(room);
    }

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
    if (Game.cpu.getUsed() > 10) {
        console.log(`CPU usage: ${Game.cpu.getUsed()}. Bucket: ${Game.cpu.bucket}`)
    }

    if (Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
    }
});
