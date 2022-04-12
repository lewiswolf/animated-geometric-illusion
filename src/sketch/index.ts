// dependencies
import p5 from 'p5'

// src
import { ConvexPolygon } from './polygon'
import { Point } from './types'
import { generateConvexPolygon, rotatePolygon } from './utils'

export default function sketch(p5: p5): void {
	// array of three convex polygons
	const spin: [number, number, number] = [
		fxrand() * 0.001 + 0.005,
		fxrand() * 0.001 + 0.005,
		fxrand() * 0.001 + 0.005,
	]
	let polygons: [ConvexPolygon, ConvexPolygon, ConvexPolygon] = [
		new ConvexPolygon(Math.round(fxrand() * 7 + 3)),
		new ConvexPolygon(Math.round(fxrand() * 7 + 3)),
		new ConvexPolygon(Math.round(fxrand() * 7 + 3)),
	]
	let morph: {
		t: number
		T: number
		polygons: [Point[], Point[], Point[]]
		polygons_prime: [Point[], Point[], Point[]]
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

	p5.setup = () => p5.createCanvas(p5.windowWidth, p5.windowHeight)

	// resize the canvas and polygons when the window size changes
	p5.windowResized = () => p5.resizeCanvas(p5.windowWidth, p5.windowHeight)

	const applyMorph = (): void => {
		for (let i = 0; i < 3; i++) {
			// rotate
			morph.polygons[i] = rotatePolygon(morph.polygons[i]!, spin[i]! * (2 * (i % 2) - 1))
			morph.polygons_prime[i] = rotatePolygon(
				morph.polygons_prime[i]!,
				spin[i]! * (2 * (i % 2) - 1),
			)

			if (morph.t < morph.T / 2) {
				const amount = (morph.t / morph.T) * 2
				polygons[i]!.vertices = morph.polygons[i]!.map((v: Point, j: number) => {
					return {
						x: v.x + (morph.polygons_prime[i]![j]!.x - v.x) * amount,
						y: v.y + (morph.polygons_prime[i]![j]!.y - v.y) * amount,
					}
				})
			} else {
				const amount = (morph.t / morph.T) * 2 - 1
				polygons[i]!.vertices = morph.polygons_prime[i]!.map((v: Point, j: number) => {
					return {
						x: v.x + (morph.polygons[i]![j]!.x - v.x) * amount,
						y: v.y + (morph.polygons[i]![j]!.y - v.y) * amount,
					}
				})
			}
		}
		morph.t = (morph.t + 1) % morph.T
	}

	p5.draw = () => {
		const size: number = Math.min(p5.width, p5.height) / 1.5
		p5.clear(0, 0, 0, 1)
		p5.translate(p5.width / 2, p5.height / 2)
		p5.background('#b0e0e6')
		p5.strokeWeight(2)
		// polygon 0 always shows
		p5.stroke('#cc2400')
		for (let line of polygons[0].lines()) {
			p5.line(line[0].x * size, line[0].y * size, line[1].x * size, line[1].y * size)
		}
		// polygon 1 is hidden by polygon 0
		p5.stroke('#228b22')
		for (let line of polygons[1].linesOutside(polygons[0])) {
			p5.line(line[0].x * size, line[0].y * size, line[1].x * size, line[1].y * size)
		}
		// polygon 2 inside of polygon 0, but hidden by polygon 1
		p5.stroke('#ddc726')
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
