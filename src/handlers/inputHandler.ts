import * as ex from "excalibur";
import { World } from "../world.ts";
import { Robot } from "../actors/robot.ts";
import { Selection } from "../actors/selection.ts";
import { MoveRobotAction } from "../actions/moveRobotAction.ts";
import { getBoundingBoxFrom, giftWrap } from "../util.ts";

const startSize = 15;

export const skipPointerDownInput = {
	[ex.PointerButton.Left]: false,
	[ex.PointerButton.Middle]: false,
	[ex.PointerButton.Right]: false,
};

export class InputHandler {
	selectionStart?: ex.Vector;
	selection?: Selection;

	cameraDragFrom?: ex.Vector;
	pressedDown = false;

	constructor(private world: World) {
		world.engine.input.pointers.on("down", event => {
			this.pressedDown = true;
			if (event.button === ex.PointerButton.Left) {
				this.startSelection(event);
			}

			if (event.button === ex.PointerButton.Middle) {
				this.startCameraDrag(event);
			}

			if (event.button === ex.PointerButton.Right) {
				this.moveSelectedUnits(event);
			}
		});

		world.input.pointers.on("move", event => {
			if (this.selectionStart) {
				this.updateSelection(event);
			}

			if (this.cameraDragFrom) {
				this.updateCameraDrag(event);
			}
		});

		world.input.pointers.on("up", event => {
			if (!this.pressedDown) {
				return;
			}

			this.pressedDown = false;
			if (event.button === ex.PointerButton.Left) {
				this.stopSelection();
			}

			if (event.button === ex.PointerButton.Middle) {
				this.stopCameraDrag();
			}
		});

		world.input.keyboard.on("press", event => {
			if (event.key === ex.Keys.S) {
				const robots = this.world.actors.filter(actor => actor instanceof Robot);
				robots.forEach(robot => (robot.giftWrap = false));
				const selectedRobots = robots.filter(robot => robot.selected);
				const points = selectedRobots.map(robot => robot.pos);
				const giftWrapPoints = giftWrap(points);
				robots.forEach(robot => (robot.giftWrap = giftWrapPoints.includes(robot.pos)));
			}
		});

		this.selection = new Selection(ex.Vector.Zero, startSize, startSize);
		this.selection.graphics.isVisible = false;
		this.world.add(this.selection);
	}

	moveSelectedUnits(event: ex.PointerEvent) {
		const worldPos = this.world.engine.screen.pageToWorldCoordinates(event.pagePos);

		this.world.actors
			.filter(actor => actor instanceof Robot)
			.filter(robot => robot.selected)
			.forEach(robot => {
				if (!this.world.input.keyboard.isHeld(ex.Keys.ShiftLeft)) {
					robot.actions.clearActions();
				}

				const moveAction = new MoveRobotAction({
					robot,
					destination: worldPos,
				});

				robot.actions.getQueue().add(moveAction);
			});
	}

	startSelection(event: ex.PointerEvent) {
		this.selectionStart = event.worldPos;
		if (!this.selection) {
			this.stopSelection();
			return;
		}
		this.selection.graphics.isVisible = true;
		this.selection.pos = this.selectionStart;
	}

	updateSelection(event: ex.PointerEvent) {
		if (!this.selectionStart) {
			return;
		}

		if (!this.selection?.graphics.isVisible || !this.selection.graphics.current) {
			return;
		}

		const currentMousePos = event.worldPos;
		const pos = this.selectionStart.lerp(currentMousePos, 0.5);
		const selectionWidth = Math.abs(currentMousePos.x - this.selectionStart.x);
		const selectionHeight = Math.abs(currentMousePos.y - this.selectionStart.y);

		this.selection.pos = pos;
		this.selection.graphics.current.width = selectionWidth;
		this.selection.graphics.current.height = selectionHeight;
	}

	stopSelection() {
		if (!this.selection) {
			console.error("endSelection: No this.selection found!");
			return;
		}

		this.selection.graphics.isVisible = false;

		if (!this.selectionStart) {
			console.error("endSelection: No this.selectionStart found!");
			return;
		}

		const selectionBox = getBoundingBoxFrom(this.selection);
		if (!selectionBox) {
			console.error("endSelection: Could not create selectionBox");
			return;
		}

		this.world.actors
			.filter(actor => actor instanceof Robot)
			.forEach(robot => {
				robot.selected = selectionBox.contains(robot.pos);
			});

		this.selectionStart = undefined;
		if (this.selection.graphics.current) {
			this.selection.graphics.current.width = startSize;
			this.selection.graphics.current.height = startSize;
		}
	}

	startCameraDrag(event: ex.PointerEvent) {
		this.cameraDragFrom = event.screenPos.clone();
	}

	updateCameraDrag(event: ex.PointerEvent) {
		if (!this.cameraDragFrom) {
			return;
		}

		const diff = this.cameraDragFrom.sub(event.screenPos);
		if (diff.x === 0 && diff.y === 0) {
			return;
		}

		this.world.camera.pos.addEqual(diff);
		this.cameraDragFrom = event.screenPos.clone();
	}

	stopCameraDrag() {
		this.cameraDragFrom = undefined;
	}
}
