// All implemented creep types
import { BasicCreepManager } from "Creeps/AbstractCreep";
import { Harvester } from "Creeps/Harvester";
import { Builder } from "Creeps/Builder";

export enum CreepType {
    harvester = 0,
    builder = 1,
    collector = 2,
}

export var CreepClasses: { [Key: number]: BasicCreepManager } = {};
CreepClasses[CreepType.harvester] = new Harvester();
CreepClasses[CreepType.builder] = new Builder();
