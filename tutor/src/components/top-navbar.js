import { React, PropTypes, observer, cn } from 'vendor';
import { NavbarContext } from './navbar/context';

@observer
export default class TopNavbar extends React.Component {

  static propTypes = {
    context: PropTypes.instanceOf(NavbarContext).isRequired,
  };

  render() {
    const { className, left, right, center } = this.props.context;
    return (
      <nav className={cn('tutor-top-navbar', 'plugable', className)}>
        <div className="left-side-controls">
          {left.components}
        </div>
        <div className="center-control">
          {center.components}
        </div>
        <div className="right-side-controls">
          {right.components}
        </div>
      </nav>
    );
  }
}
