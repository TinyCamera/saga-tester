import { call } from 'redux-saga/effects'
import SagaTester from './SagaTester'


const someApi = () => {
    // do something
}

function* testSaga() {
    yield call(console.log, 'Hey there')

    const value = yield call(someApi)

    if (value) {
        yield call(console.log, 'value is ' + value)
    } else {
        yield call(console.error, "uh oh its broken")
    }
}

describe('testSaga', () => {
    const tester = SagaTester.create(testSaga)

    tester
        .expectNext("logs something", call(console.log, 'Hey there'))
        .expectNext("calls some api", call(someApi))

    describe('when value is defined', () => {
        const value = "value"
        tester.clone()
            .pass(value)
            .expectNext("logs the value", call(console.log, 'value is ' + value))
            .expectDone()
    })

    describe('when value is not defined', () => {
        tester.clone()
            .pass(undefined)
            .expectNext("logs an error", call(console.error, "uh oh its broken"))
            .expectDone()
    })

})