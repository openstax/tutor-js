import { React, ReactDOM, observable } from '../../helpers/react';

export class Blinds {

  @observable panels = new Map();

  @observable page;


}

const blinds = new Blinds();


export class ObscuredPage extends React.Component {


  componentDidMount() {
    blinds.page = ReactDOM.findDOMNode(this.children);
  }

  componentWillUnmount() {
    blinds.page = null;
  }

  render() {
    return this.children;
  }

}
