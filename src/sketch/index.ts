// dependencies
import p5 from 'p5'

// src
import { ConvexPolygon } from './polygon'

export default function sketch(p5: p5): void {
	// array of three convex polygons
	let polygons: [ConvexPolygon, ConvexPolygon, ConvexPolygon]
	const spin: [number, number, number] = [fxrand() / 25, fxrand() / 25, fxrand() / 25]

	p5.setup = () => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight)
		let size: number = Math.min(p5.width, p5.height) / 2
		polygons = [
			new ConvexPolygon(Math.round(fxrand() * 7 + 3), size),
			new ConvexPolygon(Math.round(fxrand() * 7 + 3), size),
			new ConvexPolygon(Math.round(fxrand() * 7 + 3), size),
		]
	}

	// resize the canvas and polygons when the window size changes
	p5.windowResized = () => {
		let size: number = Math.min(p5.width, p5.height) / 2
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
		for (let p of polygons) {
			p.resize(size)
		}
	}

	p5.draw = () => {
		p5.clear(1, 1, 1, 1)
		p5.translate(p5.width / 2, p5.height / 2)
		p5.fill(0, 0)
		p5.stroke('black')
		p5.strokeWeight(1)
		// polygon 0 always shows
		for (let line of polygons[0].lines()) {
			p5.line(line[0].x, line[0].y, line[1].x, line[1].y)
		}
		// polygon 1 is hidden by polygon 0
		for (let line of polygons[1].linesOutside(polygons[0])) {
			p5.line(line[0].x, line[0].y, line[1].x, line[1].y)
		}
		// polygon 2 inside of polygon 0, but hidden by polygon 1
		for (let line of polygons[2].linesInside(polygons[0])) {
			p5.line(line[0].x, line[0].y, line[1].x, line[1].y)
		}
		for (let line of polygons[2].linesOutside(polygons[1])) {
			p5.line(line[0].x, line[0].y, line[1].x, line[1].y)
		}
		// rotate polygons
		polygons[0].rotate(spin[0])
		polygons[1].rotate(spin[1])
		polygons[2].rotate(spin[2])
	}
}
