import PropTypes from 'prop-types';
import React, { createRef } from 'react';
import { computed, action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Overlay, Button, Popover } from 'react-bootstrap';
import { Icon } from 'shared';
import Course from '../../models/course';
import Export from '../../models/jobs/scores-export';

export default
@observer
class ScoresExport extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  @observable
  showPopover = false;

  constructor(props) {
    super(props);
    this.overlay = createRef();
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
    return (
      <>
        <Button
          ref={this.overlay}
          disabled={this.scoresExport.isPending}
          onClick={this.startExport}
          onMouseEnter={() => 
            this.showPopover = true
          }
          onMouseLeave={() => 
            this.showPopover = false
          }
          variant='plain'
          className={`${this.showPopover ? 'gradebook-btn-selected' : ''}`}>
          <Icon type="download" />
        </Button>
        <Overlay target={this.overlay.current} placement="bottom" show={this.showPopover}>
          <Popover className="gradebook-popover">
            <p>Download score sheet as CSV file</p>
          </Popover>
        </Overlay>
      </>
    );
  }

}
