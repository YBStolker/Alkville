import * as ex from "excalibur";

export class Selection extends ex.Actor {
	constructor(pos: ex.Vector, width: number, height: number) {
		super({
			pos,
			width,
			height,
			opacity: 0.15,
			color: ex.Color.Green,
		});
	}
}
