import { React } from '../helpers';
import TemplateModal from '../../src/components/course-modal';

describe('Template Modal', () => {

    it('renders and matches snapshot', () => {
        expect(<TemplateModal templateType="neutral" />).toMatchSnapshot();
    });

});
