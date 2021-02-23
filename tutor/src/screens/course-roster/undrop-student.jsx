import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { Icon } from 'shared';
import Name from '../../components/name';
import Student from '../../models/course/student';


@observer
export default
class UnDropStudentLink extends React.Component {

  static propTypes = {
    student: PropTypes.instanceOf(Student).isRequired,
  }

  @action.bound performUnDeletion() {
    this.props.student.unDrop();
  }

  inProgressMessage() {
    return (
      {
        title: 'Restoring student',
        body:  <span>
          <Icon type="spinner" spin={true} />
          {' In progress'}
        </span>,
      }
    );
  }

  popOverBody() {
    if (this.props.student.api.isPending) {
      return (
        <span><Icon type="spinner" spin />Restoring…</span>
      );
    }
    return (
      <Button
        className="undrop-student"
        onClick={this.performUnDeletion}
        variant="success"
      >
          Add <Name {...this.props.student} />?
      </Button>
    );
  }


  popOverTitle() {
    if (this.props.student.api.isPending) {
      return (
        <span><Icon type="spinner" spin />Restoring…</span>
      );
    }
    return (
      <span>
        Restore <Name {...this.props.student} />
      </span>
    );
  }

  confirmPopOver() {
    return (
      <Popover
        className="undrop-student"
        id={`drop-student-popover-${this.props.student.id}`}
      >
        <Popover.Title>
          {this.popOverTitle()}
        </Popover.Title>
        <Popover.Content>
          {this.popOverBody()}
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    return (
      <OverlayTrigger
        rootClose={true}
        trigger="click"
        placement="left"
        overlay={this.confirmPopOver()}>
        <a>
          <Icon type="user-plus" />
          {' Add Back to Active Roster'}
        </a>
      </OverlayTrigger>
    );
  }
}
