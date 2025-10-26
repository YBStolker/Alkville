import * as ex from "excalibur";
import { getRandomActionId } from "./util";
import { Robot } from "../actors/robot";
import { Instant } from "../util";
import { TILE_SIZE } from "../consts";
import { findItemInfo, Item } from "../catalog";
import { ResourceNode } from "../resources/rock";

export interface GatherResourceActionOptions {
	robot: Robot;
	resource: ResourceNode;
	onSuccess?: (action: GatherResourceAction) => void;
	onFailure?: (action: GatherResourceAction) => void;
}

export class GatherResourceAction implements ex.Action {
	id: number = getRandomActionId();
	startGathering?: Instant;
	gatherTime: number;
	squareRange: number;

	robot: Robot;
	resource: ResourceNode;
	onSuccess?: (action: GatherResourceAction) => void;
	onFailure?: (action: GatherResourceAction) => void;

	constructor(options: GatherResourceActionOptions) {
		this.robot = options.robot;
		this.resource = options.resource;

		this.gatherTime = (this.resource.item.baseGatherTime as number);
		this.onSuccess = options.onSuccess;
		this.onFailure = options.onFailure;
		this.squareRange = (this.resource.size + this.robot.range) ** 2;
	}

	update(elapsed: number): void {}

	isComplete(entity: ex.Entity): boolean {
		if (!this.startGathering) this.startGathering = new Instant();

		const isDoneGathering = this.startGathering.elapsedMillis >= this.gatherTime;
		const isWithinRange = this.isWithinRange();
		const nothingToGather = this.gatherTime <= 0;

		const isComplete = isDoneGathering || !isWithinRange || nothingToGather;

		this.robot.gathering = !isComplete;

		if (isDoneGathering) {
			this.onSuccess?.(this);
			this.resource.takeResource(this.robot.container);

		} else if (!isWithinRange || nothingToGather) this.onFailure?.(this);

		return isComplete;
	}

	reset(): void {
		this.startGathering?.reset();
	}

	stop(): void {
		this.robot.gathering = false;
	}

	isWithinRange(): boolean {
		const dist = this.robot.pos.squareDistance(this.resource.pos);
		const isWithinRange = dist <= this.squareRange;
		return isWithinRange;
	}
}
