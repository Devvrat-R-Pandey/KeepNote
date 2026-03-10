import React, { useState, useEffect, useCallback } from "react";
import styles from "./SearchNote.module.css";

interface Props {
  onSearch: (value: string) => void;
  searchText?: string; // optional controlled value
}

const SearchNote: React.FC<Props> = ({ onSearch, searchText = "" }) => {
  const [query, setQuery] = useState(searchText);

  // keep local state in sync if parent changes searchText
  useEffect(() => {
    setQuery(searchText);
  }, [searchText]);

  // ✅ Debounced search effect
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
    onSearch(""); // reset search immediately
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