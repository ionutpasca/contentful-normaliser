const normalizeContent = (content) => {
  if (Array.isArray(content)) {
    return content.map((item) => normalizeContent(item))
  }

  if (typeof content !== 'object') {
    return content
  }

  if (
    Object.keys(content.fields || {})?.length &&
    Object.keys(content.sys || {})?.length
  ) {
    return normaliseObject(content)
  }

  return Object.keys(content).reduce((acc, key) => {
    if (Array.isArray(content[key])) {
      acc[key] = content[key].map((item) => {
        return normalizeContent(item)
      })

      return acc
    }

    if (typeof content[key] === 'object') {
      acc[key] = { ...normaliseObject(content[key]) }

      return acc
    }

    acc[key] = content[key]
    return acc
  }, {})
}

const normaliseObject = (content) => {
  let normalisedFields = {}
  let normalisedSys = {}

  if (content.fields) {
    normalisedFields = normalizeContent(content.fields)
  }

  if (content.sys) {
    normalisedSys = normalizeContent(content.sys)
  }

  return { ...normalisedFields, ...normalisedSys, ...content }
}

module.exports = normalizeContent
