import { Actor, CollisionType, Color, Engine, Vector } from "excalibur";

export class Robot extends Actor {
	maxSpeed = 100;

	#selected = false;
	get selected(): boolean {
		return this.#selected;
	}
	set selected(val: boolean) {
		this.#selected = val;
		this.color = this.#selected ? Color.Cyan : Color.Yellow;
	}

	constructor(pos: Vector) {
		super({
			pos,
			radius: 8,
			color: Color.Yellow,
			collisionType: CollisionType.Active,
			
		});
	}
}
