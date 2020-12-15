
export const visitPage = async (page, path) => {
  const url = `${testConfig.URL}${path}`
  return await page.goto(url)
}
