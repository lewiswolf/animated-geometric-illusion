// src
import {
	compareShortestVector,
	generateConvexPolygon,
	intersectionLineLine,
	isPointInsideOfPolygon,
	rotatePolygon,
} from './utils'
import { Line, Point } from './types'

export class ConvexPolygon {
	/*
	...
	*/

	N: number
	size: number
	vertices: Point[]

	constructor(N: number, size: number) {
		this.N = N
		this.size = size
		this.vertices = generateConvexPolygon(N).map((v: Point) => {
			return {
				x: v.x * this.size,
				y: v.y * this.size,
			}
		})
	}

	resize = (size: number): void => {
		this.vertices = this.vertices.map((v: Point) => {
			return {
				x: (v.x / this.size) * size,
				y: (v.y / this.size) * size,
			}
		})
		this.size = size
	}

	rotate = (theta: number): void => {
		this.vertices = rotatePolygon(this.vertices, theta)
	}

	lines = (): Line[] =>
		this.vertices.map((_, i: number) => {
			return [this.vertices[i]!, this.vertices[(i + 1) % this.N]!]
		})

	linesInside = (P_prime: ConvexPolygon): Line[] => {
		let lines: Line[] = []
		for (let line of this.lines()) {
			let intersections: Point[] = []
			for (let line_prime of P_prime.lines()) {
				let intersection = intersectionLineLine(line, line_prime)
				intersection && intersections.push(intersection)
			}
			const vertexInTriangle: [boolean, boolean] = [
				isPointInsideOfPolygon(line[0], P_prime.vertices),
				isPointInsideOfPolygon(line[1], P_prime.vertices),
			]
			if (vertexInTriangle[0] && vertexInTriangle[1]) {
				// if both vertex of inside of triangle and no intersections draw line between vertex
				lines.push(line)
			} else if (vertexInTriangle[0] && !vertexInTriangle[1] && intersections[0]) {
				// if vertex A outside, vertex B inside, find closest intersection and draw line A to intersection
				lines.push([line[0], intersections[0]])
			} else if (!vertexInTriangle[0] && vertexInTriangle[1] && intersections[0]) {
				// if vertex A inside, vertex B outside, find closest intersection and draw line B to intersection
				lines.push([line[1], intersections[0]])
			} else if (
				!vertexInTriangle[0] &&
				!vertexInTriangle[1] &&
				intersections[0] &&
				intersections[1]
			) {
				// if both vertex outside of triangle and two intersections, draw line between intersections
				lines.push([intersections[0], intersections[1]])
			}
		}
		return lines
	}

	linesOutside = (P_prime: ConvexPolygon): Line[] => {
		let lines: Line[] = []
		for (let line of this.lines()) {
			let intersections: Point[] = []
			for (let line_prime of P_prime.lines()) {
				let intersection = intersectionLineLine(line, line_prime)
				intersection && intersections.push(intersection)
			}
			const vertexInTriangle: [boolean, boolean] = [
				isPointInsideOfPolygon(line[0], P_prime.vertices),
				isPointInsideOfPolygon(line[1], P_prime.vertices),
			]
			if (!vertexInTriangle[0] && !vertexInTriangle[1] && !intersections.length) {
				// if both vertex of inside of triangle and no intersections draw line between vertex
				lines.push(line)
			} else if (!vertexInTriangle[0] && vertexInTriangle[1] && intersections) {
				// if vertex A outside, vertex B inside, find closest intersection and draw line A to intersection
				lines.push([line[0], compareShortestVector(line[0], intersections)[0]])
			} else if (vertexInTriangle[0] && !vertexInTriangle[1] && intersections) {
				// if vertex A inside, vertex B outside, find closest intersection and draw line B to intersection
				lines.push([line[1], compareShortestVector(line[1], intersections)[0]])
			} else if (
				vertexInTriangle[0] &&
				vertexInTriangle[1] &&
				intersections[0] &&
				intersections[1]
			) {
				// if both vertex in triangle
				lines.push([intersections[0], intersections[1]])
			} else if (!vertexInTriangle[0] && !vertexInTriangle[1] && intersections) {
				// if both vertex  of triangle and two intersections
				lines.push([line[0], compareShortestVector(line[0], intersections)[0]])
				lines.push([line[1], compareShortestVector(line[1], intersections)[0]])
			}
		}
		return lines
	}
}
