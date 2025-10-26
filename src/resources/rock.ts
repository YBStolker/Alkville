import * as ex from "excalibur";
import { Robot } from "../actors/robot";
import { MoveRobotAction } from "../actions/moveRobotAction";
import { World } from "../world";
import { TILE_SIZE } from "../consts";
import { GatherResourceAction } from "../actions/gatherResourceAction";
import { Container } from "../components/container";
import { findItemInfo, Item } from "../catalog";

type ResourceNodeOptions = {
	world: World;
	pos: ex.Vector;
	itemId: string;
	tileSize: number;
	maxItemCount: number;
	rechargeTime: number;
};

export class ResourceNode extends ex.Actor {
	world: World;
	item: Item;
	size: number;
	tileSize: number;
	maxItemCount: number;
	rechargeTime: number;
	itemCount: number;
	rechargeTimer: number | null = null;

	constructor(options: ResourceNodeOptions) {
		const size = (options.tileSize * TILE_SIZE) / 2 - 5;
		super({
			pos: options.pos,
			radius: size,
			color: ex.Color.LightGray,
			collisionType: ex.CollisionType.Fixed,
		});

		this.world = options.world;
		const item = findItemInfo(options.itemId);
		if (!item) {
			throw new Error("Unknown item for resource");
		}
		this.item = item;
		this.size = size;
		this.tileSize = options.tileSize;
		this.maxItemCount = options.maxItemCount;
		this.rechargeTime = options.rechargeTime;
		this.itemCount = options.maxItemCount;
	}

	takeResource(container: Container): boolean {
		if (this.itemCount <= 0) {
			return false;
		}

		const addError = container.addItem(this.item);
		if (addError) {
			return false;
		}

		this.itemCount -= 1;
		
		if (this.rechargeTimer === null) {
			this.rechargeTimer = Date.now();
		}

		return true;
	}

	onPostUpdate(engine: ex.Engine, elapsed: number): void {
		if (this.rechargeTimer !== null && this.rechargeTimer >= this.rechargeTime) {
			this.itemCount++;
			if (this.itemCount < this.maxItemCount) {
				this.rechargeTimer = this.rechargeTimer - this.rechargeTime;
			} else {
				this.rechargeTimer = null;
			}
		}
	}

	onInitialize(engine: ex.Engine): void {
		this.on("pointerdown", event => {
			if (event.button === ex.PointerButton.Right) {
				this.world.actors
					.filter(actor => actor instanceof Robot)
					.filter(robot => robot.selected)
					.forEach(robot => {
						if (!this.world.input.keyboard.isHeld(ex.Keys.ShiftLeft)) {
							robot.actions.clearActions();
						}

						const gatherAction = new GatherResourceAction({
							resource: this,
							robot,
							onSuccess: () => console.log("GatherResourceAction onSuccess"),
							onFailure: () => console.log("GatherResourceAction onFailure"),
						});

						if (!gatherAction.isWithinRange()) {
							const moveAction = new MoveRobotAction({
								destination: this.pos,
								robot,
								toWithinRange: this.size + robot.range,
							});

							robot.actions.getQueue().add(moveAction);
						}

						robot.actions.getQueue().add(gatherAction);
					});

				event.cancel();
			}
		});
	}
}

export class Rock extends ResourceNode {
	constructor(world: World, pos: ex.Vector) {
		super({
			world,
			pos,
			itemId: "rock",
			maxItemCount: 5000,
			rechargeTime: 30,
			tileSize: 2,
		});
	}
}
