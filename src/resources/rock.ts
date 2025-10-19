import * as ex from "excalibur";
import { Robot } from "../actors/robot";
import { MoveRobotAction } from "../actions/moveRobotAction";
import { World } from "../world";

const radius = 25;

export class Rock extends ex.Actor {
	constructor(private world: World, pos: ex.Vector) {
		super({
			pos,
			radius,
			color: ex.Color.LightGray,
			collisionType: ex.CollisionType.Fixed,
		});
	}

	onInitialize(engine: ex.Engine): void {
		this.events.on("pointerdown", event => {
			if (event.button === ex.PointerButton.Right) {
				if (this.world.inputHandler) {
					if (this.world.inputHandler.skipPointerDownInput[ex.PointerButton.Right])
					this.world.inputHandler.skipPointerDownInput[ex.PointerButton.Right] = true;
				}

				this.world.actors
					.filter(actor => actor instanceof Robot)
					.filter(robot => robot.selected)
					.forEach(robot => {
						if (!this.world.input.keyboard.isHeld(ex.Keys.ShiftLeft)) {
							robot.actions.clearActions();
						}
						const moveAction = new MoveRobotAction({
							destination: this.pos,
							robot,
							toWithinRange: radius + robot.range,
						});

						robot.actions.getQueue().add(moveAction);
					});
			}
		});
	}
}
