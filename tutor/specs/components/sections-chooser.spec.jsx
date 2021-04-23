import { Factory, C, ApiMock, waitFor } from '../helpers';
import Chooser from '../../src/components/sections-chooser';

describe('Sections Chooser', () => {
    let book, props;

    ApiMock.intercept({
        'ecosystems/\\d+/readings': [ Factory.data('Book') ],
    })

    beforeEach(() => {
        book = Factory.book({ type: 'physics' });
        props = {
            book,
            course: Factory.course(),
            onSelectionChange: jest.fn(),
            selectedPageIds: [],
        };
    });

    it('can select', async () => {
        const chooser = mount(<C><Chooser {...props} /></C>);
        await waitFor(() => !props.book.api.isPending)
        chooser.update()

        chooser.find('TriStateCheckbox Icon').at(1).simulate('click');
        expect(props.onSelectionChange).toHaveBeenCalled();
        props.onSelectionChange.mockReset();
        const pageId = book.pages.byId.keys()[2];
        chooser.find(`[data-section-id="${pageId}"] span`).first().simulate('click');
        expect(props.onSelectionChange).toHaveBeenCalledWith(
            expect.arrayContaining([pageId].map(String))
        );
    });

});
