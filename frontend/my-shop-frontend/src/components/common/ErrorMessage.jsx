import PropTypes from 'prop-types'

export default function ErrorMessage({ message }) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="text-sm text-red-700">{message}</div>
    </div>
  )
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
} 