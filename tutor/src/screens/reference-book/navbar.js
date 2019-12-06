import { React, PropTypes, observer, styled, inject, autobind } from 'vendor';
import Theme from '../../../theme';
import UX from './ux';

@inject('setSecondaryTopControls')
@observer
class Navbar extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    setSecondaryTopControls: PropTypes.func.isRequired,
    unDocked: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    if (!props.unDocked) {
      props.setSecondaryTopControls(this.renderNavbar);
    }
    this.renderNavbar.unpadded = true;
  }

  componentWillUnmount() {
    if (!this.props.unDocked) {
      this.props.setSecondaryTopControls(null);
    }
  }

  // nothing is rendered directly, instead it's set in the secondaryToolbar
  render() {
    if (this.props.unDocked) {
      return this.renderNavbar();
    }
    return null;
  }

  @autobind renderNavbar() {
    const { ux } = this.props;

    return (
      <p>hi</p>
    );
  }

}

export default Navbar
