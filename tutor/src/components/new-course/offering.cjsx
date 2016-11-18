React = require 'react'
classnames = require 'classnames'
_ = require 'lodash'

{OfferingsStore} = require '../../flux/offerings'
CourseInformation = require '../../flux/course-information'
{ReactHelpers} = require 'shared'
{CourseChoiceContent, CourseChoice} = require './choice'

CourseOffering = React.createClass
  displayName: 'CourseOffering'
  propTypes:
    offeringId: React.PropTypes.string.isRequired
    className:  React.PropTypes.string
    children:   React.PropTypes.node
  render: ->
    {offeringId, children, className} = @props
    baseName = ReactHelpers.getBaseName(@)

    return null if _.isEmpty(OfferingsStore.get(offeringId))

    {appearance_code} = OfferingsStore.get(offeringId)
    info = CourseInformation[appearance_code] or {}

    <CourseChoice
      className={classnames(baseName, className)}
      data-appearance={appearance_code}
    >
      <CourseChoiceContent
        className="#{baseName}-content-wrapper"
        data-book-title={info.title or ''}
      >
        {children}
      </CourseChoiceContent>
    </CourseChoice>

module.exports = CourseOffering
