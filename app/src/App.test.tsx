import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    const titleElement = screen.getByText(/Splainer React Application/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the initial message', () => {
    render(<App />);
    const messageElement = screen.getByText(/Starting the migration from AngularJS to React\/TypeScript/i);
    expect(messageElement).toBeInTheDocument();
  });
});
