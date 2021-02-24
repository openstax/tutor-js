import React from 'react';
import CornerRibbon from '../../src/components/corner-ribbon';
import SnapShot from 'react-test-renderer';

describe(CornerRibbon, () => {
    ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'].forEach(position => {
        it(`renders and matches snapshot for ${position}`, () => {
            expect(SnapShot.create(
                <CornerRibbon position={position} label="test"><p>This is the Body</p></CornerRibbon>
            ).toJSON()).toMatchSnapshot();
        });
    });
});
