import { Geometry } from './types'

export async function importGeometry(): Promise<Geometry> {
	const res = await WebAssembly.instantiateStreaming(fetch('./geometry.wasm'), {})
	return res.instance.exports
}
