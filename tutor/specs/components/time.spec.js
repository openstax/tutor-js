import Time from '../../src/components/time';
import moment from 'moment'
import TimeModel from 'shared/model/time';

describe('Time Display', () => {
    let props;

    beforeEach(() => {
        props = {
            date: '2020-10-10',
            format: 'long',
        };
    });

    it('renders string date', () => {
        const t = mount(<Time {...props} />)
        expect(t.text()).toEqual('Saturday, October 10th 2020, 12:00:00 am')
    });

    it('renders js date', () => {
        props.date = new Date(Date.parse('01 Jan 1980 08:28:30'))
        const t = mount(<Time {...props} />)
        expect(t.text()).toEqual('Tuesday, January 1st 1980, 8:28:30 am')
    });

    it('renders moment date', () => {
        props.date = moment('2001-01-23T11:05:00')
        const t = mount(<Time {...props} />)
        expect(t.text()).toEqual('Tuesday, January 23rd 2001, 11:05:00 am')
    });

    it('renders time instance', () => {
        props.date = new TimeModel('2010-08-01T11:45:00')
        const t = mount(<Time {...props} />)
        expect(t.text()).toEqual('Sunday, August 1st 2010, 11:45:00 am')
    });

});
