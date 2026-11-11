import { render, screen } from '@testing-library/react-native'

import StepIndicator from '~/components/step-indicator'
import { styles } from '~/components/step-indicator/StepIndicator.styles'
import { onboardingSteps } from '~/constants/onboarding'

const findIndicators = (node, result = []) => {
  if (!node || typeof node === 'string') return result

  if (Array.isArray(node)) {
    node.forEach((child) => findIndicators(child, result))
    return result
  }

  const { style } = node.props
  if (Array.isArray(style) && style.includes(styles.stepIndicator)) {
    result.push(node)
  }

  findIndicators(node.children, result)

  return result
}

const isActive = (indicator) =>
  indicator.props.style.includes(styles.activeStepIndicator)

describe('StepIndicator', () => {
  it('should render an indicator for every onboarding step', () => {
    render(<StepIndicator screenIndex={0} />)

    expect(findIndicators(screen.toJSON())).toHaveLength(onboardingSteps.length)
  })

  it.each([0, 1, 2])(
    'should mark only indicator %i as active',
    (screenIndex) => {
      render(<StepIndicator screenIndex={screenIndex} />)

      const indicators = findIndicators(screen.toJSON())

      indicators.forEach((indicator, index) => {
        expect(isActive(indicator)).toBe(index === screenIndex)
      })
    }
  )

  it('should not mark any indicator as active for unknown index', () => {
    render(<StepIndicator screenIndex={-1} />)

    const indicators = findIndicators(screen.toJSON())

    expect(indicators.some(isActive)).toBe(false)
  })
})
