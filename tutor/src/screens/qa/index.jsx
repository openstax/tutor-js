import React from 'react';
import './styles.scss';
import { inject, observer } from 'mobx-react';
import UX from './ux';
import NavbarContext from '../../components/navbar/context';
import QAView from './view';

@inject('navBar')
@observer
export default class QAViewWrapper extends React.Component {

  static propTypes = {
    params: React.PropTypes.shape({
      ecosystemId: React.PropTypes.string,
      section: React.PropTypes.string,
    }).isRequired,
    navBar: React.PropTypes.instanceOf(NavbarContext).isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  ux = new UX(this.context.router);

  componentWillMount() {
    this.ux.update(this.props.params);
    this.ux.setNavBar(this.props.navBar);
  }

  componentWillReceiveProps(nextProps) {
    this.ux.update(nextProps.params);
  }

  renderChooseEcosystem() {
    return <h3>Choose ecosystem to display from top selector</h3>;
  }

  render() {
    const { ecosystem } = this.ux;

    if (!ecosystem) { return this.renderChooseEcosystem(); }

    return (
      <QAView ux={this.ux} />
    );
  }

}
