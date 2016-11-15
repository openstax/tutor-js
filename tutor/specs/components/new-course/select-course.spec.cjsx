{React} = require '../helpers/component-testing'

SelectCourse = require '../../../src/components/new-course/select-course'
OFFERINGS = require '../../../api/offerings'

{OfferingsActions} = require '../../../src/flux/offerings'
{NewCourseStore} = require '../../../src/flux/new-course'

CourseInformation = require '../../../src/flux/course-information'

describe 'CreateCourse: Selecting course subject', ->

  beforeEach ->
    OfferingsActions.loaded(OFFERINGS)

  it 'it sets offering_id when clicked', ->
    wrapper = shallow(<SelectCourse />)
    expect(NewCourseStore.get('offering_id')).not.to.exist
    wrapper.find('tr').at(0).simulate('click')
    expect(NewCourseStore.get('offering_id')).to.exist
    undefined

  it 'renders titles', ->
    wrapper = shallow(<SelectCourse />)
    wrapper.find('tr').forEach (row, index) ->
      title = row.find('td').at(1).text()
      expect(title).not.to.be.empty
      expect(title).to.equal(
        CourseInformation[ OFFERINGS.items[index].appearance_code ].title
      )
    undefined
