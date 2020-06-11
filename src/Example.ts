export class Name {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age
    }

    get_name(): string {
        return this.name;
    }

    set_name(name: string): void {
        this.name = name;
    }
}
