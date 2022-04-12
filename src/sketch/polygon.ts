// src
import { Line, Point } from './types'
import { compareShortestVector, intersectionLineLine, isPointInsideOfPolygon } from './utils'

export class Polygon {
	/*
	A wrapper class for a polygon. This class is mainly use to generate lines from vertices.
	Originally all the logic for the polygon was housed in this class, though it after a while
	it became easier to mutate the polygon from outside. 
	*/

	N: number
	vertices: Point[]

	constructor(N: number) {
		this.N = N
		this.vertices = []
	}

	lines = (): Line[] =>
		/*
		Returns a line for each vertex in the polygon.
		*/

		this.vertices
			? this.vertices.map((v, i: number) => {
					return [v, this.vertices[(i + 1) % this.N]!]
			  })
			: []

	linesInside = (P_prime: Polygon): Line[] => {
		/*
		Returns all the lines/line segments that are inside of P_prime.
		*/

		let out: Line[] = []
		for (let line of this.lines()) {
			let intersections: Point[] = []
			for (let line_prime of P_prime.lines()) {
				let intersection = intersectionLineLine(line, line_prime)
				intersection && intersections.push(intersection)
			}
			const v_inside: [boolean, boolean] = [
				isPointInsideOfPolygon(line[0], P_prime.vertices),
				isPointInsideOfPolygon(line[1], P_prime.vertices),
			]
			if (v_inside[0] && v_inside[1]) {
				// if both vertex of inside of polygon and no intersections draw line between
				// vertex
				out.push(line)
			} else if (v_inside[0] && !v_inside[1] && intersections[0]) {
				// if vertex A outside, vertex B inside, find closest intersection and draw
				// line A to intersection
				out.push([line[0], intersections[0]])
			} else if (!v_inside[0] && v_inside[1] && intersections[0]) {
				// if vertex A inside, vertex B outside, find closest intersection and draw
				// line B to intersection
				out.push([line[1], intersections[0]])
			} else if (!v_inside[0] && !v_inside[1] && intersections[0] && intersections[1]) {
				// if both vertex outside of polygon and two intersections, draw line between
				// intersections
				out.push([intersections[0], intersections[1]])
			}
		}
		return out
	}

	linesOutside = (P_prime: Polygon): Line[] => {
		/*
		Returns all the lines/line segments that are outside of P_prime.
		*/

		let out: Line[] = []
		for (let line of this.lines()) {
			let intersections: Point[] = []
			for (let line_prime of P_prime.lines()) {
				let intersection = intersectionLineLine(line, line_prime)
				intersection && intersections.push(intersection)
			}
			const v_inside: [boolean, boolean] = [
				isPointInsideOfPolygon(line[0], P_prime.vertices),
				isPointInsideOfPolygon(line[1], P_prime.vertices),
			]
			if (!v_inside[0] && !v_inside[1] && !intersections.length) {
				// if both vertex of inside of triangle and no intersections draw line between
				// vertex
				out.push(line)
			} else if (!v_inside[0] && v_inside[1] && intersections) {
				// if vertex A outside, vertex B inside, find closest intersection and draw
				// line A to intersection
				out.push([line[0], compareShortestVector(line[0], intersections)[0]])
			} else if (v_inside[0] && !v_inside[1] && intersections) {
				// if vertex A inside, vertex B outside, find closest intersection and draw
				// line B to intersection
				out.push([line[1], compareShortestVector(line[1], intersections)[0]])
			} else if (v_inside[0] && v_inside[1] && intersections[0] && intersections[1]) {
				// if both vertex in triangle
				out.push([intersections[0], intersections[1]])
			} else if (!v_inside[0] && !v_inside[1] && intersections) {
				// if both vertex  of triangle and two intersections
				out.push([line[0], compareShortestVector(line[0], intersections)[0]])
				out.push([line[1], compareShortestVector(line[1], intersections)[0]])
			}
		}
		return out
	}
}
