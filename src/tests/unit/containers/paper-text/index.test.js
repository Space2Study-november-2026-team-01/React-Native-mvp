import { render, screen, fireEvent } from '@testing-library/react-native'
import '@testing-library/react-native/extend-expect'

import PaperText from '~/containers/paper-text'
import { styles } from '~/containers/paper-text/PaperText.styles'

describe('PaperText', () => {
  const mockText = 'Test text'
  const largeText = { fontSize: 40 }
  const redText = { color: 'red' }

  it('should render children', () => {
    render(<PaperText>{mockText}</PaperText>)

    expect(screen.getByText(mockText)).toBeTruthy()
  })

  it.each([
    ['title', styles.text],
    ['descriptionText', styles.descriptionText],
    ['headlineSmall', styles.headlineSmall],
    ['headlineMedium', styles.headlineMedium],
    ['titleSmall', styles.titleSmall]
  ])('should apply styles for "%s" variant', (variant, variantStyle) => {
    render(<PaperText variant={variant}>{mockText}</PaperText>)

    expect(screen.getByText(mockText)).toHaveStyle(variantStyle)
  })

  it('should apply both description and text styles for "combineText" variant', () => {
    render(<PaperText variant='combineText'>{mockText}</PaperText>)

    expect(screen.getByText(mockText)).toHaveStyle({
      ...styles.descriptionText,
      ...styles.text
    })
  })

  it('should let custom style override variant style', () => {
    render(
      <PaperText style={largeText} variant='headlineSmall'>
        {mockText}
      </PaperText>
    )

    expect(screen.getByText(mockText)).toHaveStyle(largeText)
  })

  it('should apply custom style without variant', () => {
    render(<PaperText style={redText}>{mockText}</PaperText>)

    expect(screen.getByText(mockText)).toHaveStyle(redText)
  })

  it('should make text bold when bold prop is passed', () => {
    render(<PaperText bold>{mockText}</PaperText>)

    expect(screen.getByText(mockText)).toHaveStyle({ fontWeight: 'bold' })
  })

  it('should call onPress on press', () => {
    const mockPress = jest.fn()

    render(<PaperText onPress={mockPress}>{mockText}</PaperText>)

    fireEvent.press(screen.getByText(mockText))

    expect(mockPress).toHaveBeenCalledTimes(1)
  })

  it('should not throw on press without onPress', () => {
    render(<PaperText>{mockText}</PaperText>)

    expect(() => fireEvent.press(screen.getByText(mockText))).not.toThrow()
  })
})
