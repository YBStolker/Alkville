import * as ex from "excalibur";
import { getRandomActionId } from "./util";
import { Robot } from "../actors/robot";
import { Rock } from "../resources/rock";

export class gatherResourceAction implements ex.Action {
	id: number = getRandomActionId();

    constructor(private robot: Robot, private resource: Rock) {
		
    }

	update(elapsed: number): void {
		throw new Error("Method not implemented.");
	}
	isComplete(entity: ex.Entity): boolean {
		throw new Error("Method not implemented.");
	}
	reset(): void {
		throw new Error("Method not implemented.");
	}
	stop(): void {
		throw new Error("Method not implemented.");
	}
}
