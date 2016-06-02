Roster = require './roster'
_ = require 'underscore'

COACH_COMMON_ELEMENTS =
  addLink:
    linkText: 'Add Section'
  deleteLink:
    linkText: 'Delete Section'
  changeLink:
    linkText: 'Change Section'
  getStudentEnrollmentCodeLink:
    css: '.show-enrollment-code'

COACH_COMMON_POPUP_ELEMENTS =
  codeContent:
    css: '.teacher-enrollment-code-modal .enrollment-code'
  codeMessage:
    css: '.teacher-enrollment-code-modal .enrollment-code textarea'


class CCPeriodEditModal extends Roster.PeriodEditModal

  constructor: (test, testElementLocator) ->
    super(test, testElementLocator)

    _.each COACH_COMMON_POPUP_ELEMENTS, @setCommonElement



class CCRoster extends Roster
  @PeriodEditModal: CCPeriodEditModal

  constructor: (test, testElementLocator) ->
    super(test, testElementLocator)

    _.each COACH_COMMON_ELEMENTS, @setCommonElement


module.exports = CCRoster
