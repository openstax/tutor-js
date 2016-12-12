React = require 'react'
classnames = require 'classnames'
_ = require 'lodash'

{OfferingsStore} = require '../../flux/offerings'
CourseInformation = require '../../flux/course-information'
{ReactHelpers} = require 'shared'
Choice = require './choice'

CourseOfferingTitle = React.createClass
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
    {title} = CourseInformation.forAppearanceCode(appearance_code)
    <div
      className={classnames(baseName, className)}
      data-appearance={appearance_code}
    >
      <div className="contents">
        <div className="title">{title}</div>
        <div className="sub-title">{@props.children}</div>
      </div>
    </div>

module.exports = CourseOfferingTitle
