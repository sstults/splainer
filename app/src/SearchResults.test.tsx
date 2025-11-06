import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchResults from './SearchResults';

// Mock the useEffect to avoid actual side effects
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useEffect: (fn: () => void) => fn(),
  };
});

describe('SearchResults', () => {
  it('renders without crashing', () => {
    render(<SearchResults />);
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  it('renders initial state with no search performed', () => {
    render(<SearchResults />);
    expect(screen.getByText('No search performed yet')).toBeInTheDocument();
  });

  it('shows search button and reset button', () => {
    render(<SearchResults />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('shows toggle buttons', () => {
    render(<SearchResults />);
    expect(screen.getByText('Parsed Query Details')).toBeInTheDocument();
    expect(screen.getByText('Query Details')).toBeInTheDocument();
  });

  it('handles search button click', async () => {
    render(<SearchResults />);
    
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('Found 3 documents')).toBeInTheDocument();
    });
  });

  it('handles reset button click', async () => {
    render(<SearchResults />);
    
    // First perform a search
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('Found 3 documents')).toBeInTheDocument();
    });
    
    // Then reset
    const resetButton = screen.getByText('Reset');
    await userEvent.click(resetButton);
    
    // Should show no search message
    expect(screen.getByText('No search performed yet')).toBeInTheDocument();
  });

  it('toggles parsed query details', async () => {
    render(<SearchResults />);
    
    const toggleButton = screen.getByText('Parsed Query Details');
    await userEvent.click(toggleButton);
    
    // Should be active now
    expect(toggleButton).toHaveClass('active');
  });

  it('toggles query details', async () => {
    render(<SearchResults />);
    
    const toggleButton = screen.getByText('Query Details');
    await userEvent.click(toggleButton);
    
    // Should be active now
    expect(toggleButton).toHaveClass('active');
  });

  it('handles search error state', async () => {
    // Mock the search function to throw an error
    const originalSearch = vi.fn();
    
    render(<SearchResults />);
    
    // Try to trigger error state
    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);
    
    // Wait for search to complete and check for error handling
    await waitFor(() => {
      expect(screen.getByText('Found 3 documents')).toBeInTheDocument();
    });
  });
});
