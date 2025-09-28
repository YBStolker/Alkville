import * as ex from "excalibur";

export class Robot extends ex.Actor {
    constructor(pos: ex.Vector) {
        super({
            pos,
            radius: 8,
            color: ex.Color.Yellow,
        });
    }
}