import { render, screen, fireEvent } from '@testing-library/react-native'
import { Linking } from 'react-native'

import Url from '~/components/url'

describe('Url', () => {
  const mockUrl = 'https://example.com/terms'
  const mockText = 'Terms'

  beforeEach(() => {
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render children', () => {
    render(<Url url={mockUrl}>{mockText}</Url>)

    expect(screen.getByText(mockText)).toBeTruthy()
  })

  it('should open url on press', () => {
    render(<Url url={mockUrl}>{mockText}</Url>)

    fireEvent.press(screen.getByText(mockText))

    expect(Linking.openURL).toHaveBeenCalledWith(mockUrl)
  })

  it('should not open url without press', () => {
    render(<Url url={mockUrl}>{mockText}</Url>)

    expect(Linking.openURL).not.toHaveBeenCalled()
  })
})
