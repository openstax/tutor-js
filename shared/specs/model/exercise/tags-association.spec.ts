import { TagsAssociation, Tag } from '../../../src/model/exercise/tags-association'

describe('Exercise Tags Association', () => {

    it('splits and re-assembles parts', () => {
        const ta = new TagsAssociation()
        ta.all.push(new Tag('lo:stax-phys:1-2-1'))
        expect(ta.includes({ type: 'lo', value: '1-2-1' })).toBeTruthy()
    })
})
