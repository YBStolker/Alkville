import { Actor, Color, Vector } from "excalibur";

export class Selection extends Actor {
	constructor(pos: Vector, width: number, height: number) {
		super({
			pos,
			color: Color.Green,
			width,
			height,
			opacity: 0.15,
		});
	}
}
