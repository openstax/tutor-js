import { React, cn, useState, useHistory, useEffect } from 'vendor';
import { isNil, extend, partial } from 'lodash';
import Router from '../helpers/router';
import PropTypes from 'prop-types';
import qs from 'qs';

// Used to cancel router transitions the same way an onClick event is
class FakeEvent {
  static initClass() {
    this.prototype._isDefaultPrevented = false;
  }
  preventDefault() { return this._isDefaultPrevented = true; }
  isDefaultPrevented() {  return this._isDefaultPrevented; }
}
FakeEvent.initClass();

// Renders ONLY the list of tabs with chilren inline with the tabs
// Usefull for rendering controls beside the Tabs

const getTab = (window) => Router.currentQuery({ window }).tab;

const Tabs = ({
  tabs,
  children, className, onSelect,
  initialActive = 0,
  windowImpl = window,
}) => {
  const history = useHistory();

  const [activeIndex, setActiveIndex] = useState(
    isNil(getTab(windowImpl)) ? initialActive : parseInt(getTab(windowImpl))
  );

  const selectTabIndex = (tab) => {
    tab = Number(tab);
    const query = extend(Router.currentQuery(windowImpl), { tab });
    history.push(
      windowImpl.location.pathname + '?' + qs.stringify(query)
    );
    setActiveIndex(tab);
  };

  useEffect(() => {
    if (activeIndex != initialActive) {
      const ev = new FakeEvent;
      onSelect(activeIndex, ev);
      if (ev.isDefaultPrevented()) {
        selectTabIndex(this.activeIndex);
      }
    }
  }, [initialActive]);

  const onTabClick = (activeIndex, ev) => {
    onSelect(activeIndex, ev);
    if (!ev.isDefaultPrevented()) {
      selectTabIndex(activeIndex);
    }
    ev.preventDefault();
  };

  return (
    <nav className={cn('tutor-tabs', className)}>
      <ul className="nav nav-tabs" role="tablist">
        {tabs.map((tab, index) => {
          const active = index === activeIndex;
          return (
            <li
              key={index}
              className={cn({ active })}
              aria-selected={active}
              role="tab"
            >
              <a
                href="#"
                onClick={partial(onTabClick, index)}
              >
                <h2>
                  {tab}
                </h2>
              </a>
            </li>
          );
        })}
      </ul>
      {children}
    </nav>
  );

};

Tabs.propTypes = {
  onSelect: PropTypes.func.isRequired,
  tabIndex: PropTypes.number,
  initialActive: PropTypes.number,
  params: PropTypes.object,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.oneOfType([ PropTypes.string, PropTypes.element ])
  ).isRequired,
  windowImpl: PropTypes.object,
  children: PropTypes.node,
};

export default Tabs;
