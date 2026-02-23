import { Fragment, createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type })
    if (duration) {
      setTimeout(() => {
        setToast(null)
      }, duration)
    }
  }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer toast={toast} setToast={setToast} />
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

function ToastContainer({ toast, setToast }) {
  const config = {
    success: {
      icon: <CheckCircleIcon className="h-6 w-6 text-[color:var(--brand-success)]" />,
      style: 'border-[#ccefdc] bg-[#f2fcf7]',
      title: 'Success',
    },
    error: {
      icon: <XCircleIcon className="h-6 w-6 text-[color:var(--brand-danger)]" />,
      style: 'border-[#f3cdcd] bg-[#fff4f4]',
      title: 'Error',
    },
    warning: {
      icon: <ExclamationCircleIcon className="h-6 w-6 text-[#ab780f]" />,
      style: 'border-[#efdfbe] bg-[#fff9ee]',
      title: 'Notice',
    },
  }

  const current = config[toast?.type] || config.success

  return (
    <div aria-live="assertive" className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={!!toast}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`pointer-events-auto w-full max-w-sm rounded-2xl border p-4 shadow-xl ${current.style}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{current.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--brand-muted)]">{current.title}</p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--brand-ink)]">{toast?.message}</p>
              </div>
              <button
                type="button"
                className="inline-flex rounded-full p-1 text-[color:var(--brand-muted)] transition hover:bg-white/60 hover:text-[color:var(--brand-ink)]"
                onClick={() => setToast(null)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}

ToastContainer.propTypes = {
  toast: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error', 'warning']),
  }),
  setToast: PropTypes.func.isRequired,
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
