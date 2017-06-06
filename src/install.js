import connect from './connect'

function install({ transport }) {
  if (!transport) {
    throw Error('No transport was provided.')
  }
  connect(transport)
}

export default install
