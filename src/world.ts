import { Robot } from "./actors/robot";
import * as ex from "excalibur";
import { InputHandler } from "./handlers/inputHandler";
import { ResourceNode, Rock } from "./resources/rock";
import { convertGridToWorldPos } from "./util";

export class World extends ex.Scene {
	inputHandler?: InputHandler;

	constructor() {
		super();
		this.camera.pos = ex.Vector.Zero;
	}

	onInitialize(engine: ex.Engine): void {
		this.inputHandler = new InputHandler(this);
		this.randomlySpawnSomeRobot(5, 200);
		// this.randomlySpawnSomeResources(50, 10);
	}

	onPostUpdate(engine: ex.Engine, elapsed: number): void {
		this.dampenRobotMovement();
	}

	dampenRobotMovement() {
		this.actors
			.filter(actor => actor instanceof Robot)
			.forEach(robot => {
				if (robot.vel.magnitude < 1) {
					robot.vel = ex.Vector.Zero;
				} else {
					robot.vel = robot.vel.scale(0.9);
				}
			});
	}

	randomlySpawnSomeRobot(count: number, limit: number) {
		for (let i = 0; i < count; i++) {
			const x = Math.random() * limit * (Math.random() > 0.5 ? 1 : -1);
			const y = Math.random() * limit * (Math.random() > 0.5 ? 1 : -1);
			const robot = new Robot(this, ex.vec(x, y));
			this.add(robot);
		}
	}

	randomlySpawnSomeResources(count: number, limit: number) {
		const usedPos: ex.Vector[] = [];

		for (let i = 0; i < count; i++) {
			let rockPos = null;
			for (let j = 0; j < 10; j++) {
				const x = Math.floor(Math.random() * limit) * (Math.random() > 0.5 ? 1 : -1);
				const y = Math.floor(Math.random() * limit) * (Math.random() > 0.5 ? 1 : -1);
				const pos = ex.vec(x, y);
				if (!usedPos.some(p => p.x === pos.x && p.y === pos.y)) {
					rockPos = pos;
					break;
				}
			}

			if (rockPos === null) return;

			usedPos.push(rockPos);

			const rock = new Rock(this, convertGridToWorldPos(rockPos));
			this.add(rock);
		}
	}
}
