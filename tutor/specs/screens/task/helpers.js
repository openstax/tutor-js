export function setFreeResponse(comp, { value }) {
    const ta = comp.find('textarea');
    if (ta.length) {
        ta.instance().value = value;
        ta.simulate('change', { target: { value: ta.instance().value } });
        comp.find('AnswerButton').simulate('click');
    }
}
