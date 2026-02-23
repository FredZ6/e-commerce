import PropTypes from 'prop-types'

export default function LoadingSpinner({ size = 'default', fullScreen = false }) {
  const sizeClasses = {
    small: 'h-5 w-5 border-2',
    default: 'h-10 w-10 border-[3px]',
    large: 'h-14 w-14 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`animate-spin rounded-full border-[color:var(--brand-line)] border-t-[color:var(--brand-accent)] ${sizeClasses[size]}`}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--brand-muted)]">Loading</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#f5f3ef]/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return <div className="flex min-h-24 items-center justify-center">{spinner}</div>
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  fullScreen: PropTypes.bool,
}
