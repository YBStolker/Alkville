import { Actor, Color, Engine, Vector } from "excalibur";

export class Robot extends Actor {
	maxSpeed = 50;
	private _selected = false;
	get selected(): boolean {
		return this._selected;
	}
	set selected(val: boolean) {
        this._selected = val;
        this.color = this._selected ? Color.Azure : Color.Yellow;
	}

	constructor(pos: Vector) {
		super({
			pos,
			radius: 8,
			color: Color.Yellow,
		});
	}

	override onPostUpdate(engine: Engine, elapsed: number): void {}
}
