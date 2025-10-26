import * as ex from "excalibur";
import { Robot } from "../actors/robot";
import { Instant } from "../util";

const defaultTimeLimit = 2;
const defaultToWithinRange = 5;

export interface MoveRobotActionOptions {
	destination: ex.Vector;
	robot: Robot;
	timeLimit?: number;
	toWithinRange?: number;
	debugScene?: ex.Scene;
	onSuccess?: (action: MoveRobotAction) => void;
	onFailure?: (action: MoveRobotAction) => void;
}

export class MoveRobotAction implements ex.Action {
	id: number = 0;

	anchorPos?: ex.Vector;
	anchorTimestamp = new Instant();
	debugAnchorIndicator?: DebugAnchorIndicator;

	destination: ex.Vector;
	robot: Robot;
	timeLimit?: number;
	toWithinRange?: number;
	debugScene?: ex.Scene;
	onSuccess?: (action: MoveRobotAction) => void;
	onFailure?: (action: MoveRobotAction) => void;

	anchorDist: number = 0;

	constructor(options: MoveRobotActionOptions) {
		this.destination = options.destination;
		this.robot = options.robot;
		this.timeLimit = (options.timeLimit || defaultTimeLimit) * 1000;
		this.toWithinRange = (options.toWithinRange || defaultToWithinRange) ** 2;
		this.debugScene = options.debugScene;
		this.onSuccess = options.onSuccess;
		this.onFailure = options.onFailure;

		this.anchorDist = (options.robot.speed * 0.25 * (this.timeLimit / 1000)) ** 2;

	}

	update(elapsed: number): void {
		if (this.anchorPos && this.robot.pos.squareDistance(this.anchorPos) > this.anchorDist) {
			this.anchorPos = undefined;
			if (this.debugScene) {
				this.debugAnchorIndicator?.kill();
				this.debugAnchorIndicator = undefined;
			}
		}

		if (!this.anchorPos) {
			this.anchorPos = this.robot.pos.clone();
			this.anchorTimestamp.reset();
			if (this.debugScene) {
				this.debugAnchorIndicator = new DebugAnchorIndicator(this.anchorPos, this.anchorDist ** 0.5);
				this.debugScene.add(this.debugAnchorIndicator);
			}
		}

		this.robot.vel = this.destination.sub(this.robot.pos).normalize().scale(this.robot.speed);
	}

	isComplete(entity: ex.Entity): boolean {
		const hasArrived = this.robot.pos.squareDistance(this.destination) < (this.toWithinRange || 0);
		const isTooSlow = this.anchorTimestamp.elapsedMillis > (this.timeLimit || 0);

		const isComplete = hasArrived || isTooSlow;

		if (hasArrived) {
			this.onSuccess?.(this);
		}
		
		if (isTooSlow) {
			this.onFailure?.(this);
		}

		if (isComplete) {
			this.robot.vel = ex.Vector.Zero;
			if (this.debugAnchorIndicator) {
				this.debugAnchorIndicator?.kill();
				this.debugAnchorIndicator = undefined;
			}
		}

		return isComplete;
	}

	reset(): void {
		this.robot.vel = ex.Vector.Zero;
	}

	stop(): void {
		this.robot.vel = ex.Vector.Zero;
	}
}

class DebugAnchorIndicator extends ex.Actor {
	constructor(pos: ex.Vector, radius: number) {
		super({
			pos,
			radius,
			color: ex.Color.Purple,
			opacity: 0.15,
		});
	}
}
