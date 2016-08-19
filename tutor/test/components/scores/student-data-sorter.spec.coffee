{Testing, expect, _} = require '../helpers/component-testing'

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
    names = _.pluck(@students.sort(StudentDataSorter(@args)), 'last_name')
    expect(names).to.deep.equal([
      'Angstrom', 'Bloom', 'Glass', 'Hackett', 'Jaskolski', 'Kirlin', 'Lowe', 'Reilly', 'Tromp'
    ])

  it 'can sort by name desc', ->
    @args.sort.asc = false
    names = _.pluck(@students.sort(StudentDataSorter(@args)), 'last_name')
    expect(names).to.deep.equal([
      'Tromp', 'Reilly', 'Lowe', 'Kirlin', 'Jaskolski', 'Hackett', 'Glass', 'Bloom', 'Angstrom'
    ])

  it 'can sort by homework score', ->
    @args.sort.key = 2
    @args.sort.asc = false
    scores = _.map(@students.sort(StudentDataSorter(@args)), (s) ->
      s.data[0].correct_on_time_exercise_count)
    expect(scores).to.deep.equal([4, 2, 2, 1, 0, 0, 0, 0, 0])

  it 'can sort by reading progress', ->
    @args.sort.key = 3
    @args.sort.asc = false
    steps = _.map(@students.sort(StudentDataSorter(@args)), (s) ->
      s.data[1].completed_on_time_step_count)
    expect(steps).to.deep.equal([29, 4, 4, 0, 0, 0, 0, 0, 0])
    expect(_.first(steps)).to.equal(29)
    expect(_.last(steps)).to.equal(0)
