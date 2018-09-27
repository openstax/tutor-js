import React from 'react';
import Router from 'react-router-dom';
import { isArray, map } from 'lodash';
import { SpyMode } from 'shared';

import Courses from '../../models/courses-map';

import ChapterSectionType from './chapter-section-type';

import pluralize from 'pluralize';

pluralize.addIrregularRule(' has', ' have');

class Statistics extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    roleId: React.PropTypes.string,
    section: ChapterSectionType.isRequired,
    displaying: React.PropTypes.string.isRequired,
  };

  getWorkedText = (role) => {
    const count = this.props.section.student_count;
    const total = this.props.section.questions_answered_count;
    switch (role) {
      case 'teacher':
        return `${pluralize(' students', count, true)} \
${pluralize(' has', count)} worked ${pluralize(' problems', total, true)}`;
      case 'student':
        return `${pluralize(' problems', total, true)} worked in this ${this.props.displaying}`;
      case 'teacher-student':
        return `${pluralize(' problems', total, true)} worked`;
    }
  };

  render() {
    // if roleid then we're on teacher-student view
    let role;
    if (this.props.roleId != null) {
      role = 'teacher-student';
    } else {
      // else use the course role of teacher or student
      role = Courses.get(this.props.courseId).primaryRole.type;
    }

    return (
      <div className='statistics'>
        <SpyMode.Content className="clue">
          <ul>
            {
              map(this.props.section.clue, (value, key) => {
                if (isArray(value)) {
                  value = value.join(' ');
                }
                return (
                  <li key={key}>
                    <strong>{key}</strong>: {String(value)}
                  </li>
                );
              })
            }
          </ul>
        </SpyMode.Content>
        <div className='amount-worked'>
          <span className='count'>
            {this.getWorkedText(role)}
          </span>
        </div>
      </div>
    );
  }
}

export default Statistics;
