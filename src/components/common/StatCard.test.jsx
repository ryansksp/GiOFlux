import { render, screen } from '@testing-library/react'
import StatCard from './StatCard'

describe('StatCard', () => {
  const defaultProps = {
    title: 'Test Title',
    value: '100',
    icon: 'TestIcon',
    gradient: 'from-blue-500 to-blue-600'
  }

  it('renders title and value correctly', () => {
    render(<StatCard {...defaultProps} />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('shows loading state when loading is true', () => {
    render(<StatCard {...defaultProps} loading={true} />)

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('formats currency when isCurrency is true', () => {
    render(<StatCard {...defaultProps} value={1000} isCurrency={true} />)

    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument()
  })

  it('applies correct gradient classes', () => {
    const { container } = render(<StatCard {...defaultProps} />)

    const card = container.firstChild
    expect(card).toHaveClass('from-blue-500', 'to-blue-600')
  })
})
