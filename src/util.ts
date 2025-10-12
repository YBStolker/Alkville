import { Vector } from "excalibur";

export function isWithinRadius(pos1: Vector, pos2: Vector, dist: number): boolean {
	return pos1.squareDistance(pos2) <= dist * dist;
	// Tested optimizations for this functions, but they didn't make it faster.
}

export function isWithinBox(pos: Vector, boxPos1: Vector, boxPos2: Vector): boolean {
	const minX = Math.min(boxPos1.x, boxPos2.x);
	const maxX = Math.max(boxPos1.x, boxPos2.x);
	const minY = Math.min(boxPos1.y, boxPos2.y);
	const maxY = Math.max(boxPos1.y, boxPos2.y);

	return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
}
