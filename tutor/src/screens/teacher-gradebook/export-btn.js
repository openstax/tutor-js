import PropTypes from 'prop-types';
import React from 'react';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Icon, AsyncButton } from 'shared';
import Course from '../../models/course';
import Export from '../../models/jobs/scores-export';

export default
@observer
class ScoresExport extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  @computed get scoresExport() {
    return Export.forCourse(this.props.course);
  }

  @action.bound startExport() {
    this.scoresExport.create();
  }

  @computed get message() {
    if (this.scoresExport.isPending) {
      return <span className="busy">Exporting spreadsheet…</span>;
    }
    const { lastExportedAt } = this.scoresExport;
    if (lastExportedAt) {
      return <span>Last exported: {lastExportedAt}</span>;
    }
    return null;
  }

  render() {
    const popover = (
      <Popover className="gradebook-popover">
        <p>Download score sheet as an Excel file</p>
      </Popover>
    );

    return (
      <>
        <OverlayTrigger placement="bottom" overlay={popover} trigger="hover">
          <AsyncButton
            variant='plain'
            isWaiting={this.scoresExport.isPending}
            waitingText="Exporting..."
            onClick={this.startExport}
            data-test-id="export-gradebook">
            <Icon type="download" />
          </AsyncButton>
        </OverlayTrigger>
      </>
    );
  }

}