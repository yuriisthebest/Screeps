import { RSA_PKCS1_PADDING } from "constants";
import { Search } from "utils/Find";

export class CombatManager {
    game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    /**
     * Find all my towers on the map
     * Fire at enemy creeps
     */
    manage_towers(): void {
        const rooms = this.game.rooms;
        for (const room_id in rooms) {
            const room = this.game.rooms[room_id];
            const towers = Search.search_structures(room, [STRUCTURE_TOWER]);
            for (const tower of towers) {
                if (tower.structureType != STRUCTURE_TOWER) { continue }
                this.manage_tower(tower, room);
            }
        }
    }

    /**
     * just shoot a enemy (first power creeps, then others)
     *
     * @param tower Tower strucure to manage (AnyStructure for debugging purposes)
     * @param room Room of tower
     */
    manage_tower(tower: StructureTower, room: Room) {
        const enemy_powers = room.find(FIND_HOSTILE_POWER_CREEPS);
        let enemies;
        if (enemy_powers.length != 0) {
            enemies = enemy_powers
        } else {
            enemies = room.find(FIND_HOSTILE_CREEPS);
        }
        for (const enemy of enemies) {
            tower.attack(enemy);
            console.log(`Tower in room ${room.name} is attacking ${enemy.name} from ${enemy.owner}`)
        }
    }
}
