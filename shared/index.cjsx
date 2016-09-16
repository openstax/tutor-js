{PinnedHeader, CardBody, PinnableFooter} = require './src/components/pinned-header-footer-card/sections'
{Exercise, ExerciseWithScroll} = require './src/components/exercise'
{ExControlButtons} = require './src/components/exercise/controls'
{TwoStepHelp} = require './src/components/exercise/two-step-help-mixin'

require './src/helpers/polyfills'

module.exports = {
  ArbitraryHtmlAndMath:   require './src/components/html'
  AsyncButton:            require './src/components/buttons/async-button'
  BootstrapURLs:          require './src/model/urls'
  ChangeStudentIdForm:    require './src/components/change-student-id-form'
  UiSettings:             require './src/model/ui-settings'
  Networking:             require './src/model/networking'
  Breadcrumb:             require './src/components/breadcrumb'
  CardBody,
  ChapterSectionMixin:    require './src/components/chapter-section-mixin'
  CloseButton:            require './src/components/buttons/close-button'

  Exercise,
  ExControlButtons,
  TwoStepHelp,
  ExerciseGroup:          require './src/components/exercise/group'
  ExerciseIdentifierLink: require './src/components/exercise-identifier-link'
  ExerciseHelpers:        require './src/model/exercise'
  ExercisePreview:        require './src/components/exercise-preview'
  ExerciseWithScroll,

  FreeResponse:           require './src/components/exercise/free-response'
  GetPositionMixin:       require './src/components/get-position-mixin'
  ScrollToMixin:          require './src/components/scroll-to-mixin'
  KeysHelper:             require './src/helpers/keys'
  NotificationActions:    require './src/model/notifications'
  NotificationsBar:       require './src/components/notifications/bar'
  PinnableFooter,
  PinnedHeader,
  PinnedHeaderFooterCard: require './src/components/pinned-header-footer-card'
  Question:               require './src/components/question'
  RefreshButton:          require './src/components/buttons/refresh-button'
  ResizeListenerMixin:    require './src/components/resize-listener-mixin'
  SmartOverflow:          require './src/components/smart-overflow'
  SpyMode:                require './src/components/spy-mode'
  SuretyGuard:            require './src/components/surety-guard'
}
