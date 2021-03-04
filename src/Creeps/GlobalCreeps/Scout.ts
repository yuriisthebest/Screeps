import { BasicCreepManager } from "Creeps/BasicCreep";
import { find } from "lodash";

/**
 * Scouting unit that moves through rooms and evaluates them
 */
export class Scout extends BasicCreepManager {

    /**
     * Scouts
     * Determine a room to evaluate
     * Move to room
     * Evaluate room
     */
    manage(creep: Creep): void {
        // If the scout does not remember its destination, find one
        if (creep.memory.room == undefined) {
            creep.memory.room = this.find_room_to_evaluate(creep.room.name);
        }
        // If the scout has arrived at the room, evaluate it
        // Then, the next tick, create a new destination for the scout
        //  The next tick is used since evaluating and pathfinding are costly?
        if (creep.memory.room == creep.room.name) {
            // Tick 1 (Arrive in room and evaluate)
            if (creep.memory.task == undefined || creep.memory.task == 0) {
                this.evaluate_room(creep.room);
                creep.memory.task = 1;
                return;
            }
            // Tick 2 (Set new destination)
            else if (creep.memory.task == 1) {
                creep.memory.room = this.find_room_to_evaluate(creep.room.name);
                creep.memory.task = 0;
                creep.memory.path = this.find_path(creep);
            }
        }

        // Move the creep to the room
        // todo, improve efficiency of pathfinding
        // todo, if creep does not move, change pathfinding
        if (creep.memory.room != creep.room.name) {
            if (!creep.memory.path) {
                creep.memory.path = this.find_path(creep);
            }
            let path = creep.memory.path;
            path = path.flatMap((pos, index, arr) => {
                return new RoomPosition(pos.x, pos.y, pos.roomName)
            })
            let code = creep.moveByPath(path);
            if (code == -5) {
                console.log("Scout " + creep.name + " is lost in room " + creep.room.name);
            }
        }
    }

    /**
     * Starting from the room with the scout, use BFS to find a room that should be scouted
     * Only scout 5 rooms out
     * Math: scouting out 5 rooms means that the queue must contain less than 40 rooms
     */
    find_room_to_evaluate(initial_room: string): string {
        var level_rooms = [initial_room];
        var seen = [initial_room];
        while (level_rooms.length != 0 && level_rooms.length < 40) {
            var roomname = level_rooms.shift();
            if (roomname == undefined) {
                console.log('Scout unable to find proper room');
                return "error";
            }
            if (this.should_be_scouted(roomname)) {
                console.log("Scout is going to evaluate room: " + roomname);
                return roomname;
            }
            // If the room should not be scouted
            //  find neighbor rooms and add them to the queue if they have not been searched
            const exits = Game.map.describeExits(roomname);
            if (exits[1] != undefined && !seen.includes(exits[1])) {
                level_rooms.push(exits[1]);
                seen.push(exits[1]);
            }
            if (exits[3] != undefined && !seen.includes(exits[3])) {
                level_rooms.push(exits[3]);
                seen.push(exits[3]);
            }
            if (exits[5] != undefined && !seen.includes(exits[5])) {
                level_rooms.push(exits[5]);
                seen.push(exits[5]);
            }
            if (exits[7] != undefined && !seen.includes(exits[7])) {
                level_rooms.push(exits[7]);
                seen.push(exits[7]);
            }
        }
        console.log('Scout unable to find proper room');
        return "error";
    }

    // Scout rooms that are unscouted, or have not been scouted in the last 40.000 ticks
    // todo: Add reachability check
    should_be_scouted(roomname: string): boolean {
        //const room = new Room(roomname);
        const room = Memory.rooms[roomname];
        if (room == undefined
            || room.evaluation_time == undefined
            || room.evaluation_time > 40000) {
            if (room != undefined) {
                console.log(room.evaluation_time);
            }
            return true;
        }
        return false;
    }

    /**
     * Scouting unit that moves through rooms and evaluates them
     *
     * Rooms have X measures:
     *  ownership - is this room already owned?
     *      0 = enemy
     *      1 = friendly
     *      2 = empty
     *      3 = mine
     *  treat - what milllitary capabilities does this room have?
     *      Amount of attack bodyparts
     *      Amount of towers
     *      Spawning capabilities?
     *  purpose - what is my purpose in this room?
     *      0 = None
     *      1 = Main development room
     *      2 = Off-site mining
     *      3 = Next expansion place
     */
    evaluate_room(room: Room): void {
        // todo
        room.memory.ownership = 0;
        room.memory.treat = 0;
        room.memory.purpose = 0;
        room.memory.evaluation_time = 0;
    }

    find_path(creep: Creep): RoomPosition[] {
        if (creep.memory.room == undefined) { return []; }
        let from = creep.pos;
        let to = new RoomPosition(25, 25, creep.memory.room);
        // Use `findRoute` to calculate a high-level plan for this path,
        // prioritizing highways and owned rooms
        let allowedRooms = { [from.roomName]: true };
        let route = Game.map.findRoute(from.roomName, to.roomName, {
            // Fancyness to prioritize highways and owned rooms
            // Avoid enemy rooms
            routeCallback(roomName) {
                // let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                // let isHighway = (parsed[1] % 10 === 0) ||
                // (parsed[2] % 10 === 0);
                // let isMyRoom = Game.rooms[roomName] &&
                //     Game.rooms[roomName].controller &&
                //     Game.rooms[roomName].controller.my;
                // if (isHighway || isMyRoom) {
                //     return 1;
                // } else {
                //     return 2.5;
                // }
                return 1;
            }
        });
        if (route == -2) {
            console.log("Scout unable to find path to designated room");
            return [];
        }
        route.forEach(function (info) {
            allowedRooms[info.room] = true;
        });
        // Invoke PathFinder, allowing access only to rooms from `findRoute`
        let ret = PathFinder.search(from, { pos: to, range: 20 }, {
            roomCallback(roomName) {
                if (allowedRooms[roomName] === undefined) {
                    return false;
                }
                // Cannot walk into walls or other objects
                let room = Game.rooms[roomName];
                if (room == undefined) {
                    return true;
                }
                // If the room is visible, avoid objects
                let costs = new PathFinder.CostMatrix;
                room.find(FIND_STRUCTURES).forEach(function (struct) {
                    if (struct.structureType === STRUCTURE_ROAD) {
                        // Favor roads over plain tiles
                        costs.set(struct.pos.x, struct.pos.y, 1);
                    } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my)) {
                        // Can't walk through non-walkable buildings
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                })
                return costs;
            }
        });
        return ret.path;
    }

}
