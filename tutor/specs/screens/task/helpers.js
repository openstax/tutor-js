import { delay } from '../../helpers';

export const setFreeResponse = async (comp, { value }) => {
    const ta = comp.find('textarea');
    if (ta.length) {
        ta.instance().value = value;
        ta.simulate('change', { target: { value: ta.instance().value } });
        await delay();
        comp.update()
        comp.find('Button[data-test-id="submit-answer-btn"]').simulate('click');
        await delay();
    }
}
