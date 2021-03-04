import PropTypes from 'prop-types';
import React from 'react';
import Loadable from './loadable';
import { isEmpty, isEqual, pick, partial } from 'lodash';

// This component is useful for viewing a single Object from the Backend (ie Task, TaskPlan).
// It uses methods defined in `CrudConfig` (maybe that should be renamed) to:
//
// - display 'Loading...', 'Error', or the actual rendered component
// - automatically listens to changes in the appropriate store to re-render
// - calls `load` to fetch the latest version of the component when initially mounted

export default class extends React.Component {
  static defaultProps = { bindEvent: 'change' };

  static displayName = 'LoadableItem';

  static propTypes = {
      id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
      ]).isRequired,
      loadingMessage: PropTypes.string,
      options: PropTypes.object,
      store: PropTypes.object.isRequired,
      actions: PropTypes.object.isRequired,
      renderItem: PropTypes.func.isRequired,
      isLoadingOrLoad: PropTypes.func,
      load: PropTypes.func,
      renderLoading: PropTypes.func,
      renderError: PropTypes.func,
      update: PropTypes.func,
      isLoaded: PropTypes.bool,
      isLoading: PropTypes.bool,
      bindEvent: PropTypes.string,
  };

  static defaultProps = {
      loadingMessage: 'Loading …',
  };

  UNSAFE_componentWillMount() {
      const { id, store, options } = this.props;
      if ((id != null) && !store.isNew(id, options)) { this.load(id, options); }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
      return this.reload(this.props, nextProps);
  }

  _isLoadingOrLoad = () => {
      const { id, options, store } = this.props;
      // if id is undefined, render as loading. loadableItem is waiting for id to be retrieved.
      if (id == null) { return true; }

      switch (false) {
          case !isEmpty(id): return true;
          case !store.get(id, options): return false;
          case !this.isLoading(id, options): return true;
          case !this.isLoaded(id, options): return false;
          case (!store.isUnknown(id, options) && !store.reload(id, options)): return true;
          default:
              return false;
      }
  };

  arePropsSame = (prevProps, nextProps) => {

      const propsToCheck = ['id', 'store', 'load', 'actions', 'options'];
      return isEqual(pick(prevProps, propsToCheck), pick(nextProps, propsToCheck));
  };

  isLoaded = (...args) => {
      let { isLoaded, store } = this.props;
      if (isLoaded == null) { ({ isLoaded } = store); }
      return isLoaded(...Array.from(args || []));
  };

  isLoading = (...args) => {
      let { isLoading, store } = this.props;
      if (isLoading == null) { ({ isLoading } = store); }
      return isLoading(...Array.from(args || []));
  };

  isLoadingOrLoad = (...args) => {
      let { isLoadingOrLoad } = this.props;

      if (isLoadingOrLoad == null) { isLoadingOrLoad = this._isLoadingOrLoad; }
      return isLoadingOrLoad(...Array.from(args || []));
  };

  load = (...args) => {
      let { load, actions } = this.props;
      if (load == null) { ({ load } = actions); }
      return load(...Array.from(args || []));
  };

  reload = (prevProps, nextProps) => {
      const { id, store, options } = nextProps;
      if (id == null) { return; }

      // Skip reloading if all the props are the same (the case in the Calendar for some reason)
      if (this.arePropsSame(prevProps, nextProps)) { return; }
      if (!store.isNew(id, options)) { this.load(id, options); }
  };

  render() {
      const { id, renderItem, store } = this.props;

      const propsForLoadable = pick(this.props, 'loadingMessage', 'store', 'update', 'bindEvent', 'renderLoading', 'renderError');

      return (
          <Loadable
              {...propsForLoadable}
              isLoading={this.isLoadingOrLoad}
              isLoaded={partial(this.isLoaded, id)}
              isFailed={partial(store.isFailed, id)}
              render={renderItem} />
      );
  }
}
