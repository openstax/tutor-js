{expect} = require 'chai'
_ = require 'underscore'

PeriodHelper = require '../../src/helpers/period'

sortPeriods = [
  [
    {
      name: '0th'
    }
    {
      name: 0
    }
    {
      name: '1st'
    }
    {
      name: '1th'
    }
    {
      name: 1
    }

    {
      name: 2
    }
    {
      name: '8th'
    }
    {
      name: '9th'
    }
    {
      name: '10th'
    }
    {
      name: '10th'
    }
    {
      name: 10.25
    }
    {
      name: '10.5th'
    }
    {
      name: '12.245th'
    }
    {
      name: '12.246th'
    }
    {
      name: 90
    }
    {
      name: '100th'
    }
    {
      name: 'Block B'
    }
    {
      name: 'Block b'
    }
    {
      name: 'monKeys'
    }
    {
      name: 'monkeys'
    }
    {
      name: 'th'
    }
  ]
]


describe 'Period helpers', ->

  it 'helps sort strings and numbers', ->
    _.each(sortPeriods, (periods) ->
      randoedPeriods = _.shuffle(periods)
      sortedByFunction = PeriodHelper.sort(randoedPeriods)

      expect(_.pluck(sortedByFunction, 'name').join()).to.equal(_.pluck(periods, 'name').join())
    )
