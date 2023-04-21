const normalizeContent = (content) => {
  return Object.keys(content).reduce((acc, key) => {
    if (Array.isArray(content[key])) {
      acc[key] = content[key].map((item) => {
        const data = normalizeContent({ data: item })
        return data.data
      })
      return acc
    }

    if (typeof content[key] === 'object') {
      let normalisedFields = {}
      let normalisedSys = {}

      if (content[key].fields) {
        normalisedFields = normalizeContent(content[key].fields)
      }

      if (content[key].sys) {
        normalisedSys = normalizeContent(content[key].sys)
      }

      acc[key] = { ...normalisedFields, ...normalisedSys, ...content[key] }

      return acc
    }

    acc[key] = content[key]
    return acc
  }, {})
}

module.exports = normalizeContent
