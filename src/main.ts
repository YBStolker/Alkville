import { Color, DisplayMode, Engine, SolverStrategy } from "excalibur";
import { World } from "./world";

const game = new Engine({
	canvasElementId: "game",
	physics: {
		solver: SolverStrategy.Realistic,
	},
	width: 1200,
	height: 900,
	displayMode: DisplayMode.FitContainerAndFill,
	backgroundColor: Color.fromHex("#696969"), // Nice
	pixelArt: true,
	pixelRatio: 1,
	scenes: {
		World,
	},
});

game.start().then(() => {
	game.goToScene("World");
});
