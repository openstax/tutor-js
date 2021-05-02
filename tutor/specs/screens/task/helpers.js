import { delay } from '../../helpers';

export const setFreeResponse = async (comp, { value }) => {
    const ta = comp.find('textarea');
    if (ta.length) {
        ta.instance().value = value;
        ta.simulate('change', { target: { value: ta.instance().value } });
        await delay();
        comp.update()
        comp.find('AnswerButton').simulate('click');
        await delay();
    }
}
