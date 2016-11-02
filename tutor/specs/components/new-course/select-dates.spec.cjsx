{React, sinon, shallow} = require '../helpers/component-testing'

SelectDates = require '../../../src/components/new-course/select-dates'
OFFERINGS = require '../../../api/offerings'

{OfferingsStore, OfferingsActions} = require '../../../src/flux/offerings'
{NewCourseStore, NewCourseActions} = require '../../../src/flux/new-course'

OFFERING_ID = '1'

describe 'CreateCourse: Selecting course dates', ->

  beforeEach ->
    OfferingsActions.loaded(OFFERINGS)
    NewCourseActions.set(offering_id: OFFERING_ID)

  it 'it sets state when date row is clicked', ->
    wrapper = shallow(<SelectDates />)
    expect(NewCourseStore.get('period')).not.to.exist
    wrapper.find('tr').at(0).simulate('click')
    expect(NewCourseStore.get('term')).to.deep.equal(
      OfferingsStore.get(OFFERING_ID).active_term_years[0]
    )
    undefined
