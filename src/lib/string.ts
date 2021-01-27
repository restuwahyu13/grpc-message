import MemoryStream from 'memorystream'
import { Transform } from 'stream'
import { gunzipSync, gzipSync } from 'zlib'
import { isType } from '../utils/util.is'
import { GrpcBox } from '../utils/util.error'
import { waitFor } from '../utils/util.wait'

const stream = new MemoryStream() as MemoryStream
const transform = new Transform() as Transform

/**
 * create a data stream for the string data type
 * @param data - set stream data for consumption to the client - required
 * @param delay - set delay before returning data to the client - optional
 * @return Promise
 */

export function string(data: string, delay?: number): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		if (isType(data) === 'string') {
			const toString: string = data
			stream.write(toString)
			stream.once('data', (chunk): boolean => transform.emit('response', gzipSync(chunk.toString())))
		} else {
			reject(new GrpcBox(`data must be a string you give type ${isType(data)}`))
		}

		transform.once(
			'response',
			async (res): Promise<void> => {
				await waitFor(delay)
				const unzip = gunzipSync(res)
				resolve(unzip)
			}
		)
	})
}