import { render, screen, fireEvent } from '@testing-library/react-native'
import { router } from 'expo-router'

import ButtonsGeneral from '~/components/buttons-general'

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() }
}))

jest.mock('@expo/vector-icons', () => ({
  AntDesign: () => null
}))

describe('ButtonsGeneral', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render "Get Started" and "Log in" buttons', () => {
    render(<ButtonsGeneral />)

    expect(screen.getByRole('button', { name: 'Get Started' })).toBeTruthy()
    expect(screen.getByText('Log in')).toBeTruthy()
  })

  it('should navigate to sign up page after pressing "Get Started" text', () => {
    render(<ButtonsGeneral />)

    const [buttonText] = screen.getAllByText('Get Started')
    fireEvent.press(buttonText)

    expect(router.replace).toHaveBeenCalledWith('public/signup')
  })

  it('should navigate to sign up page after pressing the button itself', () => {
    render(<ButtonsGeneral />)

    fireEvent.press(screen.getByRole('button', { name: 'Get Started' }))

    expect(router.replace).toHaveBeenCalledWith('public/signup')
  })

  it('should navigate to login page after pressing "Log in"', () => {
    render(<ButtonsGeneral />)

    fireEvent.press(screen.getByText('Log in'))

    expect(router.replace).toHaveBeenCalledWith('public/login')
  })
})
