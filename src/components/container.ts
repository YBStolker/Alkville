import { Item } from "../catalog";

type AddItemError = "No capacity." | "No slots.";
type RemoveItemError = "Item not there.";

export interface ContainerOptions {
	capacity: number;
	availableSlots: number;
}

type HoldingItem = { item: Item; count: number };

export class Container {
	heldItems: HoldingItem[] = [];
	capacity: number = 0;
	availableSlots: number = 0;

	constructor(options: ContainerOptions) {
		this.capacity = options.capacity;
		this.availableSlots = options.availableSlots;
	}

	checkAddItem(item: Item): AddItemError | undefined {
		if (this.heldItemCount() >= this.capacity) {
			return "No capacity.";
		}

		const heldItem = this.heldItems.find(held => held.item.id === item.id);
		const needNewSlot = !heldItem || heldItem.count >= (heldItem.item.maxStack || 0);

		if (needNewSlot && this.heldItems.length >= this.availableSlots) {
			return "No slots.";
		}
	}

	checkRemoveItem(item: Item): RemoveItemError | undefined {
		if (this.heldItemCount() === 0) {
			return "Item not there.";
		}

		const iHeldItem = this.heldItems.findIndex(held => held.item.id === item.id);
		const heldItem = this.heldItems[iHeldItem];

		if (iHeldItem >= 0 || !heldItem || heldItem.count <= 0) {
			return "Item not there.";
		}
	}

	private uncheckedAddItem(item: Item) {
		const heldItem = this.heldItems.find(held => held.item.id === item.id) as HoldingItem;
		if (heldItem.count < (heldItem.item.maxStack || 0)) {
			heldItem.count++;
		} else {
			this.heldItems.push({ item, count: 1 });
		}
	}

	private uncheckedRemoveItem(item: Item) {
		const iHeldItem = this.heldItems.findIndex(held => held.item.id === item.id);
		const heldItem = this.heldItems[iHeldItem];

		heldItem.count--;

		if (heldItem.count <= 0) {
			this.heldItems.splice(iHeldItem, 1);
		}
	}

	addItem(item: Item): AddItemError | undefined {
		const addItemError = this.checkAddItem(item);
		if (addItemError) return addItemError;

		this.uncheckedAddItem(item);
	}

	removeItem(item: Item): RemoveItemError | undefined {
		const removeItemError = this.checkRemoveItem(item);
		if (removeItemError) return removeItemError;

		this.uncheckedRemoveItem(item);
	}

	transferTo(destination: Container, item: Item, count: number): AddItemError | RemoveItemError | undefined {
		for (let i = 0; i < count; i++) {
			const removeItemError = this.checkRemoveItem(item);
			if (removeItemError) return removeItemError;

			const addItemError = destination.checkAddItem(item);
			if (addItemError) return addItemError;

			this.uncheckedRemoveItem(item);
			destination.uncheckedAddItem(item);
		}
	}

	transferAllTo(destination: Container) {
		for (const heldItem of this.heldItems) {
			this.transferTo(destination, heldItem.item, heldItem.count);
		}
	}

	grabFrom(source: Container, item: Item, count: number): AddItemError | RemoveItemError | undefined {
		return source.transferTo(this, item, count);
	}

	grabAllFrom(source: Container) {
		source.transferAllTo(this);
	}

	heldItemCount(): number {
		return (this.heldItems?.length || 0) && this.heldItems.map(item => item.count).reduce((acc, cur) => acc + cur, 0);
	}
}
