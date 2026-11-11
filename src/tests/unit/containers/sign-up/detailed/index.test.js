import { render, screen, fireEvent } from '@testing-library/react-native'
import '@testing-library/react-native/extend-expect'
import { Linking } from 'react-native'
import { router } from 'expo-router'

import DetailedContent from '~/containers/sign-up/detailed'
import {
  Terms,
  PrivacyPolicy
} from '~/containers/sign-up/detailed/DetailedContent.constants'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
}))

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
  Link: ({ children }) => children
}))

jest.mock('@expo/vector-icons', () => ({
  AntDesign: () => null
}))

jest.mock('~/components', () => ({
  HeaderWithBackArrow: jest.requireActual(
    '~/components/header-with-back-arrow'
  ).default,
  Url: jest.requireActual('~/components/url').default
}))

describe('Sign up DetailedContent', () => {
  const mockToggle = jest.fn()
  const mockBackStep = jest.fn()
  const visible = { password: false, confirmPassword: false }

  const renderDetailedContent = (role = 'student') =>
    render(
      <DetailedContent
        backStep={mockBackStep}
        role={role}
        toggle={mockToggle}
        visible={visible}
      />
    )

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render student description for student role', () => {
    renderDetailedContent('student')

    expect(screen.getByText('signup.detailedStudentDescription')).toBeTruthy()
  })

  it('should render tutor description for tutor role', () => {
    renderDetailedContent('tutor')

    expect(screen.getByText('signup.detailedTutorDescription')).toBeTruthy()
  })

  it('should disable sign up button until terms are accepted', () => {
    renderDetailedContent()

    expect(
      screen.getByRole('button', { name: 'signup.signUp' })
    ).toBeDisabled()
  })

  it('should sign up after accepting terms', () => {
    renderDetailedContent()

    fireEvent.press(screen.getByRole('checkbox'))
    const signUpButton = screen.getByRole('button', { name: 'signup.signUp' })

    expect(signUpButton).toBeEnabled()

    fireEvent.press(signUpButton)

    expect(router.replace).toHaveBeenCalledWith('public/verified')
  })

  it('should go back to previous step on back arrow press', () => {
    renderDetailedContent()

    fireEvent.press(screen.getByTestId('Pressable'))

    expect(mockBackStep).toHaveBeenCalledTimes(1)
  })

  it('should navigate to login page on login press', () => {
    renderDetailedContent()

    fireEvent.press(screen.getByText('signup.login'))

    expect(router.replace).toHaveBeenCalledWith('/login')
  })

  it('should open terms and privacy policy links', () => {
    renderDetailedContent()

    fireEvent.press(screen.getByText('signup.TermsAndPrivacy.section2'))
    fireEvent.press(screen.getByText('signup.TermsAndPrivacy.section4'))

    expect(Linking.openURL).toHaveBeenCalledWith(Terms)
    expect(Linking.openURL).toHaveBeenCalledWith(PrivacyPolicy)
  })
})
