import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExportCSV, useClearAllData } from '../../hooks/useDatabase'
import { useApp } from '../../contexts/AppContext'
import { Button, Input, Modal } from '../common'

export function DataSection() {
  const { t } = useTranslation()
  const exportCSV = useExportCSV()
  const clearAllData = useClearAllData()
  const { showToast } = useApp()

  const [showClearModal, setShowClearModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleExport = () => {
    exportCSV.mutate(undefined, {
      onSuccess: () => {
        showToast('Data exported successfully', 'success')
      },
      onError: () => {
        showToast(t('errors.exportFailed'), 'error')
      },
    })
  }

  const handleClearData = () => {
    if (confirmText === 'DELETE') {
      clearAllData.mutate(undefined, {
        onSuccess: () => {
          showToast('All data cleared', 'success')
          setShowClearModal(false)
          setConfirmText('')
        },
        onError: () => {
          showToast(t('errors.saveFailed'), 'error')
        },
      })
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('settings.data')}
        </h2>

        <div className="space-y-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleExport}
            disabled={exportCSV.isPending}
          >
            📥 {t('settings.exportCSV')}
          </Button>

          <Button
            variant="danger"
            fullWidth
            onClick={() => setShowClearModal(true)}
          >
            🗑️ {t('settings.clearAllData')}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => {
          setShowClearModal(false)
          setConfirmText('')
        }}
        title={t('settings.clearAllData')}
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              {t('settings.clearWarning')}
            </p>
          </div>

          <Input
            label={t('settings.clearConfirm')}
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowClearModal(false)
                setConfirmText('')
              }}
              fullWidth
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleClearData}
              fullWidth
              disabled={confirmText !== 'DELETE' || clearAllData.isPending}
            >
              {clearAllData.isPending ? 'Deleting...' : t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
