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
  let normalisedFile = {}

  if (content.fields) {
    normalisedFields = normalizeContent(content.fields)

    if (normalisedFields.file) {
      normalisedFile = {
        ...normalisedFile,
        ...normalizeContent(normalisedFields.file),
      }
    }
  }

  if (content.sys) {
    normalisedSys = normalizeContent(content.sys)
  }

  if (content.file) {
    normalisedFile = { ...normalisedFile, ...normalizeContent(content.file) }
  }

  return {
    ...normalisedFields,
    ...normalisedSys,
    ...normalisedFile,
    ...content,
  }
}

module.exports = normalizeContent
