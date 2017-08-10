import React from 'react';
import { Panel } from 'react-bootstrap';

const EmptyPanel = ({ children = 'No assignments this week', title }) => {
  return (
    <Panel className="empty" header={title}>
      {children}
    </Panel>
  );
};

EmptyPanel.propTypes = {
  children: React.PropTypes.node,
  title: React.PropTypes.string,
};

export default EmptyPanel;
