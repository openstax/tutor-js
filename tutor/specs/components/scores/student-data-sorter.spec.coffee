{Testing, _} = require '../helpers/component-testing'

StudentDataSorter = require '../../../src/components/scores/student-data-sorter'

DATA = require '../../../api/courses/1/performance'


describe 'Student Scores Data Sorter', ->

  beforeEach ->
    @students = _.shuffle(DATA[0].students)

    @args =
      sort:
        key: 'name'
        asc: true
        dataType: 'score'
      displayAs: 'percentage'

  it "defaults to sorting by name", ->
    names = _.pluck(_.sortBy(@students, StudentDataSorter(@args)), 'last_name')
    expect(names).to.deep.equal([
      'Angstrom', 'Bloom', 'Glass', 'Hackett', 'Jaskolski', 'Kirlin', 'Lowe', 'Reilly', 'Tromp'
    ])
    undefined

  it 'can sort by homework score', ->
    @args.sort.key = 0
    @args.sort.asc = false
    scores = _.map(_.sortBy(@students, StudentDataSorter(@args)), (s) ->
      s.data[0].correct_on_time_exercise_count)
    expect(scores).to.deep.equal([0, 0, 0, 0, 0, 1, 2, 2, 4])
    undefined

  it 'can sort by reading progress', ->
    @args.sort.key = 1
    @args.sort.asc = false
    steps = _.map(_.sortBy(@students, StudentDataSorter(@args)), (s) ->
      s.data[1].completed_on_time_step_count)
    expect(steps).to.deep.equal([ 0, 0, 0, 0, 0, 0, 4, 4, 29])
    expect(_.first(steps)).to.equal(0)
    expect(_.last(steps)).to.equal(29)
    undefined

  it 'sorts external events', ->
    @args.sort.key = 2
    @args.sort.asc = false
    steps = _.map(_.sortBy(@students, StudentDataSorter(@args)), (s) ->
      s.data[2].status)
    expect(_.first(steps)).to.equal('completed')
    expect(_.last(steps)).to.equal('not_started')
    expect(steps).to.deep.equal([
      'completed', 'completed', 'not_started', 'not_started',
      'not_started', 'not_started', 'not_started', 'not_started', 'not_started'])
    undefined
