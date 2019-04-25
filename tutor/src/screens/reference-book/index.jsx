import PropTypes from 'prop-types';
import { React, observable, action, inject, observer, cn } from '../../helpers/react';
import ReferenceBook from './reference-book';
import UX from './ux';
import { NavbarContext } from '../../components/navbar/context';
import './styles.scss';

export default
@inject('topNavbar', 'tourContext')
@observer
class ReferenceBookShell extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      chapterSection: PropTypes.string,
    }).isRequired,
    ux: PropTypes.object,
    topNavbar: PropTypes.instanceOf(NavbarContext).isRequired,
    tourContext: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  @observable ux;

  @action componentDidMount() {
    this.ux = this.props.ux || new UX(this.context.router, this.props.tourContext);
    this.ux.update(this.props.params);
    this.ux.setNavBar(this.props.topNavbar);
  }

  componentWillUnmount() {
    this.ux.unmount();
  }

  componentWillReceiveProps(nextProps) {
    this.ux.update(nextProps.params);
  }

  render() {
    const { ux } = this;
    if (!ux) { return null; }

    return (
      <ReferenceBook
        ux={ux}
        className={cn({ 'is-teacher': this.ux.isShowingTeacherContent })}
      />
    );
  }

}
