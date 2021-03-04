/**
 * Class to handle all trading on terminals
 */
export class Market {
    game: Game;

    /**
     * Look at each terminal individual
     * Sell resources when there are atleast 10.000
     * Choose the most efficient trade
     *
     * @param game The total game state
     */
    constructor(game: Game) {
        this.game = game;
        // Find every terminal I own from all rooms
        for (const room_id in game.rooms) {
            const room = game.rooms[room_id];
            if (!room.terminal) { continue }
            let best_order;
            let best_gain = 0;
            let amount;
            // Check all terminals with all resources (minerals) to update stock
            for (const res of [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM,
                RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_OXYGEN,
                RESOURCE_HYDROGEN, RESOURCE_CATALYST, RESOURCE_ENERGY]) {
                if (room.terminal.store[res] < 10000) { continue }
                // Only sell energy if there is more than 400000 in storage
                if (res == RESOURCE_ENERGY
                    && room.storage != undefined
                    && room.storage.store.energy < 400000) { continue; }
                const order = this.find_trades(res, room.terminal.store[res], room)
                if (order != undefined && best_gain < order.price) {
                    best_gain = order.price;
                    best_order = order;
                    amount = room.terminal.store[res];
                    if (res == RESOURCE_ENERGY && order.roomName != undefined) {
                        amount -= this.game.market.calcTransactionCost(
                            amount, room.name, order.roomName);
                    }
                }
            }
            if (best_order != undefined && amount != undefined) {
                this.deal(best_order,
                    _.min([best_order.remainingAmount, amount]),
                    room.name)
            }
        }
    }

    /**
     * Find suitable efficient trades
     *  efficiency is calculated following the formula (amount * price * 2) / energy_cost
     *  aka revenue / cost
     *
     * @param resource The resource to find trades for
     * @param amount The amount of the resource avaialble to sell
     * @param room The place from where to find trades
     */
    find_trades(resource: ResourceConstant, amount: number, room: Room): Order | undefined {
        const orders = this.game.market.getAllOrders(
            { type: ORDER_BUY, resourceType: resource });
        if (orders == undefined) { return }
        // Find the best order out of all orders
        let best_order;
        let best_eff = 0;
        for (const order of orders) {
            // (Subscription) token orders do not have a roomname
            if (order.roomName == undefined) { continue }
            const energy_cost = this.game.market.calcTransactionCost(
                amount, room.name, order.roomName);
            const eff = (_.min([amount, order.remainingAmount]) * order.price * 2)
                / energy_cost;
            if (eff > best_eff) {
                best_eff = eff;
                best_order = order;
            }
        }
        return best_order;
    }

    deal(order: Order, amount: number, room: string) {
        const code = this.game.market.deal(order.id, amount, room);
        if (code < 0) {
            console.log(`Tried to make deal ${amount} ${order.resourceType} for ${amount * order.price} in room ${room} but got code ${code}`)
        } else {
            console.log(`Sold ${amount} ${order.resourceType} for ${amount * order.price} in room ${room}`)
        }
    }
}
