import { Keys, PointerButton, PointerEvent, Vector } from "excalibur";
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
				this.moveSelectedUnits(event);
			}
		});

		world.input.pointers.on("up", event => {
			if (event.button === PointerButton.Left) {
				this.endSelection(event);
			}
		});

		world.input.pointers.on("move", event => {
			this.updateSelection(event);
		});
	}

	moveSelectedUnits(event: PointerEvent) {
		const worldPos = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);
		this.world.actors
			.filter(actor => actor instanceof Robot)
			.filter(robot => robot.selected)
			.forEach(robot => {
				if (!this.world.input.keyboard.isHeld(Keys.ShiftLeft)) {
					robot.actions.clearActions();
				}
				robot.actions.moveTo(worldPos, robot.maxSpeed);
			});
	}

	startSelection(event: PointerEvent) {
		this.selectionStart = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);
	}

	updateSelection(event: PointerEvent) {
		if (!this.selectionStart) {
			return;
		}

		if (this.selection) {
			this.selection.kill(); // Width and height are readonly, so we have to kill and re-add.
			this.selection = undefined;
		}

		const currentMousePos = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);
		const pos = this.selectionStart.lerp(currentMousePos, 0.5);
		const selectionWidth = Math.abs(currentMousePos.x - this.selectionStart.x);
		const selectionHeight = Math.abs(currentMousePos.y - this.selectionStart.y);

		this.selection = new Selection(pos, selectionWidth, selectionHeight);
		this.world.add(this.selection);
	}

	endSelection(event: PointerEvent) {
		if (this.selection) {
			this.selection.kill();
			this.selection = undefined;
		}

		if (!this.selectionStart) {
			return;
		}

		const selectionEnd = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);

		const selectionStart = this.selectionStart;
		this.world.actors
			.filter(actor => actor instanceof Robot)
			.forEach(robot => {
				robot.selected = isWithinBox(robot.pos, selectionStart, selectionEnd);
			});

		this.selectionStart = undefined;
	}
}
