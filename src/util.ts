import * as ex from "excalibur";
import { TILE_SIZE } from "./consts";

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

export function deepFreeze<T>(obj: T): Readonly<T> {
	for (const key in obj) {
		if (typeof obj[key] === "object") {
			const _ = deepFreeze(obj[key]);
		}
	}

	return Object.freeze(obj);
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

export function convertGridToWorldPos(vec: ex.Vector): ex.Vector {
	const scaled = vec.scale(TILE_SIZE);
	scaled.x = Math.floor(scaled.x);
	scaled.y = Math.floor(scaled.y);
	return scaled;
}

export class Instant {
	private start = Date.now();

	get elapsedMillis(): number {
		return Date.now() - this.start;
	}

	get elapsed(): number {
		return this.elapsedMillis / 1000;
	}

	reset() {
		this.start = Date.now();
	}
}

export function giftWrap(points: ex.Vector[]): ex.Vector[] {
	console.log(`[${points.map(vec => vecStr(vec)).join(", ")}]`);
	const giftWrap: ex.Vector[] = [];
	if (points?.length <= 3) {
		for (const p of points) {
			giftWrap.push(p);
		}
		return giftWrap;
	}

	const [highest, leftest] = (() => {
		let highest = points[0];
		let leftest = points[0];
		for (const point of points) {
			if (point.y < highest.y) {
				highest = point;
			}

			if (point.x < leftest.x) {
				leftest = point;
			}
		}
		return [highest, leftest];
	})();

	const topLeft = ex.vec(leftest.x + 10, highest.y);
	giftWrap.push(topLeft);
	giftWrap.push(highest);

	let i;
	for (i = 0; i <= points.length; i++) {
		const length = giftWrap.length;
		const point1 = giftWrap[length - 1];
		const point2 = giftWrap[length - 2];

		let maxAngle = 0;
		let maxAnglePoint: ex.Vector | null = null;
		for (const point of points) {
			if (point === point1 || point === point2) {
				continue;
			}

			const angle = calcAngle(point1, point2, point);

			if (angle > maxAngle) {
				maxAngle = angle;
				maxAnglePoint = point;
			}
		}

		if (maxAnglePoint === giftWrap[1]) {
			break;
		}

		if (maxAnglePoint) giftWrap.push(maxAnglePoint);
	}

	giftWrap.shift(); // remove topLeft

	if (i >= points.length) {
		console.error("Gift wrap incomplete.");
	}

	if (giftWrap?.length >= 3) {
		return giftWrap;
	}

	return [];
}

export function vecStr(vec: ex.Vector): string {
	return `(${numberRound(vec.x, 1)}, ${numberRound(vec.y, 1)})`;
}

/** Calculate the angle at point1 of the triangle. */
export function calcAngle(pointA: ex.Vector, pointB: ex.Vector, pointC: ex.Vector) {
	const AB = pointA.distance(pointB);
	const BC = pointB.distance(pointC);
	const AC = pointA.distance(pointC);

	const squareAll = AB ** 2 + AC ** 2 - BC ** 2;
	const divideBy = 2 * AB * AC;
	const result = Math.acos(squareAll / divideBy);

	return result;
}
