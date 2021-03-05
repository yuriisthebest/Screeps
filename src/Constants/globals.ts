// All implemented creep types
import { BasicCreepManager } from "Creeps/BasicCreep";
import { Builder } from "Creeps/Local/Builder";
import { Collector } from "Creeps/Local/Collector";
import { Scout } from "Creeps/GlobalCreeps/Scout";
import { Harvester } from "Creeps/Local/Harvester";
import { MineralCollector } from "Creeps/Local/MineralCollector";
import { Repair } from "Creeps/Local/Repair";
import { Trader } from "Creeps/Local/Trader";
import { Transporter } from "Creeps/Local/Transporter";
import { Upgrader } from "Creeps/Local/Upgrader";

export enum CreepType {
    harvester = 0,
    builder = 1,
    collector = 2,
    repairer = 3,
    transporter = 4,
    upgrader = 5,
    mineralist = 6,
    mega_upgrader = 7,
    trader = 8,
    scout = 9,
}

export var CreepClasses: { [Key: number]: BasicCreepManager } = {};
CreepClasses[CreepType.harvester] = new Harvester();
CreepClasses[CreepType.builder] = new Builder();
CreepClasses[CreepType.collector] = new Collector();
CreepClasses[CreepType.repairer] = new Repair();
CreepClasses[CreepType.transporter] = new Transporter();
CreepClasses[CreepType.upgrader] = new Upgrader();
CreepClasses[CreepType.mineralist] = new MineralCollector();
CreepClasses[CreepType.mega_upgrader] = new Upgrader();
CreepClasses[CreepType.trader] = new Trader();
CreepClasses[CreepType.scout] = new Scout();

export var DEBUG: boolean = false;

export var Flag_color: { [Key: string]: ColorConstant } = {};
Flag_color['storage'] = COLOR_WHITE;
Flag_color['extension'] = COLOR_YELLOW;
Flag_color['debug'] = COLOR_GREY;

/** Duration (in ticks) between room evaluations */
export const SCOUTING_COOLDOWN: number = 40000;
