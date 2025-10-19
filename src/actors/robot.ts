import * as ex from "excalibur";

export class Robot extends ex.Actor {
	//#region Stats
	private _speed = 150;
	get speed(): number {
		return this._speed;
	}

	private _range = 20;
	get range(): number {
		return this._range;
	}
	//#endregion

	//#region Status
	private _selected = false;
	get selected() {
		return this._selected;
	}
	set selected(value) {
		this._selected = value;
		this.color = this._selected ? ex.Color.Cyan : ex.Color.Yellow;
	}

	private _gathering = false;
	public get gathering() {
		return this._gathering;
	}
	public set gathering(value: boolean) {
		this._gathering = value;
	}
	//#endregion

	constructor(private world: ex.Scene, pos: ex.Vector) {
		super({
			pos,
			radius: 12,
			color: ex.Color.Yellow,
			collisionType: ex.CollisionType.Active,
		});
	}
}
