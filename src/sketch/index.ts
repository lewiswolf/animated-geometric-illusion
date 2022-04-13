// dependencies
import p5 from 'p5'

// src
import { Polygon } from './polygon'
import { Point } from './types'
import { generateConvexPolygon, rotatePolygon } from './utils'

export default function sketch(p5: p5): void {
	/*
	This p5 sketch renders three randomly generated polygons to the screen. The
	polygons are rendered such that their lines are painted either in full, 
	outside of another polygon, or both outside and inside of another polygon.
	At every frame the polygons are rotated, and gradually morph back and forth
	between another randomly generated polygon.
	*/

	// three random numbers to control how fast the polygon spins
	const spin: [number, number, number] = [
		fxrand() * 0.001 + 0.005,
		fxrand() * 0.001 + 0.005,
		fxrand() * 0.001 + 0.005,
	]
	// an array of three polygons
	let polygons: [Polygon, Polygon, Polygon] = [
		new Polygon(Math.round(fxrand() * 7 + 3)),
		new Polygon(Math.round(fxrand() * 7 + 3)),
		new Polygon(Math.round(fxrand() * 7 + 3)),
	]
	// this object controls all of the morphing
	let morph: {
		t: number // internal counter
		T: number // maximum amount of frames for each morph
		polygons: [Point[], Point[], Point[]] // three randomly generated polygons
		polygons_prime: [Point[], Point[], Point[]] // three polygons to morph into
	} = {
		t: 0,
		T: 10000,
		polygons: [
			generateConvexPolygon(polygons[0].N),
			generateConvexPolygon(polygons[1].N),
			generateConvexPolygon(polygons[2].N),
		],
		polygons_prime: [
			generateConvexPolygon(polygons[0].N),
			generateConvexPolygon(polygons[1].N),
			generateConvexPolygon(polygons[2].N),
		],
	}

	const applyMorph = (): void => {
		/*
		This function first rotates the three polygons, and then calculates the transition
		between another set of polygons.
		*/

		for (let i = 0; i < 3; i++) {
			// rotate
			morph.polygons[i] = rotatePolygon(morph.polygons[i]!, spin[i]! * (2 * (i % 2) - 1))
			morph.polygons_prime[i] = rotatePolygon(
				morph.polygons_prime[i]!,
				spin[i]! * (2 * (i % 2) - 1),
			)
			const t_2 = (morph.t / morph.T) * 2
			if (t_2 <= 1.0) {
				// if morph is less than halfway through, morph from the first set of polygons
				//to the second
				polygons[i]!.vertices = morph.polygons[i]!.map((v: Point, j: number) => {
					return {
						x: v.x + (morph.polygons_prime[i]![j]!.x - v.x) * t_2,
						y: v.y + (morph.polygons_prime[i]![j]!.y - v.y) * t_2,
					}
				})
			} else {
				// if morph is more than halfway through, morph from the second set of polygons
				// to the first
				polygons[i]!.vertices = morph.polygons_prime[i]!.map((v: Point, j: number) => {
					return {
						x: v.x + (morph.polygons[i]![j]!.x - v.x) * (t_2 - 1),
						y: v.y + (morph.polygons[i]![j]!.y - v.y) * (t_2 - 1),
					}
				})
			}
		}
		// increment time t
		morph.t = (morph.t + 1) % (morph.T + 1)
	}

	// create the canvas
	p5.setup = () => p5.createCanvas(p5.windowWidth, p5.windowHeight)

	// resize the canvas and polygons when the window size changes
	p5.windowResized = () => p5.resizeCanvas(p5.windowWidth, p5.windowHeight)

	p5.draw = () => {
		// size of the polygons
		const size: number = Math.min(p5.width, p5.height) / 1.5
		// clear, position and paint canvas
		p5.clear(0, 0, 0, 1)
		p5.translate(p5.width / 2, p5.height / 2)
		p5.background('#101010')
		p5.strokeWeight(2)
		// polygon 0 always shows
		p5.stroke('#E05E45') //  red
		for (let line of polygons[0].lines()) {
			p5.line(line[0].x * size, line[0].y * size, line[1].x * size, line[1].y * size)
		}
		// polygon 1 is hidden by polygon 0
		p5.stroke('#6C90E0') // blue
		for (let line of polygons[1].linesOutside(polygons[0])) {
			p5.line(line[0].x * size, line[0].y * size, line[1].x * size, line[1].y * size)
		}
		// polygon 2 inside of polygon 0, but hidden by polygon 1
		p5.stroke('#AFE055') // green
		for (let line of polygons[2].linesInside(polygons[0])) {
			p5.line(line[0].x * size, line[0].y * size, line[1].x * size, line[1].y * size)
		}
		for (let line of polygons[2].linesOutside(polygons[1])) {
			p5.line(line[0].x * size, line[0].y * size, line[1].x * size, line[1].y * size)
		}
		// morph polygons
		applyMorph()
	}
}
