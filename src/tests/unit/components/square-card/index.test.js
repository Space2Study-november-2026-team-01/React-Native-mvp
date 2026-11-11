import { render, screen, fireEvent } from '@testing-library/react-native'
import { Pressable, StyleSheet } from 'react-native'

import SquareCard from '~/components/square-card'
import palette from '~/styles/app-theme/app.pallete'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
}))

const getPressableParent = (element) => {
  let node = element

  while (node && node.type !== Pressable) {
    node = node.parent
  }

  return node
}

describe('SquareCard', () => {
  const mockChooseRole = jest.fn()
  const mockData = {
    item: {
      title: 'becomeStudent',
      image: { uri: 'student.png' },
      role: 'student'
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render translated title', () => {
    render(<SquareCard chooseRole={mockChooseRole} data={mockData} />)

    expect(screen.getByText('signup.becomeStudent')).toBeTruthy()
  })

  it('should call chooseRole with card role on press', () => {
    render(<SquareCard chooseRole={mockChooseRole} data={mockData} />)

    const card = getPressableParent(screen.getByText('signup.becomeStudent'))
    fireEvent.press(card)

    expect(mockChooseRole).toHaveBeenCalledWith('student')
  })

  it('should highlight card when its role is chosen', () => {
    render(
      <SquareCard
        chooseRole={mockChooseRole}
        choosenRole='student'
        data={mockData}
      />
    )

    const card = getPressableParent(screen.getByText('signup.becomeStudent'))

    expect(StyleSheet.flatten(card.props.style).backgroundColor).toBe(
      palette.hover
    )
  })

  it('should not highlight card when another role is chosen', () => {
    render(
      <SquareCard
        chooseRole={mockChooseRole}
        choosenRole='tutor'
        data={mockData}
      />
    )

    const card = getPressableParent(screen.getByText('signup.becomeStudent'))

    expect(StyleSheet.flatten(card.props.style).backgroundColor).toBe(
      palette.secondary
    )
  })
})
