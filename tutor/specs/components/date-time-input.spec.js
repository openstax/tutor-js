import { TimeMock } from '../helpers';
import DateTimeInput from '../../src/components/date-time-input';
import { Formik as F } from 'formik';
import { last } from 'lodash';

describe('DateTimeInput', () => {
    let props;

    TimeMock.setTo('2020-02-01T12:00:00.000Z');

    beforeEach(() => {
        props = {
            name: 'dte',
            label: 'Please Enter Date',
            onChange: jest.fn(),
        };
    });

    it('matches snapshot', () => {
        expect.snapshot(<F><DateTimeInput {...props} /></F>).toMatchSnapshot();
    });

    it('sets value', () => {
        const dt = mount(<F initialValues={{
            dte: new Date(),
        }}><DateTimeInput {...props} /></F>);
        dt.find('input').simulate('mouseDown')
        dt.find('td[title="2020-02-15"]').simulate('click')

        //Note for hour selection:
        //the order in the browser is different from what jest simulates. There is CSS that reorders the flow of the hour options
        //Browser: 12, 11, 10, ...., 1
        //Jest: 12, 1, 2, ...., 11
        dt.find('.oxdt-time-panel-column').at(0).find('.oxdt-time-panel-cell').last().simulate('click')
        // last cell now is 59
        dt.find('.oxdt-time-panel-column').at(1).find('.oxdt-time-panel-cell').last().simulate('click')
        dt.find('.oxdt-time-panel-column').at(2).find('.oxdt-time-panel-cell').last().simulate('click')
        expect(dt.find('input').instance().value).toEqual('Feb 15 | 11:59 PM')

        dt.find('.oxdt-ok button').simulate('click')
        expect(props.onChange).toHaveBeenCalled()
        expect(last(props.onChange.mock.calls)[0].target.value.toISOString()).toEqual('2020-02-16T05:59:00.000Z')

        dt.unmount();
    });

    describe('with a given timezone', () => {
        it('works with an initial value', () => {
            const dt = mount(<F initialValues={{
                dte: new Date(),
            }}><DateTimeInput timezone='America/Los_Angeles' {...props} /></F>);

            expect(dt.find('input').instance().value).toEqual('Feb 1 | 04:00 AM')

            dt.unmount();
        });

        it('works without an initial value', () => {
            const dt = mount(<F initialValues={{}}><DateTimeInput timezone='America/Los_Angeles' {...props} /></F>);
            expect(dt.find('input').instance().value).toEqual('');

            dt.find('input').simulate('mouseDown');
            dt.find('.oxdt-now-btn').simulate('click');
            // Without an initial value, rc-picker will default to the browser's
            // timezone when creating the fallback moment object (America/Chicago
            // in this test.) So 6AM may seem incorrect at first, but the component
            // uses asLocal to convert the displayed default browser TZ time to the
            // given timezone. Basically, we don't care what timezone rc-picker
            // defaulted the moment object to, we clicked 6AM, so we want the output
            // object to be 6AM America/Los_Angeles.
            expect(dt.find('input').instance().value).toEqual('Feb 1 | 06:00 AM');

            dt.unmount();
        });
    });

    describe('without a given timezone', () => {
        it('works with an initial value', () => {
            const dt = mount(<F initialValues={{
                dte: new Date(),
            }}><DateTimeInput {...props} /></F>);

            expect(dt.find('input').instance().value).toEqual('Feb 1 | 06:00 AM')

            dt.unmount();
        });

        it('works without an initial value', () => {
            const dt = mount(<F initialValues={{}}><DateTimeInput {...props} /></F>);
            expect(dt.find('input').instance().value).toEqual('')

            dt.find('input').simulate('mouseDown');
            dt.find('.oxdt-now-btn').simulate('click');
            expect(dt.find('input').instance().value).toEqual('Feb 1 | 06:00 AM');

            dt.unmount();
        });
    });
});
