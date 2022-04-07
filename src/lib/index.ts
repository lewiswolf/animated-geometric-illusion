import { Geometry } from './types'

export async function importGeometry(): Promise<Geometry> {
	const res = await WebAssembly.instantiateStreaming(fetch('./geometry.wasm'), {})
	return res.instance.exports
}

// const geometry: Geometry = await importGeometry()
// geometry?.add !== undefined && console.log(geometry.add!(4.3, 3.8))
