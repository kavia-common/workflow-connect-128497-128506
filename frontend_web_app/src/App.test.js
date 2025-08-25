import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard title', () => {
  render(<App />);
  const text = screen.getByText(/Dashboard/i);
  expect(text).toBeInTheDocument();
});
