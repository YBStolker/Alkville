import { Robot } from "./actors/robot";
import { Engine, PointerEvent, PointerButton, Scene, vec, Vector } from "excalibur";
import { isWithinBox } from "./util";
import { MouseHandler } from "./handlers/mouseHandlers";

export class World extends Scene {
	mouseHandler?: MouseHandler;

	constructor() {
		super();
		this.camera.pos = Vector.Zero;
		const limit = 500;
		for (let i = 0; i < 100; i++) {
			const x = Math.random() * limit * (Math.random() > 0.5 ? 1 : -1);
			const y = Math.random() * limit * (Math.random() > 0.5 ? 1 : -1);
			const robot = new Robot(vec(x, y));
			this.add(robot);
		}
	}

	onInitialize(engine: Engine): void {
		this.mouseHandler = new MouseHandler(this);
	}

	onPostUpdate(engine: Engine, elapsed: number): void {
		this.dampenNonMovingRobots();
	}

	dampenNonMovingRobots() {
		this.actors
			.filter(actor => actor instanceof Robot)
			// .filter(robot => !robot.actions.getQueue().getActions().length)
			.forEach(robot => {
				robot.vel = robot.vel.scale(0.9);
				if (robot.vel.magnitude < 1) {
					robot.vel = Vector.Zero;
				}
			});
	}
}
