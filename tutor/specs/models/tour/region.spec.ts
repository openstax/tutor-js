import { hydrateModel } from 'modeled-mobx';
import TourRegion from '../../../src/models/tour/region';

describe('Tour Region Model', () => {

    it('adds it’s id and otherTours to make tour_ids', () => {
        const region = hydrateModel(TourRegion, { id: 'foo' });
        expect(region.tour_ids).toEqual(['foo']);
        region.otherTours = ['bar', 'baz'];
        expect(region.tour_ids).toEqual(['foo', 'bar', 'baz']);
    });

});
