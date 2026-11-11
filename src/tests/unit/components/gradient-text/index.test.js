import { render, screen } from '@testing-library/react-native'
import '@testing-library/react-native/extend-expect'

import GradientText from '~/components/gradient-text'

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
    LinearGradient: ({ colors, children }) =>
      React.createElement(
        View,
        { testID: 'linear-gradient', colors },
        children
      )
  }
})

describe('GradientText', () => {
  const mockText = 'Welcome back!'

  it('should render passed text', () => {
    render(<GradientText text={mockText} />)

    expect(screen.getByText(mockText)).toBeTruthy()
  })

  it('should use default gradient colors', () => {
    render(<GradientText text={mockText} />)

    expect(screen.getByTestId('linear-gradient').props.colors).toEqual([
      '#294083',
      '#54BB7D'
    ])
  })

  it('should use custom gradient colors', () => {
    const colors = ['#000000', '#FFFFFF']

    render(<GradientText colors={colors} text={mockText} />)

    expect(screen.getByTestId('linear-gradient').props.colors).toEqual(colors)
  })

  it('should apply custom style to the text', () => {
    render(<GradientText style={{ fontSize: 30 }} text={mockText} />)

    expect(screen.getByText(mockText)).toHaveStyle({
      fontSize: 30,
      backgroundColor: 'transparent'
    })
  })

  it('should apply variant styles to the text', () => {
    render(<GradientText text={mockText} variant='headlineSmall' />)

    expect(screen.getByText(mockText)).toHaveStyle({ fontSize: 20 })
  })
})
