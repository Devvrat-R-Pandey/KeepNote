import React, { useState } from "react";
import type { ChangeEvent } from "react";
import type { Note } from "../../types/Note";
import {
  AdvancedCard,
  AdvancedTitle,
  SearchIcon,
  AdvancedRow,
  AdvancedField,
  AdvancedLabel,
  AdvancedInput,
  AdvancedSelect,
  SearchBtn,
  ClearBtn,
  SearchCount,
  SearchUrl,
} from "./AdvancedNoteSearch.styles";

interface Props {
  notes: Note[];
  onFilter: (criteria: {
    category?: string;
    priority?: string;
    __clear?: boolean;
    __empty?: boolean;
  }) => void;
  searchesPerformed: number;
  searchUrl: string;
}

const AdvancedNoteSearch: React.FC<Props> = ({
  onFilter,
  searchesPerformed,
  searchUrl,
}) => {
  const [criteria, setCriteria] = useState({ category: "", priority: "" });

  const buildLiveUrl = () => {
    const params = new URLSearchParams();
    if (criteria.category) params.append("category", criteria.category);
    if (criteria.priority) params.append("priority", criteria.priority);
    return params.toString()
      ? `http://localhost:3000/notes?${params.toString()}`
      : "http://localhost:3000/notes";
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const { category, priority } = criteria;

    if (!category.trim() && !priority.trim()) {
      onFilter({ __empty: true });
      return;
    }

    const normalizedCriteria = {
      category: category || "",
      priority: priority || "",
    };

    onFilter(normalizedCriteria);
  };

  const handleClear = () => {
    setCriteria({ category: "", priority: "" });
    onFilter({ __clear: true });
  };

  const isDisabled = !criteria.category && !criteria.priority;

  return (
    <AdvancedCard>
      <AdvancedTitle>
        <SearchIcon />
        Advanced Note Search – By Category & Priority
      </AdvancedTitle>

      <AdvancedRow>
        <AdvancedField>
          <AdvancedLabel htmlFor="category">Category:</AdvancedLabel>
          <AdvancedInput
            id="category"
            name="category"
            type="text"
            value={criteria.category}
            onChange={handleChange}
            placeholder="e.g. Academic"
          />
        </AdvancedField>

        <AdvancedField>
          <AdvancedLabel htmlFor="priority">Priority:</AdvancedLabel>
          <AdvancedSelect
            id="priority"
            name="priority"
            value={criteria.priority}
            onChange={handleChange}
          >
            <option value="">--Select--</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </AdvancedSelect>
        </AdvancedField>
      </AdvancedRow>

      <AdvancedRow>
        <SearchBtn onClick={handleSearch} disabled={isDisabled}>
          SEARCH NOTES
        </SearchBtn>
        <ClearBtn onClick={handleClear} disabled={isDisabled}>
          CLEAR
        </ClearBtn>
        <SearchCount>Searches Performed: {searchesPerformed}</SearchCount>
      </AdvancedRow>

      <SearchUrl>
        Current Search URL: {searchUrl || buildLiveUrl()}
      </SearchUrl>
    </AdvancedCard>
  );
};

export default AdvancedNoteSearch;