// src
import { Line, Point } from './types'
import { compareShortestVector, intersectionLineLine, isPointInsideOfPolygon } from './utils'

export class Polygon {
	/*
	A wrapper class for a polygon. This class is mainly uses to generate lines from vertices.
	Originally, all of the logic for the polygons was housed in this class, however, after a while,
	it became easier to mutate the polygon from outside of this class.
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
		Returns all of the lines/line segments that are inside of P_prime.
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
				// if both vertices are inside of P_prime with no intersections, draw a line
				// between each vertex
				out.push(line)
			} else if (v_inside[0] && !v_inside[1] && intersections[0]) {
				// if vertex A is inside and vertex B outside, find closest intersection and draw
				// from vertex A to intersection
				out.push([line[0], intersections[0]])
			} else if (!v_inside[0] && v_inside[1] && intersections[0]) {
				// if vertex A is outside and vertex B inside, find closest intersection and draw
				// from vertex B to intersection
				out.push([line[1], intersections[0]])
			} else if (!v_inside[0] && !v_inside[1] && intersections[0] && intersections[1]) {
				// if both vertices are outside of the polygon with two intersections, draw a line
				// between both intersections
				out.push([intersections[0], intersections[1]])
			}
		}
		return out
	}

	linesOutside = (P_prime: Polygon): Line[] => {
		/*
		Returns all of the lines/line segments that are outside of P_prime.
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
				// if both vertices are outside of P_prime with no intersections, draw a line
				// between each vertex
				out.push(line)
			} else if (!v_inside[0] && v_inside[1] && intersections) {
				// if vertex A is outside and vertex B inside, find closest intersection and draw
				// from vertex B to intersection
				out.push([line[0], compareShortestVector(line[0], intersections)[0]])
			} else if (v_inside[0] && !v_inside[1] && intersections) {
				// if vertex A is inside and vertex B outside, find closest intersection and draw
				// from vertex A to intersection
				out.push([line[1], compareShortestVector(line[1], intersections)[0]])
			} else if (v_inside[0] && v_inside[1] && intersections[0] && intersections[1]) {
				// if both vertices are inside the polygon, draw between intersections
				out.push([intersections[0], intersections[1]])
			} else if (!v_inside[0] && !v_inside[1] && intersections) {
				// if both vertices are outside of the polygon, draw between intersections
				out.push([line[0], compareShortestVector(line[0], intersections)[0]])
				out.push([line[1], compareShortestVector(line[1], intersections)[0]])
			}
		}
		return out
	}
}
