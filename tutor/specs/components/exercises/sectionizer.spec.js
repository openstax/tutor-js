import { FakeWindow } from '../../helpers';
import Sectionizer from '../../../src/components/exercises/sectionizer';
import { ChapterSection } from '../../../src/models';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Exercise Sectionizer Component', function() {

    it('renders and matches snapshot', () => {
        const props = {
            chapter_sections: [
                '1', '1.1', '1.2', '1.3', '2', '2.1', '2.2', '2.3', '3', '3.1', '3.2',
            ].map(cs => new ChapterSection(cs)),
            onScreenElements:  [],
            nonAvailableWidth: 1000,
            windowImpl:        new FakeWindow,
        };
        expect.snapshot(<Sectionizer {...props} />).toMatchSnapshot();
    });

});
