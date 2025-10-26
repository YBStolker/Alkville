import * as ex from "excalibur";
import { Container } from "../components/container";

export class Robot extends ex.Actor {
	container: Container = new Container({ capacity: 1, availableSlots: 1 });

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
		this.updateColor();
	}

	private _giftWrap = false;
	public get giftWrap() {
		return this._giftWrap;
	}
	public set giftWrap(value) {
		this._giftWrap = value;
		this.updateColor();
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

	updateColor() {
		if (this.giftWrap) {
			this.color = ex.Color.Orange;
			return;
		}

		if (this.selected) {
			this.color = ex.Color.Cyan;
			return;
		}

		this.color = ex.Color.Yellow;
	}
}
