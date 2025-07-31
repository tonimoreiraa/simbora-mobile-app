import {useMemo, useState} from 'react';

export function useSearch<T>(data: Array<T> | undefined, key: keyof T) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchTerm || !data) {
      return data;
    }

    const searchWords = searchTerm.toLowerCase().split(/\s+/);
    return data.filter(item => {
      const itemValue = String(item[key]).toLowerCase();
      return searchWords.every(word =>
        itemValue.split(/\s+/).some(itemWord => itemWord.includes(word)),
      );
    });
  }, [data, searchTerm, key]);

  return {
    searchTerm,
    setSearchTerm,
    filteredResults,
  };
}
