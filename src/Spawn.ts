import { BodyPartsAdditional, BodyPartsRequired } from "BodyPartPreferences";
import { CreepType } from "globals";
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
            if (spawner.room.find(FIND_MY_CREEPS).length < 5
                && available_energy > 200) {
                this.spawn(spawner,
                    this.determine_body(available_energy, CreepType.harvester),
                    'Harvester', { role: CreepType.harvester, task: 1 });
            }
            // Spawn creep when spawner has +90% energy
            else if (available_energy / max_available_energy > 0.90) {
                let role = this.determine_role(spawner);
                if (role < 0) return;
                let body = this.determine_body(available_energy, role);
                this.spawn(spawner, body, `${CreepType[role]}`, { role: role });
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
     * Builder - +1 construction sites and <2 builders
     */
    determine_role(spawner: StructureSpawn): CreepType {
        // Spawn builder
        if (spawner.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0
            && Search.search_creeps(spawner.room, [CreepType.builder]).length < 2) {
            return CreepType.builder;
        } else {
            // No proper role to spawn found
            return -1;
        }
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
        while (available_energy >= BODYPART_COST[additional_parts[i]] && body.length < 50) {
            body.push(additional_parts[i]);
            available_energy -= BODYPART_COST[additional_parts[i]];
            i = (i + 1) % additional_parts.length;
        }
        return body;
    }
}
