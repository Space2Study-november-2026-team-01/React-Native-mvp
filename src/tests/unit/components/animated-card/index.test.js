import { render, screen } from '@testing-library/react-native'
import { Image, Text } from 'react-native'

import AnimatedCard from '~/components/animated-card'

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

describe('AnimatedCard', () => {
  const mockData = {
    image: { uri: 'test-image.png' },
    title: 'Test title',
    description: 'Test description'
  }

  it('should render title', () => {
    render(<AnimatedCard data={mockData} />)

    expect(screen.getByText(mockData.title)).toBeTruthy()
  })

  it('should render description', () => {
    render(<AnimatedCard data={mockData} />)

    expect(screen.getByText(mockData.description)).toBeTruthy()
  })

  it('should render image with passed source', () => {
    render(<AnimatedCard data={mockData} />)

    const image = screen.UNSAFE_getByType(Image)

    expect(image.props.source).toEqual(mockData.image)
    expect(image.props.resizeMode).toBe('contain')
  })

  it('should render elements passed as title and description', () => {
    const data = {
      ...mockData,
      title: <Text>Custom title</Text>,
      description: <Text>Custom description</Text>
    }

    render(<AnimatedCard data={data} />)

    expect(screen.getByText('Custom title')).toBeTruthy()
    expect(screen.getByText('Custom description')).toBeTruthy()
  })
})
