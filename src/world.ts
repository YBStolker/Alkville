import * as ex from "excalibur";
import { Robot } from "./actors/robot";

export class World extends ex.Scene {
	constructor() {
		super();
	}

	override onInitialize(engine: ex.Engine): void {
		this.input.pointers.on("down", event => {
			if (event.button === ex.PointerButton.Left) {
				this.spawnDot(event);
			} else if (event.button === ex.PointerButton.Right) {
				this.moveDots(event);
			}
		});
	}

	spawnDot(event: ex.PointerEvent) {
		const worldPos = this.engine.screen.pageToWorldCoordinates(ex.vec(event.pagePos.x, event.pagePos.y));

		const dot = new Robot(worldPos);
		this.add(dot);
	}

	moveDots(event: ex.PointerEvent) {
		for (const actor of this.actors) {
			if (!(actor instanceof Robot)) {
				continue;
			}

            if (!(this.input.keyboard.isHeld(ex.Keys.ShiftLeft) || this.input.keyboard.isHeld(ex.Keys.ShiftRight))) {
                actor.actions.getQueue().clearActions();
            }

			const pos = this.engine.screen.pageToWorldCoordinates(ex.vec(event.pagePos.x, event.pagePos.y));
			const speed = 300;

			actor.actions.moveTo(pos, speed);
		}
	}
}
