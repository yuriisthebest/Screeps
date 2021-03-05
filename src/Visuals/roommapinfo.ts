import { DEBUG, SCOUTING_COOLDOWN } from "Constants/globals";

const color = {
    blue: '#0000ff',
    red: '#ff0000'
}


/**
 * Show important room information on the map, currently treat and purpose
 *
 * - flag = potential expansion room
 * -  = offsite-mining
 * - blue dot = recently scouted
 * - red square = dangerous
 *
 * @param room Room to plot the information for
 */
export function plotRoomInfo(room: string) {
    const visual = Game.map.visual;
    const mem = Memory.rooms[room];
    // Display roomname
    if (DEBUG) {
        visual.text(room, new RoomPosition(25, 5, room),
            { fontFamily: 'cursive', fontSize: 8 });
    }
    // Display recent scouting
    //  Opacity depends on during since last scouted
    visual.rect(new RoomPosition(45, 0, room), 2, 5,
        {
            fill: color['blue'],
            opacity: _.max([(SCOUTING_COOLDOWN - mem.evaluation_time) / SCOUTING_COOLDOWN, 0])
        })
    // Add a red square over dangerous rooms
    if (mem.ownership == 0) {
        visual.rect(new RoomPosition(20, 35, room), 10, 10,
            { fill: color['red'], opacity: 0.6 });
    }
}
