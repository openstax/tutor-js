{React} = require '../helpers/component-testing'

find = require 'lodash/find'
cloneDeep = require 'lodash/cloneDeep'

Offering = require '../../../src/components/new-course/offering'
OFFERINGS = require '../../../api/offerings'

{OfferingsStore, OfferingsActions} = require '../../../src/flux/offerings'
{NewCourseStore, NewCourseActions} = require '../../../src/flux/new-course'


describe 'CreateCourse: choosing offering', ->

  beforeEach ->
    OfferingsActions.loaded(OFFERINGS)
    @props =
      offeringId: OFFERINGS.items[0].id

  it 'doesn’t blow up when appearance code from offering is invalid', ->
    burntOfferings = cloneDeep(OFFERINGS)
    find(burntOfferings.items, id: @props.offeringId).appearance_code = 'firefirefire'
    OfferingsActions.loaded(burntOfferings)
    wrapper = shallow(<Offering {...@props} />)
    expect(wrapper.is('[data-appearance="firefirefire"]')).to.be.true
    expect(wrapper.find('CourseChoiceContent[data-book-title=""]')).to.have.length(1)
    undefined
