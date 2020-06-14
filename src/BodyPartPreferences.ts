// This file contains ideal bodypart ratios for each creep

import { CreepType } from "globals"

/**
 * Dictionary to indicate the relative composition of body part for each creep
 *
 */
export const BodyPartsRatio: { [key: number]: BodyPartConstant[] } = {};
BodyPartsRatio[CreepType.harvester] = [MOVE, CARRY, WORK];
BodyPartsRatio[CreepType.builder] = [MOVE, CARRY, WORK, WORK, CARRY];
