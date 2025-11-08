import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBaby, useUpdateBaby } from '../../hooks/useDatabase'
import { useApp } from '../../contexts/AppContext'
import { Button, Input } from '../common'
import { validateBabyName, validateBirthdate } from '../../utils/validation'

export function BabyProfileSection() {
  const { t } = useTranslation()
  const { data: baby } = useBaby()
  const updateBaby = useUpdateBaby()
  const { showToast } = useApp()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [errors, setErrors] = useState<{ name?: string; birthdate?: string }>({})

  const handleEdit = () => {
    if (baby) {
      setName(baby.name)
      setBirthdate(baby.birthdate)
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setErrors({})
  }

  const handleSave = () => {
    if (!baby) return

    const nameValidation = validateBabyName(name)
    const birthdateValidation = validateBirthdate(birthdate)

    if (!nameValidation.valid || !birthdateValidation.valid) {
      setErrors({
        name: nameValidation.error,
        birthdate: birthdateValidation.error,
      })
      return
    }

    updateBaby.mutate(
      { id: baby.id, name, birthdate },
      {
        onSuccess: () => {
          showToast('Profile updated successfully', 'success')
          setIsEditing(false)
          setErrors({})
        },
        onError: () => {
          showToast(t('errors.saveFailed'), 'error')
        },
      }
    )
  }

  if (!baby) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('settings.babyProfile')}
        </h2>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            {t('common.edit')}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Input
            label={t('settings.name')}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            error={errors.name}
            required
          />

          <Input
            label={t('settings.birthdate')}
            type="date"
            value={birthdate}
            onChange={(e) => {
              setBirthdate(e.target.value)
              setErrors((prev) => ({ ...prev, birthdate: undefined }))
            }}
            error={errors.birthdate}
            required
            max={new Date().toISOString().split('T')[0]}
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCancel} fullWidth>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} fullWidth disabled={updateBaby.isPending}>
              {updateBaby.isPending ? 'Saving...' : t('common.save')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('settings.name')}</span>
            <span className="font-medium">{baby.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('settings.birthdate')}</span>
            <span className="font-medium">
              {new Date(baby.birthdate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
