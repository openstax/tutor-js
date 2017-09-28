import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
import TourAnchor from '../tours/anchor';
import Icon from '../icon';
import Course from '../../models/course';
import Export from '../../models/jobs/scores-export';
import LoadingScreen from '../loading-screen';

@observer
export default class ScoresExport extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  @computed get scoresExport() {
    return Export.forCourse(this.props.course);
  }

  @action.bound startExport() {
    this.scoresExport.create();
  }

  render() {
    const { scoresExport } = this;

    return (
      <TourAnchor className="scores-export" id="scores-export-button">
        <Button
          onClick={this.startExport}
        >
          <Icon type="download" />
        </Button>
        Last exported: {scoresExport.lastExportedAt}
        <iframe id="downloadExport" src={scoresExport.url} />
        <Modal show={scoresExport.isPending}>
          <Modal.Body>
            <LoadingScreen message="Exporting all scores as a spreadsheet…" />
          </Modal.Body>
        </Modal>
      </TourAnchor>
    );
  }

}
