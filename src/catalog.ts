import { deepFreeze } from "./util";

export type Item = {
	id: string;
	name: string;
	maxStack: number;
    baseGatherTime?: number;
};

export function findItemInfo(itemId: string): Item | undefined {
    return itemCatalog.items.find(item => item.id === itemId)
}

export type Catalog = {
	items: Item[];
};

export const itemCatalog: Readonly<Catalog> = deepFreeze({
	items: [
		{
			id: "wood",
			name: "Wood",
			maxStack: 50,
            baseGatherTime: 3,
		},
		{
			id: "rock",
			name: "Rock",
			maxStack: 50,
            baseGatherTime: 3,
		},
		{
			id: "coal",
			name: "Coal",
			maxStack: 50,
            baseGatherTime: 3,
		},
		{
			id: "iron_ore",
			name: "Iron ore",
			maxStack: 50,
            baseGatherTime: 4,
		},
		{
			id: "copper_ore",
			name: "Copper ore",
			maxStack: 50,
            baseGatherTime: 4,
		},
	],
});
