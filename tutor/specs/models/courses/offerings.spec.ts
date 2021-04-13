import { Factory } from '../../helpers'
import { OfferingsMap }  from '../../../src/models/course/offerings';
import OfferingsModel from '../../../src/models/course/offerings/offering';
import { every } from 'lodash';

describe('Offerings Model', function() {
    let offerings: OfferingsMap

    // beforeEach(() => {
    //     offerings = Factory.offeringsMap() //n
    // });

    it('bootstraps', function() {
        offerings = new OfferingsMap()
        offerings.bootstrap(
            [Factory.bot.create('Offering', {}), Factory.bot.create('Offering', {})] as any
        )
        expect(offerings.array.length).toBe(2);
        expect(every(offerings.array, (o) => o instanceof OfferingsModel)).toBeTruthy();
    });

});
