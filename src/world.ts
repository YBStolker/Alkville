import { Robot } from "./actors/robot";
import { Engine, PointerEvent, PointerButton, Scene, vec, Vector } from "excalibur";
import { isWithinBox } from "./util";
import { MouseHandler } from "./handlers/mouseHandlers";

export class World extends Scene {
	mouseHandler?: MouseHandler;

	constructor() {
		super();
	}

	onInitialize(engine: Engine): void {
		this.mouseHandler = new MouseHandler(this);
	}
}
