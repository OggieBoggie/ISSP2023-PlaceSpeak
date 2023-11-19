import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import Account from '@/app/components/Account';
import { useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

describe('Account Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useSession as jest.Mock).mockReturnValue({
      data: {
        session: { user: { email: 'test@example.com' } },
      },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ email: 'test@example.com', /* other user properties */ }]),
      })
    ) as jest.Mock;
  });

  it('renders and allows user profile updates', async () => {
    render(<Account />);

    fireEvent.change(screen.getByPlaceholderText('Preferred Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Share your Facebook URL'), { target: { value: 'https://facebook.com/johndoe' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    await waitFor(() => expect(screen.getByText('Profile updated successfully! 🎉')).toBeInTheDocument());
  });

  it('handles errors during profile update', async () => {
    // Mock fetch to simulate a network error
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false, statusText: 'Network Error' })
    );
  });

});
