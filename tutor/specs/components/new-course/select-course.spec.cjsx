{React, SnapShot} = require '../helpers/component-testing'

jest.mock('../../../src/helpers/router')
Router = require '../../../src/helpers/router'

SelectCourse = require '../../../src/components/new-course/select-course'
OFFERINGS = require '../../../api/offerings'

{OfferingsActions} = require '../../../src/flux/offerings'
{NewCourseStore, NewCourseActions} = require '../../../src/flux/new-course'

CourseInformation = require '../../../src/flux/course-information'

describe 'CreateCourse: Selecting course subject', ->

  beforeEach ->
    NewCourseActions.set({offering_id: null})
    OfferingsActions.loaded(OFFERINGS)

  it 'it sets offering_id when clicked', ->
    wrapper = mount(<SelectCourse />)
    expect(NewCourseStore.get('offering_id')).not.to.exist
    wrapper.find('.list-group-item').at(0).simulate('click')
    expect(NewCourseStore.get('offering_id')).to.exist

    undefined

  it 'renders titles', ->
    wrapper = mount(<SelectCourse />)

    for offering, i in OFFERINGS
      offeringItemSelector = "[data-book-title='#{CourseInformation.forAppearanceCode(OFFERINGS.items[index].appearance_code).title}']"
      expect(wrapper.find(offeringItemSelector)).to.have.length(1)

    undefined

  it 'only skips if offering id is set', ->
    Router.currentParams.mockReturnValue({sourceId: 1})
    expect(SelectCourse.shouldSkip()).to.be.false
    NewCourseActions.set({offering_id: 22})
    expect(SelectCourse.shouldSkip()).to.be.true
    undefined


  it 'matches snapshot', ->
    component = SnapShot.create(
      <SelectCourse />
    )
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
