import { Geometry } from '../lib/types';

export function importGeometry(): Promise<Geometry> {
	const res = WebAssembly.instantiateStreaming(fetch('./webassembly/geometry.wasm'), {})
	return res.then((res) => res.instance.exports)
}