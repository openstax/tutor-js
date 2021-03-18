import { compareOfferings } from '../../src/helpers/offering'

const offerings = [
    {
        id: 1,
        is_available: true,
        number: 10,
    },
    {
        id: 2,
        is_available: false,
        number: 1,
    },
    {
        id: 3,
        is_available: false,
        number: 3,
    },
    {
        id: 4,
        is_available: false,
        number: 4,
    },
    {
        id: 5,
        is_available: true,
        number: 99,
    },
    {
        id: 6,
        is_available: true,
        number: 6,
    },
]

describe('Offering helpers', function() {
    it('sort the offerings correctly', () => {
        const sortedOfferingIds = offerings.sort(compareOfferings).map(o => o.id)
        expect(sortedOfferingIds).toEqual([6,1,5,4,3,2])
    })
})
