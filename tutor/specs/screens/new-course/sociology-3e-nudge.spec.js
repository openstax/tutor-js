import { Factory, R } from '../../helpers';
import BuilderUX from '../../../src/screens/new-course/ux';
import Sociology3eNudge from '../../../src/screens/new-course/sociology-3e-nudge';

describe('Sociology 3e nudge', function() {
    let ux;

    beforeEach(() => {
        ux = new BuilderUX({
            router: { match: { params: {} } },
            offerings: Factory.offeringsMap({ count: 2 }),
        });

        ux.router.match.params.offeringId = ux.offerings.array[0].id;
        ux.offering.os_book_id = ux.offering.SOC2E_BOOK_ID;

        const soc3eOffering = ux.offerings.array[1];
        soc3eOffering.os_book_id = ux.offering.SOC3E_BOOK_ID;
    });

    it('matches snapshot', function() {
        expect.snapshot(<R><Sociology3eNudge ux={ux}/></R>).toMatchSnapshot();
    });
});
