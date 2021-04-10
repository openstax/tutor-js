import Time from '../../src/model/time'
import moment from 'moment'

describe('time class', () => {

    it('converts from momentjs', () => {
        const m = moment()
        const t = new Time(m as any)
        expect(t.asISOString).toEqual(m.toISOString())
    })
})
