import { useState, useCallback } from 'react';

export const useInput = (initialState = null) => {
  const [value, handler] = useState(initialState);
  const setter = (e) => handler(e.target.value);
  return [value, setter, handler];
};

export const useChecked = (initialState = null) => {
  const [value, handler] = useState(initialState);
  const setter = useCallback(() => {
    handler((prev) => {
      return !prev;
    });
  }, [value]);
  return [value, setter, handler];
};
