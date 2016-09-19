{Testing, expect, _} = require '../helpers/component-testing'

{TimeActions, TimeStore} = require '../../../src/flux/time'

NameCell = require '../../../src/components/scores/name-cell'


describe 'Student Scores Name Cell', ->

  beforeEach ->
    @props =
      courseId: '1'
      isConceptCoach: false
      student:
        first_name: 'Molly'
        last_name: 'Bloom'
        role: 'student'
        student_identifier: '123456'

  it 'renders with name and id', ->
    Testing.renderComponent( NameCell, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.student-name').textContent).to.equal('Molly Bloom')
      expect(dom.querySelector('.student-id').textContent).to.equal('123456')
      expect(dom.tagName).to.equal('A')

  it 'does not render with link for CC', ->
    @props.isConceptCoach = true
    Testing.renderComponent( NameCell, props: @props ).then ({dom}) ->
      expect(dom.tagName).to.equal('DIV')
      expect(dom.querySelector('.student-name').textContent).to.equal('Molly Bloom')
