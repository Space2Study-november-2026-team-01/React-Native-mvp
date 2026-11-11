import { render, screen, fireEvent } from '@testing-library/react-native'
import { TextInput } from 'react-native'
import { router } from 'expo-router'

import Login from '~/pages/login'
import { loginUser } from '~/redux/reducer'

const mockDispatch = jest.fn(() => ({ unwrap: jest.fn() }))
let mockUserRole = ''

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({ appMain: { userRole: mockUserRole } })
}))

jest.mock('~/redux/reducer', () => ({
  loginUser: jest.fn((data) => ({ type: 'appMain/loginUser', payload: data }))
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
  ).default
}))

jest.mock('@react-native-masked-view/masked-view', () => {
  const React = require('react')
  const { View } = require('react-native')

  const MockMaskedView = ({ maskElement, children }) =>
    React.createElement(View, null, maskElement, children)

  return MockMaskedView
})

jest.mock('expo-linear-gradient', () => {
  const React = require('react')
  const { View } = require('react-native')

  return {
    LinearGradient: ({ children }) => React.createElement(View, null, children)
  }
})

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUserRole = ''
  })

  it('should render title and subtitle', () => {
    render(<Login />)

    expect(screen.getByText('Welcome back!')).toBeTruthy()
    expect(
      screen.getByText(
        'Ready to continue your journey? Please enter your details.'
      )
    ).toBeTruthy()
  })

  it('should hide password by default', () => {
    render(<Login />)

    const [, passwordInput] = screen.UNSAFE_getAllByType(TextInput)

    expect(passwordInput.props.secureTextEntry).toBe(true)
  })

  it('should dispatch loginUser with entered email and password', () => {
    render(<Login />)

    const [emailInput, passwordInput] = screen.UNSAFE_getAllByType(TextInput)
    fireEvent.changeText(emailInput, 'test@mail.com')
    fireEvent.changeText(passwordInput, 'password123')

    fireEvent.press(screen.getByRole('button', { name: 'Log in' }))

    const credentials = { email: 'test@mail.com', password: 'password123' }
    expect(loginUser).toHaveBeenCalledWith(credentials)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'appMain/loginUser',
      payload: credentials
    })
  })

  it('should redirect to home page when user is logged in', () => {
    mockUserRole = 'student'

    render(<Login />)

    expect(router.replace).toHaveBeenCalledWith('/(auth)/drawer/tabs/home')
  })

  it('should not redirect when user is not logged in', () => {
    render(<Login />)

    expect(router.replace).not.toHaveBeenCalled()
  })
})
