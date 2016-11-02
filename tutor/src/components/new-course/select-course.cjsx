React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

{OfferingsStore} = require '../../flux/offerings'


KEY = "offering_id"

SelectCourse = React.createClass
  statics:
    title: "Choose your Tutor course"

  onSelect: (id) ->
    NewCourseActions.set({"#{KEY}": id})

  render: ->
    <BS.Table className="offerings" striped bordered>
      <tbody>
        {for offering in OfferingsStore.all()
          <tr key={offering.id} data-appearance={offering.appearance_code}
            className={classnames({selected: NewCourseStore.get(KEY) is offering.id})}
            onClick={partial(@onSelect, offering.id)}
          >
            <td></td>
            <td>{OfferingsStore.getTitle(offering.id)}</td>
          </tr>}
      </tbody>
    </BS.Table>


module.exports = SelectCourse
