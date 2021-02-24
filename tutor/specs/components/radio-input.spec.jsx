import RadioInput from '../../src/components/radio-input';
import { Formik as F } from 'formik';

describe('RadioInput', () => {
    let props;

    beforeEach(() => {
        props = {
            name: 'input_1',
            label: 'Input 1',
            id: 'input_1',
        };
    });

    it('matches snapshot', () => {
        expect.snapshot(<F><RadioInput {...props} /></F>).toMatchSnapshot();
    });
});
