export class Generator {
	private promise: any
	private iterator: globalThis.Generator
	private next: any

	constructor(handler: any) {
		this.promise = handler
		this.iterator = this.generator()
		this.next = this.iterator.next()
	}

	private *generator(): ReturnType<() => globalThis.Generator> {
		yield this.promise
	}

	public execute(): ReturnType<() => Promise<any> | any> {
		return this.next.value
	}
}
