
export const visitPage = async (page, path) => {
  const url = `${testConfig.URL}${path}`
  return await page.goto(url)
}

export const setTimeouts = async () => {
  // jest timeout needs to be longer than the playwright context
  // if not, jest will time out and playwright won't be able to log failure
  // set playwright context to 10 and jest to 15 seconds
  jest.setTimeout(15 * 1000)
  context.setDefaultTimeout(10*1000)
}
