export function generateRandomArray(N: number): number[] {
	/*
	Generate a random array of floats between 0. and 1. using the fxhash api.
	*/

	return Array.from({ length: N }, () => fxrand())
}

export function randint(max: number): number {
	return Math.round(fxrand() * (max - 1))
}
