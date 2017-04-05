import React from 'react';

import { BaseModel } from '../models/base';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

// Like LoadableItem, this component views a single model from the backend
//  - displays 'Loading...', 'Error', or the actual rendered component
//  - automatically listens to changes in the appropriate model to re-render
//  - calls `load` to fetch the latest version of the component when initially mounted

function Loading() {
  return (
    <div className='loadable is-loading'>Loading... </div>
  );
}

@observer
export default class LoadableModel extends React.PureComponent {

  static defaultProps = {
    loadAction: 'fetch',
  }

  static propTypes = {
    model:  React.PropTypes.instanceOf(BaseModel).isRequired,
    loadAction: React.PropTypes.string,
    renderItem: React.PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model !== this.props.model){
      this.load(nextProps);
    }
  }

  load(props = this.props) {
    const { model, loadAction } = props;
    if (!model.isNew && !model.apiRequestsInProgress.has(loadAction)) {
      model[loadAction]();
    }
  }

  @computed get Component() {
    const { model, loadAction, renderItem } = this.props;
    const inProgress = model.apiRequestsInProgress.get(loadAction);
    if (inProgress) {
      return Loading;
    } else {
      return renderItem;
    }
  }

  render() {
    const { Component } = this;
    return (
      <Component model={this.props.model} />
    );
  }

}
