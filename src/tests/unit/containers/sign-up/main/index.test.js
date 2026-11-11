import { render, screen, fireEvent } from '@testing-library/react-native'
import { Pressable } from 'react-native'

import MainContent from '~/containers/sign-up/main'

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
  SquareCard: jest.requireActual('~/components/square-card').default,
  HeaderWithBackArrow: jest.requireActual(
    '~/components/header-with-back-arrow'
  ).default
}))

const getPressableParent = (element) => {
  let node = element

  while (node && node.type !== Pressable) {
    node = node.parent
  }

  return node
}

describe('Sign up MainContent', () => {
  const mockNextStep = jest.fn()
  const mockChooseRole = jest.fn()

  const renderMainContent = (role = '') =>
    render(
      <MainContent
        chooseRole={mockChooseRole}
        nextStep={mockNextStep}
        role={role}
      />
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render header and texts', () => {
    renderMainContent()

    expect(screen.getByText('Sign up')).toBeTruthy()
    expect(screen.getByText('signup.description')).toBeTruthy()
    expect(screen.getByText('signup.enterYourName')).toBeTruthy()
    expect(screen.getByText('signup.chooseRole')).toBeTruthy()
  })

  it('should render a card for every role', () => {
    renderMainContent()

    expect(screen.getByText('signup.becomeStudent')).toBeTruthy()
    expect(screen.getByText('signup.becomeTutor')).toBeTruthy()
  })

  it('should call chooseRole when role card is pressed', () => {
    renderMainContent()

    fireEvent.press(getPressableParent(screen.getByText('signup.becomeTutor')))

    expect(mockChooseRole).toHaveBeenCalledWith('tutor')
  })

  it('should go to next step when "next" button is pressed', () => {
    renderMainContent('student')

    fireEvent.press(screen.getByRole('button', { name: 'signup.next' }))

    expect(mockNextStep).toHaveBeenCalledWith(true)
  })
})
