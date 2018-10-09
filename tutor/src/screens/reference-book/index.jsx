import { React, inject, observer, cn } from '../../helpers/react';
import ReferenceBook from './reference-book';
import LoadingScreen from '../../components/loading-screen';
import UX from './ux';
import NavbarContext from '../../components/navbar/context';
import './styles.scss';

@inject('navBar', 'tourContext')
@observer
export default class ReferenceBookShell extends React.Component {

  static propTypes = {
    params: React.PropTypes.shape({
      ecosystemId: React.PropTypes.string.isRequired,
      chapterSection: React.PropTypes.string,
    }).isRequired,
    navBar: React.PropTypes.instanceOf(NavbarContext).isRequired,
    tourContext: React.PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
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

    if (ux.isFetching) {
      return <LoadingScreen />;
    }

    return (
      <ReferenceBook
        ux={ux}
        className={cn({ 'is-teacher': this.ux.isShowingTeacherContent })}
      />
    );
  }

}
