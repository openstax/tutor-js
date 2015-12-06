DEFAULT_PATTERN = '{prefix}{base}{view}'

settings =
  views:
    profile: DEFAULT_PATTERN
    dashboard: DEFAULT_PATTERN
    task: DEFAULT_PATTERN
    registration: DEFAULT_PATTERN
    progress: DEFAULT_PATTERN
    loading: DEFAULT_PATTERN
    login: DEFAULT_PATTERN
    default: '{prefix}{base}'
    close: '{prefix}'

module.exports = settings
