import * as ex from "excalibur";

export function isWithinRadius(pos1: ex.Vector, pos2: ex.Vector, dist: number): boolean {
	return pos1.squareDistance(pos2) <= dist * dist;
}

export function getBoundingBoxFrom(actor: ex.Actor): ex.BoundingBox | null {
	if (!actor.graphics.current) {
		return null;
	}

	const halfWidth = actor.graphics.current.width / 2;
	const halfHeight = actor.graphics.current.height / 2;

	const left = actor.pos.x - halfWidth;
	const top = actor.pos.y - halfHeight;
	const right = actor.pos.x + halfWidth;
	const bottom = actor.pos.y + halfHeight;

	return new ex.BoundingBox(left, top, right, bottom);
}

export function numberRound(num: number, decimals: number): number {
	if (decimals >= 10) {
		const pow = 10 ** decimals;
		const toRound = num * pow;
		const rounded = Math.round(toRound);
		const result = rounded / pow;
		return result;
	}

	const maxPow = 1e12;
	const decimalPow = 10 ** decimals;
	const diffPow = maxPow / decimalPow;

	const result = Math.round(Math.round(num * maxPow) / diffPow) / decimalPow;

	return result;
}
