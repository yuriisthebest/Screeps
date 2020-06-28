// This file contains ideal bodypart ratios for each creep

import { CreepType } from "Constants/globals"

/**
 * Dictionary to indicate the minimum mandatory composition of body parts for each creep
 */
export const BodyPartsRequired: { [key: number]: BodyPartConstant[] } = {};
BodyPartsRequired[CreepType.harvester] = [MOVE, CARRY, WORK];
BodyPartsRequired[CreepType.builder] = [MOVE, CARRY, WORK];
BodyPartsRequired[CreepType.collector] = [MOVE, WORK];
BodyPartsRequired[CreepType.repairer] = [MOVE, CARRY, WORK];
BodyPartsRequired[CreepType.transporter] = [MOVE, CARRY, CARRY];
BodyPartsRequired[CreepType.upgrader] = [MOVE, CARRY];
BodyPartsRequired[CreepType.mineralist] = [MOVE, WORK, WORK]

/**
 * Dictionary to indicate the additional composition of body parts for each creep
 */
export const BodyPartsAdditional: { [key: number]: BodyPartConstant[] } = {};
BodyPartsAdditional[CreepType.harvester] = [MOVE, CARRY, WORK];
BodyPartsAdditional[CreepType.builder] = [MOVE, CARRY, WORK];
BodyPartsAdditional[CreepType.collector] = [WORK];
BodyPartsAdditional[CreepType.repairer] = [MOVE, CARRY, WORK];
BodyPartsAdditional[CreepType.transporter] = [MOVE, CARRY, CARRY];
BodyPartsAdditional[CreepType.upgrader] = [WORK, WORK, WORK, WORK, WORK, CARRY];
BodyPartsAdditional[CreepType.mineralist] = [WORK, WORK, WORK, WORK, MOVE]
