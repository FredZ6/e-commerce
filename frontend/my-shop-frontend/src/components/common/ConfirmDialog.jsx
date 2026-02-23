import { Fragment, createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ isOpen: false })

  const confirm = (options) =>
    new Promise((resolve) => {
      setState({
        isOpen: true,
        ...options,
        onConfirm: () => {
          resolve(true)
          setState({ isOpen: false })
        },
        onCancel: () => {
          resolve(false)
          setState({ isOpen: false })
        },
      })
    })

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog {...state} />
    </ConfirmContext.Provider>
  )
}

ConfirmProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}

function ConfirmDialog({
  isOpen,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel || (() => {})}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#1f2a40]/45 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-3 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-3 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-3xl border border-[color:var(--brand-line)] bg-white p-6 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff8eb]">
                    <ExclamationTriangleIcon className="h-6 w-6 text-[#a16f11]" aria-hidden="true" />
                  </div>
                  <div>
                    <Dialog.Title as="h3" className="text-2xl">
                      {title}
                    </Dialog.Title>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--brand-muted)]">{message}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <button type="button" className="button-secondary" onClick={onCancel}>
                    {cancelText}
                  </button>
                  <button type="button" className="button-danger" onClick={onConfirm}>
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
}
