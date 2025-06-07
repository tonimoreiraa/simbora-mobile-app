import {useEffect, useState} from 'react';

export function useDebouncedState<T>(
  initialValue: string = '',
  delay: number = 300,
) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return {
    inputValue,
    setInputValue,
    debouncedValue,
  };
}
