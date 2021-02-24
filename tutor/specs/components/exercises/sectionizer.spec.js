import { FakeWindow } from '../../helpers';
import Sectionizer from '../../../src/components/exercises/sectionizer';
import ChapterSection from '../../../src/models/chapter-section';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Sectionizer Component', function() {

    let props;

    beforeEach(() => {
        props = {
            chapter_sections: [
                '1', '1.1', '1.2', '1.3', '2', '2.1', '2.2', '2.3', '3', '3.1', '3.2',
            ].map(cs => new ChapterSection(cs)),
            onScreenElements:  [],
            nonAvailableWidth: 1000,
            windowImpl:        new FakeWindow,
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<Sectionizer {...props} />).toMatchSnapshot();
    });

});
