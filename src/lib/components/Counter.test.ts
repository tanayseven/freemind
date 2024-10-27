import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.svelte';

describe('Counter.svelte', () => {
  it('renders with initial count of 0', () => {
    render(Counter);
    const count = screen.getByTestId('count');
    expect(count.textContent).toBe('0');
  });

  it('increments count when + button is clicked', async () => {
    render(Counter);
    const incrementBtn = screen.getByTestId('increment');
    const count = screen.getByTestId('count');

    await fireEvent.click(incrementBtn);
    expect(count.textContent).toBe('1');
  });

  it('decrements count when - button is clicked', async () => {
    render(Counter);
    const decrementBtn = screen.getByTestId('decrement');
    const count = screen.getByTestId('count');

    await fireEvent.click(decrementBtn);
    expect(count.textContent).toBe('-1');
  });

  it('accepts initial count as prop', () => {
    const props = { initialCount: 10 };
    render(Counter, { props });
    const count = screen.getByTestId('count');
    expect(count.textContent).toBe('10');
  });
});

