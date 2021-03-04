// All implemented creep types
import { BasicCreepManager } from "Creeps/BasicCreep";
import { Builder } from "Creeps/Builder";
import { Collector } from "Creeps/Collector";
import { Scout } from "Creeps/GlobalCreeps/Scout";
import { Harvester } from "Creeps/Harvester";
import { MineralCollector } from "Creeps/MineralCollector";
import { Repair } from "Creeps/Repair";
import { Trader } from "Creeps/Trader";
import { Transporter } from "Creeps/Transporter";
import { Upgrader } from "Creeps/Upgrader";

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


export var Flag_color: { [Key: string]: ColorConstant } = {};
Flag_color['storage'] = COLOR_WHITE;
Flag_color['extension'] = COLOR_YELLOW;
Flag_color['debug'] = COLOR_GREY;
