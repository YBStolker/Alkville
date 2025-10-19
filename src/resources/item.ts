export class Item {
	private constructor(private id: string, name: string, count: number) {}

    public static fromId(id: string) {
        return new Item(id, "item", 1);
    }
}
