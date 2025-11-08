import { useState } from 'react'
import { Welcome } from './Welcome'
import { BabyProfileForm } from './BabyProfileForm'
import { Disclaimer } from './Disclaimer'
import { NotificationSetup } from './NotificationSetup'

type OnboardingStep = 'welcome' | 'profile' | 'disclaimer' | 'notifications'

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('profile')
    } else if (currentStep === 'profile') {
      setCurrentStep('disclaimer')
    } else if (currentStep === 'disclaimer') {
      setCurrentStep('notifications')
    }
  }

  const handleBack = () => {
    if (currentStep === 'notifications') {
      setCurrentStep('disclaimer')
    } else if (currentStep === 'disclaimer') {
      setCurrentStep('profile')
    } else if (currentStep === 'profile') {
      setCurrentStep('welcome')
    }
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentStep === 'welcome' && <Welcome onNext={handleNext} />}
        {currentStep === 'profile' && <BabyProfileForm onNext={handleNext} onBack={handleBack} />}
        {currentStep === 'disclaimer' && <Disclaimer onNext={handleNext} onBack={handleBack} />}
        {currentStep === 'notifications' && <NotificationSetup onBack={handleBack} />}
      </div>
    </div>
  )
}
