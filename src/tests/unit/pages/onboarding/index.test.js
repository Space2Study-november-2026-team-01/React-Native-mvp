import { render, screen, act } from '@testing-library/react-native'

import OnboardingScreen from '~/pages/onboarding'

const mockFlingHandlers = {}

jest.mock('react-native-gesture-handler', () => {
  const createFling = () => {
    let gestureDirection
    const gesture = {
      direction: (direction) => {
        gestureDirection = direction
        return gesture
      },
      onEnd: (callback) => {
        mockFlingHandlers[gestureDirection] = callback
        return gesture
      }
    }
    return gesture
  }

  return {
    GestureDetector: ({ children }) => children,
    Gesture: {
      Fling: createFling,
      Simultaneous: (...gestures) => gestures
    },
    Directions: { LEFT: 'left', RIGHT: 'right' }
  }
})

jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native')
  const animation = { delay: () => animation }

  return {
    __esModule: true,
    default: { View, Text },
    FadeIn: animation,
    FadeOut: animation,
    SlideInRight: animation,
    SlideOutLeft: animation
  }
})

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
  Stack: { Screen: () => null }
}))

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null
}))

jest.mock('@expo/vector-icons', () => ({
  AntDesign: () => null
}))

jest.mock('~/components', () => ({
  StepIndicator: jest.requireActual('~/components/step-indicator').default,
  AnimatedCard: jest.requireActual('~/components/animated-card').default,
  ButtonsGeneral: jest.requireActual('~/components/buttons-general').default
}))

const swipeLeft = () => act(() => mockFlingHandlers.left())
const swipeRight = () => act(() => mockFlingHandlers.right())

// Nested texts can match both the inner and the outer Text element
const isStepShown = (text) => screen.queryAllByText(text).length > 0

const firstStep = 'Welcome to the'
const secondStep = /Enjoy personalized lessons/
const thirdStep = /Create your expert content/

describe('Onboarding page', () => {
  it('should render the first step and buttons', () => {
    render(<OnboardingScreen />)

    expect(isStepShown(firstStep)).toBe(true)
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeTruthy()
    expect(screen.getByText('Log in')).toBeTruthy()
  })

  it('should go to the next step on left swipe', () => {
    render(<OnboardingScreen />)

    swipeLeft()

    expect(isStepShown(secondStep)).toBe(true)

    swipeLeft()

    expect(isStepShown(thirdStep)).toBe(true)
  })

  it('should return to the first step after the last one', () => {
    render(<OnboardingScreen />)

    swipeLeft()
    swipeLeft()
    swipeLeft()

    expect(isStepShown(firstStep)).toBe(true)
  })

  it('should go to the previous step on right swipe', () => {
    render(<OnboardingScreen />)

    swipeLeft()
    swipeRight()

    expect(isStepShown(firstStep)).toBe(true)
  })

  it('should stay on the first step on right swipe', () => {
    render(<OnboardingScreen />)

    swipeRight()

    expect(isStepShown(firstStep)).toBe(true)
    expect(isStepShown(secondStep)).toBe(false)
  })
})
