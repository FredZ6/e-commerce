import PropTypes from 'prop-types'

export default function LoadingSpinner({ size = 'default', fullScreen = false }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12',
  }

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 border-indigo-500 ${sizeClasses[size]}`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        {spinner}
      </div>
    )
  }

  return <div className="flex justify-center items-center">{spinner}</div>
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  fullScreen: PropTypes.bool,
} 