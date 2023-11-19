import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import Popup from '@/app/components/Popup';

describe('Popup Component', () => {
    jest.useFakeTimers();
  
    it('renders correctly when "show" is true', () => {
      render(<Popup message="Test Message" show={true} duration={3000} hide={() => {}} />);
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });
  
    it('does not render when "show" is false', () => {
      render(<Popup message="Test Message" show={false} duration={3000} hide={() => {}} />);
      expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
    });
  
    // Reset timers after tests
    afterAll(() => {
      jest.useRealTimers();
    });
  });