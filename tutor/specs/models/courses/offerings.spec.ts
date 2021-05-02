import { Factory } from '../../helpers'
import { OfferingsMap, Offering } from '../../../src/models'
import { every } from 'lodash';

describe('Offerings Model', function() {
    let offerings: OfferingsMap

    it('bootstraps', function() {
        offerings = new OfferingsMap()
        offerings.bootstrap(
            [Factory.bot.create('Offering', {}), Factory.bot.create('Offering', {})] as any
        )
        expect(offerings.array.length).toBe(2);
        expect(every(offerings.array, (o) => o instanceof Offering)).toBeTruthy();
    });

});
