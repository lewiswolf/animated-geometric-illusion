// dependencies
import p5 from 'p5'

// src
import { importGeometry } from '../lib'
import { Geometry } from '../lib/types'

export default function sketch(p5: p5): void {
	let geometry: Geometry

	p5.setup = async () => {
		geometry = await importGeometry()
		p5.createCanvas(p5.windowWidth, p5.windowHeight)
	}

	p5.windowResized = () => p5.resizeCanvas(p5.windowWidth, p5.windowHeight)

	p5.draw = () => {
		p5.clear(0, 0, 0, 0)
		p5.background(0)
		p5.fill(255)
		p5.rect(p5.windowWidth / 2 - 25, p5.windowHeight / 2 - 25, 50, 50)
		geometry?.add !== undefined && console.log(geometry.add!(4.3, 3.8))
	}
}
