import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('Deve renderizar o componente App corretamente', () => {
    const { getByText } = render(<App />);
    
    // Check if the main heading is rendered
    expect(getByText('Project ready!')).toBeInTheDocument();
    
    // Check if the paragraphs are rendered
    expect(getByText('You may now add components and start building.')).toBeInTheDocument();
    expect(getByText("We've already added the button component for you.")).toBeInTheDocument();
    
    // Check if the button is rendered
    expect(getByText('Button')).toBeInTheDocument();
    
    // Check if the dark mode toggle instruction is rendered
    expect(getByText('(Press d to toggle dark mode)')).toBeInTheDocument();
  });
});