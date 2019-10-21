/* istanbul ignore file */

import { cloneableGenerator, SagaIteratorClone } from "@redux-saga/testing-utils";

interface Config {
    nextValue?: any,
    nextError?: Error,
}

class SagaTester {

    public static create = (generator: any, ...args: any[]): SagaTester => {
        return new SagaTester(cloneableGenerator(generator)(...args))
    }

    private generator: SagaIteratorClone
    private nextValue: any
    private nextError: any

    private constructor(generator: SagaIteratorClone, config?: Config) {
        this.generator = generator
        if (config) {
            this.nextValue = config.nextValue
            this.nextError = config.nextError
        }
    }

    public pass = (value: any) => {
        this.nextValue = value
        return this
    }

    public throw = (error: Error) => {
        this.nextError = error
        return this
    }

    public expectNext = (desc: string, value: any) => {
        const next = this.passValueAndNext()
        it(desc, () => {
            expect(next.value).toEqual(value)
        })
        return this
    }

    public expectDone = () => {
        const next = this.passValueAndNext()
        it('is done', () => {
            expect(next.value).toBeUndefined()
            expect(next.done).toEqual(true)
        })
        return this
    }

    public returns = (value: any) => {
        const next = this.passValueAndNext()
        it('is done', () => {
            expect(next.done).toEqual(true)
        })
        it('returns', () => {
            expect(next.value).toEqual(value)
        })
    }

    public clone = () => {
        return new SagaTester(this.generator.clone(), {
            nextError: this.nextError,
            nextValue: this.nextValue
        })
    }

    private passValueAndNext = () => {
        if (this.nextError) {
            const nextError = this.nextError
            this.nextError = undefined
            const throwFunc = this.generator.throw
            if (throwFunc) {
                return throwFunc(nextError)
            }
        } else if (this.nextValue !== undefined) {
            const nextValue = this.nextValue
            this.nextValue = undefined
            return this.generator.next(nextValue)
        }

        return this.generator.next()
    }
}

export default SagaTester
