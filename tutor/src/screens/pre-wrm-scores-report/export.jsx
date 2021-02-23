import PropTypes from 'prop-types';
import React from 'react';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
import TourAnchor from '../../components/tours/anchor';
import { Icon } from 'shared';
import Course from '../../models/course';
import Export from '../../models/jobs/scores-export';

@observer
export default
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
    return <span>Export all scores as spreadsheet</span>;
  }

  render() {
    return (
      <TourAnchor className="job scores-export" id="scores-export-button">
        <Icon
          type="download"
          disabled={this.scoresExport.isPending}
          onClick={this.startExport}
        />
        {this.message}
      </TourAnchor>
    );
  }

}
