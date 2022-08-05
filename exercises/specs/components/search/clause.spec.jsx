import { hydrateModel } from 'modeled-mobx'
import Renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import ClauseComponent from '../../../src/components/search/clause';
import { Clause } from '../../../src/models/search';


describe('Exercise search clause component', function() {
    let clause;
    let props;

    beforeEach(() => {
        const search = { perPageSize: 25, api: { isPending: false } };
        clause = hydrateModel(Clause, {}, search);
        props = { clause };
    });

    it('renders and matches snapshot', () => {
        const clauseComponent = Renderer.create(<ClauseComponent {...props} />);
        expect(clauseComponent.toJSON()).toMatchSnapshot();
        clauseComponent.unmount();
    });

    it('renders and matches snapshot for format filter', () => {
        clause.setFilter('format');
        const clauseComponent = Renderer.create(<ClauseComponent {...props} />);
        expect(clauseComponent.toJSON()).toMatchSnapshot();
        clauseComponent.unmount();
    });

    it('renders and matches snapshot for solutions_are_public filter', () => {
        clause.setFilter('solutions_are_public');
        const clauseComponent = Renderer.create(<ClauseComponent {...props} />);
        expect(clauseComponent.toJSON()).toMatchSnapshot();
        clauseComponent.unmount();
    });

});
