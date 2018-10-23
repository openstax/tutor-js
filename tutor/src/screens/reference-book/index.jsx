import PropTypes from 'prop-types';
import { React, inject, observer, cn } from '../../helpers/react';
import ReferenceBook from './reference-book';
import UX from './ux';
import NavbarContext from '../../components/navbar/context';
import './styles.scss';

export default
@inject('navBar', 'tourContext')
@observer
class ReferenceBookShell extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      ecosystemId: PropTypes.string.isRequired,
      chapterSection: PropTypes.string,
    }).isRequired,
    navBar: PropTypes.instanceOf(NavbarContext).isRequired,
    tourContext: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  ux = new UX(this.context.router, this.props.tourContext);

  componentWillMount() {
    this.ux.update(this.props.params);
    this.ux.setNavBar(this.props.navBar);
  }

  componentWillUnmount() {
    this.ux.unmount();
  }

  componentWillReceiveProps(nextProps) {
    this.ux.update(nextProps.params);
  }

  render() {
    const { ux } = this;

    return (
      <ReferenceBook
        ux={ux}
        className={cn({ 'is-teacher': this.ux.isShowingTeacherContent })}
      />
    );
  }

};
