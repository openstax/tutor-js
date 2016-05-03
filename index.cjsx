{PinnedHeader, CardBody, PinnableFooter} = require './src/components/pinned-header-footer-card/sections'

module.exports = {
  ArbitraryHtmlAndMath:   require './src/components/html'
  AsyncButton:            require './src/components/buttons/async-button'
  Breadcrumb:             require './src/components/breadcrumb'
  CardBody,
  ChapterSectionMixin:    require './src/components/chapter-section-mixin'
  CloseButton:            require './src/components/buttons/close-button'
  Exercise:               require './src/components/exercise'
  ExerciseGroup:          require './src/components/exercise/group'
  ExerciseIdentifierLink: require './src/components/exercise/identifier-link'
  ExercisePreview:        require './src/components/exercise/preview'
  FreeResponse:           require './src/components/exercise/free-response'
  GetPositionMixin:       require './src/components/get-position-mixin'
  KeysHelper:             require './src/helpers/keys'
  PinnableFooter,
  PinnedHeader,
  PinnedHeaderFooterCard: require './src/components/pinned-header-footer-card'
  Question:               require './src/components/question'
  RefreshButton:          require './src/components/buttons/refresh-button'
  ResizeListenerMixin:    require './src/components/resize-listener-mixin'
  SmartOverflow:          require './src/components/smart-overflow'
  SpyMode:                require './src/components/spy-mode'
}
