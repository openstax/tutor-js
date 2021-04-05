import { C } from '../helpers';
import { times } from 'lodash';
import Factory, { FactoryBot } from '../factories';
import QA from '../../src/screens/qa-view/view';
import EcosystemSelector from '../../src/screens/qa-view/ecosystem-selector';
import Book from '../../src/models/reference-book';
import QaUX from '../../src/screens/qa-view/ux';

jest.mock('../../../shared/src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('QA Screen', function() {
    let props, ux, book;

    beforeEach(function() {
        const history = {
            push: jest.fn(),
        };
        const exercises = Factory.exercisesMap();
        const ecosystems = Factory.ecosystemsMap();
        exercises.fetch = jest.fn();
        jest.spyOn(Book.prototype, 'fetch').mockImplementation(function() {
            this.update(
                FactoryBot.create('Book', { id: this.id, type: 'biology' })
            );
            return Promise.resolve();
        });
        ux = new QaUX({ history, exercises, ecosystems });
        const ecosystem = ux.ecosystemsMap.array[0];

        ux.update({
            ecosystemId: ecosystem.id,
        });

        const page = ux.page;
        ux.exercisesMap.onLoaded({
            data: {
                items: times(8, () => FactoryBot.create('TutorExercise', {
                    page_uuid: page.uuid,
                })),
            },
        }, [{ book, page_ids: [ page.id ]  }]);

        props = {
            ux,
        };
    });

    it('has working ecosystem selector', () => {
        jest.spyOn(props.ux, 'onEcosystemSelect');
        const es = mount(<C><EcosystemSelector {...props} /></C>);
        es.find('DropdownToggle Button').simulate('click');
        const id = ux.ecosystemsMap.array[0].id;
        const itemSelector = `DropdownItem[eventKey=${id}]`;
        expect(es).toHaveRendered(itemSelector);
        es.find(itemSelector).simulate('click');
        expect(props.ux.onEcosystemSelect).toHaveBeenCalledWith(`${id}`, expect.anything());
    });

    it('loads exercises', () => {
        const qa = mount(<C><QA {...props} /></C>);
        expect(ux.exercisesMap.fetch).toHaveBeenCalledWith({
            book: ux.book,
            course: undefined,
            limit: false,
            page_ids: [ux.page.id],
        });
        qa.unmount();
    });
});
