import styled, { css } from "styled-components";
import SearchIconMui from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/* ------------------ Card + Title ------------------ */
export const AdvancedCard = styled.div`
  background: var(--card-bg, #181818);
  padding: 16px;
  border-radius: var(--radius, 8px);
  margin: 8px auto 0;
  color: var(--text, #fff);
  max-width: 600px;
  width: 100%;
  border: 1px solid var(--border, #444);
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
`;

export const AdvancedTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--yellow);
`;

export const SearchIcon = styled(SearchIconMui)`
  color: var(--yellow);
`;

/* ------------------ Basic View Card ------------------ */
export const BasicCard = styled.div`
  background: var(--card-bg, #1e1e1e);
  padding: 16px;
  border-radius: var(--radius, 8px);
  margin: 8px auto 0;
  color: var(--text, #fff);
  max-width: 600px;
  width: 100%;
  border: 1px solid var(--border, #444);
  box-shadow: var(--shadow);
`;

/* ------------------ Back Button ------------------ */
export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--yellow);
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease;

  &:hover {
    background: var(--yellow-dark);
  }

  &:focus-visible {
    outline: 2px solid var(--ocean-blue);
  }
`;

export const BackIcon = styled(ArrowBackIcon)`
  font-size: 16px;
`;

/* ------------------ Form Layout ------------------ */
export const AdvancedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const AdvancedField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const AdvancedLabel = styled.label`
  font-size: 13px;
  margin-bottom: 4px;
  color: var(--text, #fff);
`;

/* ------------------ Shared Input Styles ------------------ */
const inputStyles = css`
  padding: 6px;
  border-radius: 6px;
  border: 1px solid var(--border, #555);
  font-size: 13px;
  width: 100%;
  background-color: #fff;
  color: #111;

  &:focus {
    outline: 2px solid var(--ocean-blue);
  }
`;

export const AdvancedInput = styled.input`
  ${inputStyles}
`;

export const AdvancedSelect = styled.select`
  ${inputStyles}
`;

/* ------------------ Buttons ------------------ */
export const SearchBtn = styled.button`
  background: var(--yellow);
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, transform 0.1s ease;

  &:hover {
    background: var(--yellow-dark);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid var(--ocean-blue);
  }
`;

export const ClearBtn = styled.button`
  background: #ffffff;
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #ef4444;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #fef2f2;
    color: #dc2626;
    border-color: #dc2626;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--ocean-blue);
  }
`;

/* ------------------ Info ------------------ */
export const SearchCount = styled.span`
  font-size: 12px;
  color: var(--text-muted, #aaa);
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

export const SearchUrl = styled.p`
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-muted, #aaa);
  word-break: break-word;
`;

/* ------------------ Layout ------------------ */
export const MainView = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  height: 100vh;
  padding: 10px 16px;
  gap: 4px;
  box-sizing: border-box;
`;

export const ChroniclesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const NoteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  padding-right: 6px;
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #444 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 3px;
  }
`;