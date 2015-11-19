DEFAULT_PATTERN = '{prefix}{base}{view}'

settings =
  views:
    profile: DEFAULT_PATTERN
    dashboard: DEFAULT_PATTERN
    task: DEFAULT_PATTERN
    progress: DEFAULT_PATTERN
    default: '{prefix}{base}'
    close: '{prefix}'

module.exports = settings