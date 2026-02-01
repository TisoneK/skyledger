import React from 'react';
import { render, screen } from '@testing-library/react';
import { RoleIcon } from '../role-icon';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError }: any) {
    return <img src={src} alt={alt} onError={onError} data-testid="role-icon-image" />;
  };
});

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  User: ({ className }: any) => <div data-testid="fallback-user" className={className} />,
  Users: ({ className }: any) => <div data-testid="fallback-users" className={className} />,
  TrendingUp: ({ className }: any) => <div data-testid="fallback-trending" className={className} />,
  Briefcase: ({ className }: any) => <div data-testid="fallback-briefcase" className={className} />,
  Crown: ({ className }: any) => <div data-testid="fallback-crown" className={className} />,
}));

describe('RoleIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders personal role icon correctly', () => {
    render(<RoleIcon type="personal" />);
    expect(screen.getByAltText('personal icon')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<RoleIcon type="chama" size={32} />);
    const image = screen.getByTestId('role-icon-image');
    expect(image).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<RoleIcon type="side-income" className="custom-class" />);
    const image = screen.getByTestId('role-icon-image');
    expect(image).toBeInTheDocument();
  });

  it('renders with custom alt text', () => {
    render(<RoleIcon type="all-roles" alt="Custom alt text" />);
    expect(screen.getByAltText('Custom alt text')).toBeInTheDocument();
  });

  it('renders fallback icon when image fails to load', () => {
    const MockImage = require('next/image').default;
    MockImage.mockImplementation(({ onError }: any) => {
      onError && onError(new Error('Image load failed'));
      return <div data-testid="failed-image" />;
    });

    render(<RoleIcon type="personal" />);
    expect(screen.getByTestId('fallback-user')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const MockImage = require('next/image').default;
    MockImage.mockImplementation(({ onError }: any) => {
      onError && onError(new Error('Image load failed'));
      return <div data-testid="failed-image" />;
    });

    const customFallback = <div data-testid="custom-fallback">Custom Fallback</div>;
    render(<RoleIcon type="personal" fallback={customFallback} />);
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });

  it('renders correct fallback for each role type', () => {
    const MockImage = require('next/image').default;
    MockImage.mockImplementation(({ onError }: any) => {
      onError && onError(new Error('Image load failed'));
      return <div data-testid="failed-image" />;
    });

    const roleTests = [
      { type: 'personal', fallbackId: 'fallback-user' },
      { type: 'chama', fallbackId: 'fallback-users' },
      { type: 'side-income', fallbackId: 'fallback-trending' },
      { type: 'all-roles', fallbackId: 'fallback-crown' },
      { type: 'sky-tech', fallbackId: 'fallback-briefcase' },
    ];

    roleTests.forEach(({ type, fallbackId }) => {
      const { unmount } = render(<RoleIcon type={type as any} />);
      expect(screen.getByTestId(fallbackId)).toBeInTheDocument();
      unmount();
    });
  });
});
