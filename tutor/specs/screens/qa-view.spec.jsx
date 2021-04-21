import { C, ApiMock } from '../helpers';
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
        'ecosystems': [FactoryBot.create('Ecosystem')],
        'ecosystems/\\d+/readings': [ FactoryBot.create('Book') ],
        'ecosystems/\\d+/pages/.*': FactoryBot.create('Page'),
    })

    beforeEach(function() {
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

        const page = ux.page;
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

    it('loads exercises', () => {
        const qa = mount(<C><QA {...props} /></C>);
        expect(mocks['ecosystems']).toHaveBeenCalled()
        qa.unmount();
    });
});
