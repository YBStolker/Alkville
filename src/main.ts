import * as ex from "excalibur";
import { World } from "./world";

const game = new ex.Engine({
	canvasElementId: "game",
	physics: {
		solver: ex.SolverStrategy.Realistic,
	},
	width: 1200,
	height: 900,
	displayMode: ex.DisplayMode.FitContainerAndFill,
	backgroundColor: ex.Color.fromHex("#696969"), // Nice
	pixelArt: true,
	pixelRatio: 1,
	scenes: {
		World,
	},
});

game.start().then(() => {
	game.goToScene("World");
});
