React = require 'react'
classnames = require 'classnames'

{OfferingsStore} = require '../../flux/offerings'
CourseInformation = require '../../flux/course-information'
{getReactBaseName} = require '../../helpers/react'

CourseOffering = React.createClass
  displayName: 'CourseOffering'
  render: ->
    {offeringId, children, className} = @props
    baseName = getReactBaseName(@)

    {appearance_code}  = OfferingsStore.get(offeringId)
    {title}   = CourseInformation[appearance_code]

    <div
      className={classnames(baseName, className)}
      data-appearance={appearance_code}
    >
      <div
        className="#{baseName}-content-wrapper"
        data-book-title={title}
      >
        <div className="#{baseName}-content">{children}</div>
      </div>
    </div>

module.exports = CourseOffering
