# Writing a spec

With the UI helper, a spec can look like this:

```coffee
# loading in helpers
Helpers = require './helpers'
{describe} = Helpers
{expect} = require 'chai'

# set constants
TEACHER_USERNAME = 'teacher01'
CC_HELP_LINK = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach'

# use loaded describe to run specs
describe 'Concept Coach Dashboard', ->

  beforeEach ->

    # load the necessary UI helpers for this spec and set them on @
    # for easy access within tests
    @user = new Helpers.User(@)
    @courseSelect = new Helpers.CourseSelect(@)
    @conceptCoach = new Helpers.CCDashboard(@)
    @scores = new Helpers.Scores(@)

    # perform other repetitive actions needed for before each test in this spec
    @user.login(TEACHER_USERNAME)
    @courseSelect.goTo('CONCEPT_COACH')

  @it 'Can switch periods (readonly)', ->
    # access helper convenience methods/actions right off of the helper
    @conceptCoach.switchPeriods()

    # each of the helper methods returns a selenium-style promise
    @conceptCoach.getTabPeriod().then (periodId) =>
      @conceptCoach.getDashboardPeriod().then (reactId) ->
        expect(reactId.indexOf("period-nav-#{periodId}")).is.not.equal(-1)

  @it 'Can go to detailed scores (readonly)', ->
    @conceptCoach.clickViewScores()

    # all helpers have a `waitUntilLoaded` function that will
    # wait for the component to finish loading
    @scores.waitUntilLoaded()

  @it 'Can display correct help link (readonly)', ->
    # Go to the concept coach dashboard
    @user.openHamburgerMenu()
    @conceptCoach.getHelpLinkHref().then (href) ->
      expect(href.indexOf(CC_HELP_LINK)).is.not.equal(-1)

    @conceptCoach.getHelpLinkTarget().then (target) ->
      expect(target.toUpperCase().indexOf('_BLANK')).is.not.equal(-1)
```

# Learn More

* [How to write/edit helpers, advanced](./helpers/ui/README.md)
* [Helpers Overview](./helpers/README.md)
