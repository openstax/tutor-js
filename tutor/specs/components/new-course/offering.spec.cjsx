{React, SnapShot} = require '../helpers/component-testing'


find = require 'lodash/find'
cloneDeep = require 'lodash/cloneDeep'

OfferingTitle = require '../../../src/components/new-course/offering-title'
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
    wrapper = shallow(<OfferingTitle {...@props} />)
    expect(wrapper.is('[data-appearance="firefirefire"]')).to.be.true
    undefined

  it 'matches snapshot', ->
    component = SnapShot.create(
      <OfferingTitle {...@props} />
    )
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
