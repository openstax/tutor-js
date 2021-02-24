import React from 'react';
import SnapShot from 'react-test-renderer';

import OXColoredStripe from '../../src/components/ox-colored-stripe';

describe('OX Colored Stripe', () => {

    it('renders and matches snapshot', () => {
        expect(SnapShot.create(<OXColoredStripe />).toJSON()).toMatchSnapshot();
    });

});
