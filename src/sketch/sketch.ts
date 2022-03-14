// dependencies
import p5 from 'p5'

export default function sketch(p5: p5): void {
	p5.setup = () => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight)
	}

	p5.windowResized = () => {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
	}

	p5.draw = () => {
		p5.clear(0, 0, 0, 0)
		p5.background(0)
		p5.fill(255)
		p5.rect(
			(p5.windowWidth / 2) - 25,
			(p5.windowHeight / 2) - 25,
			50,
			50,
		)
	}
}