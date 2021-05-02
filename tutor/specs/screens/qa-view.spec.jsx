import { C, ApiMock, waitFor } from '../helpers';
import { times } from 'lodash';
import Factory, { FactoryBot } from '../factories';
import QA from '../../src/screens/qa-view/view';
import EcosystemSelector from '../../src/screens/qa-view/ecosystem-selector';
import QaUX from '../../src/screens/qa-view/ux';

jest.mock('../../../shared/src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('QA Screen', function() {
    let props, ux, book;

    const mocks = ApiMock.intercept({
        'ecosystems$': [Factory.data('Ecosystem')],
        'ecosystems/\\d+/readings': [ Factory.data('Book') ],
        'ecosystems/\\d+/pages/.*': Factory.data('Page'),
    })

    beforeEach(async () => {
        const history = {
            push: jest.fn(),
        };
        const exercises = Factory.exercisesMap();
        const ecosystems = Factory.ecosystemsMap();
        exercises.fetch = jest.fn();
        ux = new QaUX({ history, exercises, ecosystems });
        const ecosystem = ux.ecosystemsMap.array[0];

        ux.update({
            ecosystemId: ecosystem.id,
        });
        await waitFor(() => ux.page)
        const { page } = ux;
        ux.exercisesMap.onLoaded(
            times(8, () => FactoryBot.create('TutorExercise', {
                page_uuid: page.uuid,
            })),
            undefined, book, [ page.id ],
        )

        props = {
            ux,
        };
    });

    it('has working ecosystem selector', () => {
        const es = mount(<C><EcosystemSelector {...props} /></C>);
        es.find('DropdownToggle Button').simulate('click');
        const id = ux.ecosystemsMap.array[0].id;
        const itemSelector = `DropdownItem[eventKey=${id}]`;
        expect(es).toHaveRendered(itemSelector);
        es.find(itemSelector).simulate('click');
    });

    xit('loads exercises', () => {
        const qa = mount(<C><QA {...props} /></C>);
        expect(mocks['ecosystems$']).toHaveBeenCalled()
        qa.unmount();
    });
});
