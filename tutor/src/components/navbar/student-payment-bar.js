import { React, PropTypes, observer, styled } from 'vendor';
import Theme from 'theme';
import WindowSize from '../../models/window-size';
import { Nav } from './nav';
import { willDisplayPayment, StudentPayNowBtn } from './student-pay-now-btn';
import Course from '../../models/course';

const PaymentBar = styled(Nav)`
  top: ${Theme.navbars.top.height};
  /* less than the nav so it is not on top of the dropdown navbar */
  z-index: ${Theme.zIndex.navbar - 10};
  .student-pay-now {
    align-items: center;
    font-size: 1.4rem;
    .btn {
      font-size: 1.2rem;
      padding: 0.5rem;
      white-space: nowrap;
      margin-left: 0.5rem;
    }
  }
`;


@observer
class MobilePaymentBar extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
  }

  windowSize = new WindowSize()

  render() {
    const { course } = this.props;

    if (!(this.windowSize.isMobile && willDisplayPayment(course))) {
      return null;
    }

    return (
      <PaymentBar area="header" className="mobile-payment-bar">
        <StudentPayNowBtn course={course}/>
      </PaymentBar>
    );
  }

}

export { MobilePaymentBar };
