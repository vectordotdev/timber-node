export const metadata_delimiter = '@metadata'

const format = (message, metadata) => {
  const stringify = obj => {
    return JSON.stringify(obj || {})
  }

  return `${message} ${metadata_delimiter} ${stringify(metadata)}`
}

export default format
