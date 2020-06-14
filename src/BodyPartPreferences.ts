// This file contains ideal bodypart ratios for each creep

import { CreepType } from "globals"

/**
 * Dictionary to indicate the minimum mandatory composition of body parts for each creep
 */
export const BodyPartsRequired: { [key: number]: BodyPartConstant[] } = {};
BodyPartsRequired[CreepType.harvester] = [MOVE, CARRY, WORK];
BodyPartsRequired[CreepType.builder] = [MOVE, CARRY, WORK];
BodyPartsRequired[CreepType.collector] = [MOVE, WORK];

/**
 * Dictionary to indicate the additional composition of body parts for each creep
 */
export const BodyPartsAdditional: { [key: number]: BodyPartConstant[] } = {};
BodyPartsAdditional[CreepType.harvester] = [MOVE, CARRY, WORK];
BodyPartsAdditional[CreepType.builder] = [MOVE, CARRY, WORK];
BodyPartsAdditional[CreepType.collector] = [WORK];
