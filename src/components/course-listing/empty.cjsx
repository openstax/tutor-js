React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'


EmptyCourses = React.createClass

  render: ->
    <BS.Panel
      className='-course-list-empty'
    >
      <p className="lead">
        We cannot find an OpenStax course associated with your account.
      </p>
      <p className="lead">
        <a target="_blank" href="https://openstaxcnx.zendesk.com/hc/en-us/articles/207705436">
          Concept Coach Students.  Get help >
        </a>
      </p>
      <p className="lead">
        <a target="_blank" href="https://openstaxcnx.zendesk.com/hc/en-us/articles/208050973">
          Concept Coach Faculty.  Get help >
        </a>
      </p>
      <p className="lead">
        <a target="_blank" href="https://openstaxcnx.zendesk.com/hc/en-us/articles/208051053">
          Tutor Students.  Get help >
        </a>
      </p>
    </BS.Panel>


module.exports = EmptyCourses
