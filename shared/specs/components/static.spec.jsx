import React from 'react';
import StaticComponent from '../../src/components/static';

class TestComponent extends StaticComponent {
    renderSpy = jest.fn();
    render() {
        this.renderSpy();
        return null;
    }
}


describe('Static Component', function() {
    it('renders only once', () => {
        const wrapper = mount(<TestComponent />);
        expect(wrapper.instance().renderSpy).toHaveBeenCalledTimes(1);
        wrapper.setProps({ renderAgain: true });
        expect(wrapper.instance().renderSpy).toHaveBeenCalledTimes(1);
    });
});
