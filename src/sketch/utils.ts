// src
import { Line, Point } from './types'

export const compareShortestVector = (p: Point, a: Point[]): [Point, number] => {
	/*
	Compare a point with an array of points by vector length and return the
	closest point. Return the point itself if a = [].
	*/

	let vec_min: number = 0
	let a_closest: Point = p
	let idx: number = 0
	a.forEach((a_p: Point, i: number) => {
		const vec = Math.sqrt(Math.pow(p.x - a_p.x, 2) + Math.pow(p.y - a_p.y, 2))
		if (vec < vec_min || i === 0) {
			vec_min = vec
			a_closest = a_p
			idx = i
		}
	})
	return [a_closest, idx]
}

export function generateConvexPolygon(N: number): Point[] {
	/*
	Generate convex shapes according to Pavel Valtr's 1995 algorithm.
	Adapted from Sander Verdonschot's Java version, found here:
	https://cglab.ca/~sander/misc/ConvexGeneration/ValtrAlgorithm.java
	input:
		N = the number of vertices
		seed? = the seed for the random number generators
	output:
		V = a polygon of N random vertices
	*/

	// initialise and sort random coordinates
	const X = Array.from({ length: N }, () => 0)
	const Y = Array.from({ length: N }, () => 0)
	const X_rand = Array.from({ length: N }, () => fxrand()).sort()
	const Y_rand = Array.from({ length: N }, () => fxrand()).sort()
	let V: Point[] = []
	let last_true: number = 0
	let last_false: number = 0

	// divide the interior points into two chains
	for (let i = 1; i < N; i++) {
		if (i != N - 1) {
			if (Math.round(fxrand())) {
				X[i] = X_rand[i]! - X_rand[last_true]!
				Y[i] = Y_rand[i]! - Y_rand[last_true]!
				last_true = i
			} else {
				X[i] = X_rand[last_false]! - X_rand[i]!
				Y[i] = Y_rand[last_false]! - Y_rand[i]!
				last_false = i
			}
		} else {
			X[0] = X_rand[i]! - X_rand[last_true]!
			Y[0] = Y_rand[i]! - Y_rand[last_true]!
			X[i] = X_rand[last_false]! - X_rand[i]!
			Y[i] = Y_rand[last_false]! - Y_rand[i]!
		}
	}
	// randomly combine x and y
	Y.sort(() => fxrand() - 0.5)
	for (let i = 0; i < N; i++) {
		V.push({ x: X[i]!, y: Y[i]! })
	}
	// sort by polar angle
	V.sort((a: Point, b: Point) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x))

	// arrange points end to end to form a polygon
	let x_min: number = 0
	let x_max: number = 0
	let y_min: number = 0
	let y_max: number = 0
	let x: number = 0.0
	let y: number = 0.0
	for (let i = 0; i < N; i++) {
		let p: Point = { x, y }
		x += V[i]!.x
		y += V[i]!.y
		V[i]! = p
		x_min = Math.min(V[i]!.x, x_min)
		x_max = Math.max(V[i]!.x, x_max)
		y_min = Math.min(V[i]!.y, y_min)
		y_max = Math.max(V[i]!.y, y_max)
	}
	// center around origin
	for (let i = 0; i < N; i++) {
		V[i]!.x += (x_max - x_min) / 2.0 - x_max
		V[i]!.y += (y_max - y_min) / 2.0 - y_max
	}
	return V
}

export const intersectionLineLine = (a: Line, b: Line): Point | null => {
	/*
	Finds the point at which two lines intersect. Returns null if they
	do not intersect.
	collisionLineLine() => https://github.com/bmoren/p5.collide2D
	*/

	// calculate the distance to intersection point
	const uA: number =
		((b[1].x - b[0].x) * (a[0].y - b[0].y) - (b[1].y - b[0].y) * (a[0].x - b[0].x)) /
		((b[1].y - b[0].y) * (a[1].x - a[0].x) - (b[1].x - b[0].x) * (a[1].y - a[0].y))
	const uB: number =
		((a[1].x - a[0].x) * (a[0].y - b[0].y) - (a[1].y - a[0].y) * (a[0].x - b[0].x)) /
		((b[1].y - b[0].y) * (a[1].x - a[0].x) - (b[1].x - b[0].x) * (a[1].y - a[0].y))
	// if uA and uB are betbeen 0-1, lines are colliding
	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
		return { x: a[0].x + uA * (a[1].x - a[0].x), y: a[0].y + uA * (a[1].y - a[0].y) }
	} else {
		return null
	}
}

export const isPointInsideOfPolygon = (p: Point, V: Point[]): boolean => {
	/*
	Determines whether or not a cartesion pair is within a polygon. collidePointPoly()
	 => https://github.com/bmoren/p5.collide2D
	*/

	let collision = false
	// go through each of the vertices, plus the next vertex in the list
	V.forEach((c: Point, i: number) => {
		const n = V[(i + 1) % V.length]!
		// compare position, flip 'collision' variable back and forth
		if (
			((c.y >= p.y && n.y < p.y) || (c.y < p.y && n.y >= p.y)) &&
			p.x < ((n.x - c.x) * (p.y - c.y)) / (n.y - c.y) + c.x
		) {
			collision = !collision
		}
	})
	return collision
}

export function rotatePolygon(P: Point[], theta: number): Point[] {
	/*
	Rotate an array of cartesian products around the origin by angle theta.
	*/

	const cos_theta: number = Math.cos(theta)
	const sin_theta: number = Math.sin(theta)
	return P.map((p) => {
		return {
			x: p.x * cos_theta - p.y * sin_theta,
			y: p.x * sin_theta + p.y * cos_theta,
		}
	})
}
