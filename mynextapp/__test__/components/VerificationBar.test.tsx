import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import VerificationBar from '@/app/components/VerificationBar'; // Adjust the path as needed

describe('VerificationBar Component', () => {
  it('renders blue gradient for level 1', () => {
    render(<VerificationBar level={1} />);
    const bar = screen.getByTestId('verification-bar');
    expect(bar).toHaveClass('from-blue-500 to-blue-700');
  });

  it('renders green gradient for level 2', () => {
    render(<VerificationBar level={2} />);
    const bar = screen.getByTestId('verification-bar');
    expect(bar).toHaveClass('from-green-500 to-green-700');
  });

  it('renders red gradient for level 3', () => {
    render(<VerificationBar level={3} />);
    const bar = screen.getByTestId('verification-bar');
    expect(bar).toHaveClass('from-red-500 to-red-700');
  });

  it('renders gray gradient for any other level', () => {
    render(<VerificationBar level={4} />);
    const bar = screen.getByTestId('verification-bar');
    expect(bar).toHaveClass('from-gray-300 to-gray-500');
  });
});
