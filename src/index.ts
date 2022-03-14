// dependencies
import p5 from 'p5'

// src
import sketch from './sketch/sketch'

// mount a wrapper and it's contents to the DOM
const container = document.createElement('div')
// container.innerText = `random hash: ${fxhash}
// and some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]`
new p5(sketch, container)
document.body.prepend(container)