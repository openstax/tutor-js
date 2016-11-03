React = require 'react'

LoadableItem = require '../loadable-item'

{OfferingsStore, OfferingsActions} = require '../../flux/offerings'

Wizard = require './wizard'


NewCourse = React.createClass

  render: ->
    <div className="new-course">
          <LoadableItem
            id={'all'}
            store={OfferingsStore}
            actions={OfferingsActions}
            renderItem={-> <Wizard />}
          />
    </div>



module.exports = NewCourse
