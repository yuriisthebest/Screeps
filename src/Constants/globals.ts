// All implemented creep types
import { BasicCreepManager } from "Creeps/BasicCreep";
import { Harvester } from "Creeps/Harvester";
import { Builder } from "Creeps/Builder";
import { Collector } from "Creeps/Collector";
import { Repair } from "Creeps/Repair";

export enum CreepType {
    harvester = 0,
    builder = 1,
    collector = 2,
    repairer = 3,
}

export var CreepClasses: { [Key: number]: BasicCreepManager } = {};
CreepClasses[CreepType.harvester] = new Harvester();
CreepClasses[CreepType.builder] = new Builder();
CreepClasses[CreepType.collector] = new Collector();
CreepClasses[CreepType.repairer] = new Repair();
