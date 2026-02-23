import PropTypes from 'prop-types'

export default function ErrorMessage({ message }) {
  return (
    <section className="section-frame border-[#f2cccc] bg-[#fff5f5] p-5 text-[color:var(--brand-danger)]">
      <p className="text-xs font-semibold uppercase tracking-[0.12em]">Request failed</p>
      <p className="mt-2 text-sm">{message}</p>
    </section>
  )
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
}
