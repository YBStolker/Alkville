import { Actor, Color, Vector } from "excalibur";

export class Selection extends Actor {
	constructor(pos: Vector) {
		super({
			pos,
			color: Color.Green,
		});
	}
}
