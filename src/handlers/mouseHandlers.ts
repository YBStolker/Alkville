import { PointerButton, PointerEvent, Vector } from "excalibur";
import { World } from "../world";
import { Robot } from "../actors/robot";
import { isWithinBox } from "../util";
import { Selection } from "../actors/selection.ts";

export class MouseHandler {
	selectionStart?: Vector;
	selection?: Selection;

	constructor(private world: World) {
		world.input.pointers.on("down", event => {
			if (event.button === PointerButton.Left) {
				this.startSelection(event);
			}

			if (event.button === PointerButton.Right) {
				this.spawnRobot(event);
			}
		});

		world.input.pointers.on("up", event => {
			if (event.button === PointerButton.Left) {
				this.endSelection(event);
			}
		});
	}

	spawnRobot(event: PointerEvent) {
		const worldPos = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);
		this.world.add(new Robot(worldPos));
	}

	startSelection(event: PointerEvent) {
		this.selectionStart = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);
		this.selection = new Selection(this.selectionStart);
		this.world.add(this.selection);
	}

    updateSelection(event: PointerEvent) {
        // TODO: add visual indicator for selection region
		const currentPos = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);
    }

	endSelection(event: PointerEvent) {
		if (!this.selectionStart) {
			return;
		}

		const selectionEnd = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);

		for (const actor of this.world.actors) {
			if (!(actor instanceof Robot)) {
				continue;
			}

			actor.selected = isWithinBox(actor.pos, this.selectionStart, selectionEnd);
		}

		this.selectionStart = undefined;
	}
}
