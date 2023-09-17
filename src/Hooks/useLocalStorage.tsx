import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<Type>(key: string, initialValue: Type) {
  const [localStorageValue, setLocalStorageValue] = useState<Type>(initialValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      try {
        setLocalStorageValue(JSON.parse(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key]);

  const updateValue = useCallback(
    (value: Type) => {
      setLocalStorageValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key],
  );

  return { localStorageValue, updateValue };
}

export default useLocalStorage;
