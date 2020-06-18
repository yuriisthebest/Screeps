// All implemented creep types
import { BasicCreepManager } from "Creeps/BasicCreep";
import { Harvester } from "Creeps/Harvester";
import { Builder } from "Creeps/Builder";
import { Collector } from "Creeps/Collector";
import { Repair } from "Creeps/Repair";
import { Transporter } from "Creeps/Transporter";
import { Upgrader } from "Creeps/Upgrader";

export enum CreepType {
    harvester = 0,
    builder = 1,
    collector = 2,
    repairer = 3,
    transporter = 4,
    upgrader = 5,
}

export var CreepClasses: { [Key: number]: BasicCreepManager } = {};
CreepClasses[CreepType.harvester] = new Harvester();
CreepClasses[CreepType.builder] = new Builder();
CreepClasses[CreepType.collector] = new Collector();
CreepClasses[CreepType.repairer] = new Repair();
CreepClasses[CreepType.transporter] = new Transporter();
CreepClasses[CreepType.upgrader] = new Upgrader();
