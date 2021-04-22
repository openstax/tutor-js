import { Router as R } from '../helpers';
import { TutorLayout } from '../../src/components/tutor-layout';
import MM from '../../src/components/modal-manager';
import TC from '../../src/components/tours/conductor';
import { currentUser as User } from '../../src/models';
import { SpyMode as SM } from 'shared';

describe('Tutor Layout', () => {
    User.bootstrap({});

    it('renders and matches snapshot', () => {
        const l = mount(
            <R>
                <SM.Wrapper>
                    <MM>
                        <TC>
                            <TutorLayout>
                                <p>hi i am body</p>
                            </TutorLayout>
                        </TC>
                    </MM>
                </SM.Wrapper>
            </R>
        );
        expect(l.debug()).toMatchSnapshot();
        l.unmount();
    });

});
