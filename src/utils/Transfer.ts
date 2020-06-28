export class Transfer {
    /**
     * Available places to take energy from:
     * The ground, tombstones, containers, sources and storage
     *
     * @param creep The creep which want to take energy from some specific place
     * @param object The place where the creep want to take energy from
     * @param resource The resource the creep should take from a structure (Default: Energy)
     * @returns The API number associated with the task
     */
    static take_energy(creep: Creep, object: any, resource: ResourceConstant = RESOURCE_ENERGY): number {
        if (object instanceof Resource) {
            return creep.pickup(object);
        } else if (object instanceof Ruin
            || object instanceof Tombstone
            || object instanceof Structure) {
            return creep.withdraw(object, resource)
        } else if (object instanceof Source
            || object instanceof Mineral) {
            return creep.harvest(object);
        } else {
            console.log(`Creep ${creep.name} tried to take energy from non-energy object`)
            return -1;
        }
    }
}
