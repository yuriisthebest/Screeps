import { BodyPartsAdditional, BodyPartsRequired } from "Constants/BodyPartPreferences";
import { CreepType } from "Constants/globals";
import { Search } from "utils/Find";

export class SpawnManager {

    manage(spawner: StructureSpawn): void {
        /*
        Check if a critical creep is required
        Check if the spawner has enough energy
        Determine new creep
        Spawn new creep
        */
        // If the spawner is already spawning something, skip it
        if (spawner.spawning != null) { }
        // else if (spawner.memory.timeout > 0) { spawner.memory.timeout = - 1 }
        else {
            // Find available extensions
            let extensions: AnyStructure[] = Search.search_structures(spawner.room, [STRUCTURE_EXTENSION])
            // Calculate all available energy for this spawner
            let available_energy = spawner.store.getUsedCapacity(RESOURCE_ENERGY);
            let max_available_energy = spawner.store.getCapacity(RESOURCE_ENERGY);
            for (const extension of extensions) {
                // If statement for code debugging puposes
                if (extension instanceof StructureExtension) {
                    available_energy += extension.store.getUsedCapacity(RESOURCE_ENERGY);
                    max_available_energy += extension.store.getCapacity(RESOURCE_ENERGY);
                }
            }
            // Critical creeps:
            //  Harvester: is critical if there are no creeps
            //      always keep 3 when below controller level 4
            if ((spawner.room.find(FIND_MY_CREEPS).length < 4
                || Search.search_creeps(spawner.room, [CreepType.harvester]).length < 3)
                && available_energy > 200
                && (spawner.room.controller?.level == undefined
                    || spawner.room.controller?.level < 4
                    || spawner.room.find(FIND_MY_CREEPS).length < 4)) {
                this.spawn(spawner,
                    this.determine_body(available_energy, CreepType.harvester),
                    'Harvester', { role: CreepType.harvester, task: 1, dying: false });
            }
            // Spawn creep when spawner and extensions are full
            else if (available_energy == max_available_energy) {
                let role = this.determine_role(spawner, available_energy);
                if (role < 0) return;
                let body = this.determine_body(available_energy, role);
                this.spawn(spawner, body, `${CreepType[role]}`, { role: role, dying: false });
            } else {
                // Put spawner on timeout if it didn't spawn anything
                // spawner.memory.timeout = 10;
            }
        }
    }

    spawn(spawner: StructureSpawn, components: BodyPartConstant[],
        name: string, intial_memory: CreepMemory): void {
        /*
        Execute the spawn command and give spawner proper timeout
        */
        console.log(`Spawning ${name}`)
        spawner.spawnCreep(components,
            name + Math.floor(Math.random() * 100000),
            { memory: intial_memory });
    }

    /**
     * Determine which creep to spawn
     *
     * === Spawnable creeps ===
     * Harvester - Never
     * Builder - +1 construction sites and <3 builders
     * Collector - +1 available containers (requires 550 energy)
     * Repairer - Whenever there are objects that can break and <1 repairers
     * Transporters - when at level 4 and <2 trans
     * Upgrader - When there is a storage and <1 upgraders
     */
    determine_role(spawner: StructureSpawn, energy: number): CreepType {
        // Spawn collector
        if (Search.search_creeps(spawner.room, [CreepType.collector]).length
            < Search.search_structures(spawner.room, [STRUCTURE_CONTAINER]).length) {
            return CreepType.collector;
        }
        // Spawn transporter
        if (spawner.room.controller?.level != undefined && spawner.room.controller.level >= 4
            && Search.search_creeps(spawner.room, [CreepType.transporter]).length < 2) {
            return CreepType.transporter;
        }
        // Spawn repairer
        if (Search.search_creeps(spawner.room, [CreepType.repairer]).length < 1
            && Search.search_structures(spawner.room, [STRUCTURE_CONTAINER,
                STRUCTURE_ROAD]).length > 0) {
            return CreepType.repairer;
        }
        // Spawn builder
        if (spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0
            && Search.search_creeps(spawner.room, [CreepType.builder]).length < 1) {
            return CreepType.builder;
        }
        // Spawn upgrader
        if (spawner.room.storage != undefined
            && Search.search_creeps(spawner.room, [CreepType.upgrader]).length < 1) {
            return CreepType.upgrader;
        }

        // No proper role to spawn found
        return -1;
    }

    /**
     * Create a body for the creep to spawn
     *
     * @param available_energy Amount of energy available to create creep from
     * @param creep_type The role of the creep
     */
    determine_body(available_energy: number, creep_type: CreepType): BodyPartConstant[] {
        // Mandatory body parts
        let body: BodyPartConstant[] = BodyPartsRequired[creep_type];
        const additional_parts = BodyPartsAdditional[creep_type];
        // Remove the required energy cost from available energy
        for (const bodypart of body) { available_energy -= BODYPART_COST[bodypart]; }
        let i = 0;
        // Add bodyparts to body in sequence of preferred body shape
        while (available_energy >= BODYPART_COST[additional_parts[i]]
            && body.length < this.max_parts(creep_type)) {
            body.push(additional_parts[i]);
            available_energy -= BODYPART_COST[additional_parts[i]];
            i = (i + 1) % additional_parts.length;
        }
        return body;
    }

    /**
     * Return the maximum amount of parts allocated to this type
     */
    max_parts(creep_type: CreepType): number {
        switch (creep_type) {
            // Harvesters should not be too large
            case (CreepType.harvester):
                return 12;
            // Collectors should have a max bodyparts of 1 MOVE and 7 WORK
            case (CreepType.collector):
                return 8;
            // Transporters transport 100 per 3 parts
            case (CreepType.transporter):
                return 18; // 600
            // Upgraders should not use entire economy for upgrades
            case (CreepType.upgrader):
                return 19;
            default:
                return 50;
        }
    }
}
