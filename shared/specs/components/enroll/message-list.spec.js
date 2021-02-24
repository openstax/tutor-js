import React from 'react';
import { MessageList } from 'shared';

describe('MessageList Component', () => {

    it('displays error messages from a course', () => {
        const messages = [
            'You are already enrolled in this course.  Please verify the enrollment code and try again.',
            'Your enrollment in this course has been processed. Please reload the page.',
        ];
        const wrapper = shallow(<MessageList messages={messages} />);
        expect(wrapper.find('li').map(node => node.text())).toEqual([
            'You are already enrolled in this course.  Please verify the enrollment code and try again.',
            'Your enrollment in this course has been processed. Please reload the page.',
        ]);
    });

});
