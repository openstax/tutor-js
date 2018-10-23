import React from 'react';

class TutorRequired extends React.Component {
  render() {
    return (
      <div className="hint required-hint">
        {'\
    Required field\
    '}
      </div>
    );
  }
}

class TutorUrl extends React.Component {
  render() {
    return (
      <div className="hint">
        {'\
    Please type in a url.\
    '}
      </div>
    );
  }
}

class TutorPeriodNameExists extends React.Component {
  render() {
    return (
      <div className="hint">
        {'\
    Name already exists.\
    '}
      </div>
    );
  }
}

class TutorTimeIncorrectFormat extends React.Component {
  render() {
    return (
      <div className="hint">
        {'\
    Please type a time.\
    '}
      </div>
    );
  }
}

export { TutorRequired as required, TutorUrl as url, TutorPeriodNameExists as periodNameExists, TutorTimeIncorrectFormat as incorrectTime };
