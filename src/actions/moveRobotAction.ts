import * as ex from "excalibur";
import { Robot } from "../actors/robot";

const defaultTimeLimit = 2;
const defaultToWithinRange = 5;

export interface MoveRobotActionOptions {
	destination: ex.Vector;
	robot: Robot;
	timeLimit?: number;
	toWithinRange?: number;
	onSuccess?: (action: MoveRobotAction) => void;
	onFailure?: (action: MoveRobotAction) => void;
}

export class MoveRobotAction implements ex.Action {
	id: number = 0;

	anchorDist: number = 0;

	anchorPos?: ex.Vector;
	anchorTimestamp?: number;
	toWithinRange?: number

	constructor(private options: MoveRobotActionOptions) {
		this.toWithinRange = (this.options.toWithinRange || defaultToWithinRange) ** 2;

		this.options.timeLimit = (this.options.timeLimit || defaultTimeLimit) * 1000;
		this.anchorDist = options.robot.speed * 0.25 * (this.options.timeLimit / 1000);
	}

	update(elapsed: number): void {
		if (this.anchorPos && this.options.robot.pos.distance(this.anchorPos) > this.anchorDist) {
			this.anchorPos = undefined;
		}

		if (!this.anchorPos) {
			this.anchorPos = this.options.robot.pos.clone();
			this.anchorTimestamp = Date.now();
		}

		this.options.robot.vel = this.options.destination.sub(this.options.robot.pos).normalize().scale(this.options.robot.speed);
	}

	isComplete(entity: ex.Entity): boolean {
		const hasArrived = this.options.robot.pos.squareDistance(this.options.destination) < (this.toWithinRange || 0);
		const isTooSlow = Date.now() - (this.anchorTimestamp || 0) > (this.options.timeLimit || 0);

		const isComplete = hasArrived || isTooSlow;

		if (isComplete) {
			this.options.robot.vel = ex.Vector.Zero;
			if (hasArrived && this.options.onSuccess) {
				this.options.onSuccess(this);
			}

			if (isTooSlow && this.options.onFailure) {
				this.options.onFailure(this);
			}
		}

		return isComplete;
	}

	reset(): void {
		this.options.robot.vel = ex.Vector.Zero;
	}

	stop(): void {
		this.options.robot.vel = ex.Vector.Zero;
	}
}
