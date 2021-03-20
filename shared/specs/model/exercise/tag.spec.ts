import ld from 'lodash';
import { ExerciseTag as Tag } from '../../../src/model/exercise/tag';

describe('Exercise Tags', () => {

    it('splits and re-assembles parts', () => {
        const lo = new Tag('lo:stax-phys:1-2-1');

        expect(lo.asString).toEqual('lo:stax-phys:1-2-1');
        expect(lo.asObject).toEqual({ type: 'lo', specifier: 'stax-phys', value: '1-2-1' });
        lo.type = 'TY';
        expect(lo.asObject).toEqual({ type: 'TY', specifier: 'stax-phys', value: '1-2-1' });

        lo.specifier = 'S';
        expect(lo.asObject).toEqual({ type: 'TY', specifier: 'S', value: '1-2-1' });

        lo.value = 'V';
        expect(lo.asObject).toEqual({ type: 'TY', specifier: 'S', value: 'V' });

        expect(lo.asString).toEqual('TY:S:V');
    });

    it('lists important tags', () => {
        const lo = new Tag('lo:stax-phys:1-2-1');
        expect(lo.isImportant).toBe(true);
        const book = new Tag('book:foo:bar');
        expect(book.isImportant).toBe(false);
    });

    it('computes validity', () => {
        const lo = new Tag('lo:stax-phys:1-2-1');
        expect(lo.validity).toEqual({ valid: true });
        lo.value = '';
        expect(lo.validity).toEqual({ valid: false, part: 'lo must have value' });
    });

    it('calculates proper titles', () => {
        const tag = new Tag('hts:1');
        expect(tag.title).toEqual('HTS-1 Developments and Processes');
        tag.raw = 'rp:3';
        expect(tag.title).toEqual('RP-3 Continuity and Change');
        tag.raw = 'aplo:stax-apbio:1.23';
        expect(tag.title).toEqual('aplo:1.23');
        tag.raw = 'aplo:stax-apphys:1.A.1.3';
        expect(tag.title).toEqual('aplo:1.A.1.3');
    });

    it('sorts correctly', () => {
        const tags = [
            new Tag('hts:1'), new Tag('book:stax-apush'),
            new Tag('lo:stax-apphys:1.A.2.2'), new Tag('aplo:stax-apphys:1.A.1.3'),
        ];
        expect(ld.map(ld.sortBy(tags, 'sortValue', 'title'), 'title')).toEqual([
            'aplo:1.A.1.3',
            'lo:stax-apphys:1.A.2.2',
            'book:stax-apush',
            'HTS-1 Developments and Processes',
        ]);
    });
});
