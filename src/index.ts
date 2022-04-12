// dependencies
import p5 from 'p5'

// src
import sketch from './sketch'

// mount a wrapper and its contents to the DOM
const container = document.createElement('div')
new p5(sketch, container)
document.body.prepend(container)
