import { Geometry } from './types'

export function importGeometry(): Promise<Geometry> {
	const res = WebAssembly.instantiateStreaming(fetch('./geometry.wasm'), {})
	return res.then((res) => res.instance.exports)
}
