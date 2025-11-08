import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateBaby } from '../../hooks/useDatabase'
import { useApp } from '../../contexts/AppContext'
import { Button, Input } from '../common'
import { validateBabyName, validateBirthdate } from '../../utils/validation'

interface BabyProfileFormProps {
  onNext: () => void
  onBack: () => void
}

export function BabyProfileForm({ onNext, onBack }: BabyProfileFormProps) {
  const { t } = useTranslation()
  const createBaby = useCreateBaby()
  const { showToast } = useApp()

  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [errors, setErrors] = useState<{ name?: string; birthdate?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const nameValidation = validateBabyName(name)
    const birthdateValidation = validateBirthdate(birthdate)

    if (!nameValidation.valid || !birthdateValidation.valid) {
      setErrors({
        name: nameValidation.error,
        birthdate: birthdateValidation.error,
      })
      return
    }

    // Create baby profile
    createBaby.mutate(
      { name, birthdate },
      {
        onSuccess: () => {
          onNext()
        },
        onError: () => {
          showToast(t('errors.saveFailed'), 'error')
        },
      }
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">👶</div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('settings.babyProfile')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t('onboarding.babyName')}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setErrors((prev) => ({ ...prev, name: undefined }))
          }}
          error={errors.name}
          required
          autoFocus
        />

        <Input
          label={t('onboarding.babyBirthdate')}
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
          <Button type="button" variant="secondary" onClick={onBack} fullWidth>
            {t('common.back')}
          </Button>
          <Button type="submit" fullWidth disabled={createBaby.isPending}>
            {createBaby.isPending ? '...' : t('common.next')}
          </Button>
        </div>
      </form>
    </div>
  )
}
