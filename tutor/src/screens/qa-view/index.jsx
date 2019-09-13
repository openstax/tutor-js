import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import './styles.scss';
import { inject, observer } from 'mobx-react';
import UX from './ux';
import { NavbarContext } from '../../components/navbar/context';
import Loading from 'shared/components/loading-animation';
import QAView from './view';

export default
@withRouter
@inject('topNavbar')
@observer
class QAViewWrapper extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      ecosystemId: PropTypes.string,
      chapterSection: PropTypes.string,
    }).isRequired,
    topNavbar: PropTypes.instanceOf(NavbarContext).isRequired,
    history: PropTypes.object.isRequired,
  }

  ux = new UX({ router: this.props.history });

  UNSAFE_componentWillMount() {
    this.ux.update(this.props.params);
    this.ux.setNavBar(this.props.topNavbar);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.ux.update(nextProps.params);
  }

  componentWillUnmount() {
    this.ux.unmount();
  }

  render() {
    const { ecosystemId, ecosystem } = this.ux;
    if (!ecosystemId) { return <h3>Choose ecosystem to display from top selector</h3>; }
    if (!ecosystem) { return <Loading message="Fetching Book…" />; }

    return (
      <QAView ux={this.ux} />
    );
  }

}
