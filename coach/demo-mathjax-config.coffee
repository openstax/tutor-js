$ = require 'jquery'

# ripped from webview
MATHJAX_CONFIG =
  jax: [
    'input/MathML',
    'input/TeX',
    'input/AsciiMath',
    'output/NativeMML',
    'output/HTML-CSS'
  ],
  extensions: [
    'asciimath2jax.js',
    'tex2jax.js',
    'mml2jax.js',
    'MathMenu.js',
    'MathZoom.js'
  ],
  tex2jax: {
    inlineMath: [
      ['[TEX_START]', '[TEX_END]'],
      ['\\(', '\\)']
    ]
  },
  TeX: {
    extensions: [
      'AMSmath.js',
      'AMSsymbols.js',
      'noErrors.js',
      'noUndefined.js'
    ],
    noErrors: {
      disabled: true
    }
  },
  AsciiMath: {
    noErrors: {
      disabled: true
    }
  }

typesetMath = (node) ->
  # straight up copy of webview's mathjax fn
  $mathElements = $(node).find('[data-math]:not(.math-rendered)')

  $mathElements.each (iter, element) ->

    $element = $(element)
    formula = $element.data('math')

    mathTex = "[TEX_START]#{formula}[TEX_END]"
    $element.text(mathTex)

    # Moved adding to MathJax queue here. Means the queue gets pushed onto more (once per math element),
    # but what it trys to parse for matching math is WAY less than the whole page.
    MathJax.Hub.Queue(['Typeset', MathJax.Hub], $element[0])
    MathJax.Hub.Queue( ->
      $element[0].classList.add('math-rendered')
    )


startMathJax = ->

  configuredCallback = ->
    window.MathJax.Hub.Configured()

  if window.MathJax?.Hub
    window.MathJax.Hub.Config(MATHJAX_CONFIG)
    # Does not seem to work when passed to Config
    window.MathJax.Hub.processSectionDelay = 0
    configuredCallback()
  else
    # If the MathJax.js file has not loaded yet:
    # Call MathJax.Configured once MathJax loads and
    # loads this config JSON since the CDN URL
    # says to `delayStartupUntil=configured`
    MATHJAX_CONFIG.AuthorInit = configuredCallback

    window.MathJax = MATHJAX_CONFIG

module.exports = {typesetMath, startMathJax}
