import React, { useState, useEffect, useCallback } from "react";
import styles from "./SearchNote.module.css";

interface Props {
  onSearch: (value: string) => void;
  searchText?: string;
}

const SearchNote: React.FC<Props> = ({ onSearch, searchText = "" }) => {
  const [query, setQuery] = useState(searchText);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className={styles.searchNote}>
      <label htmlFor="searchInput" className={styles.visuallyHidden}>
        Search notes
      </label>
      <input
        id="searchInput"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search notes..."
        className={styles.searchInput}
        aria-label="Search notes"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearBtn}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchNote;