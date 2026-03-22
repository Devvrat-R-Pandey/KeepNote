import styled from "styled-components";
import CircleIcon from "@mui/icons-material/Circle";

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
  padding: 6px 10px;
  border-radius: var(--radius, 6px);
  background: var(--card-bg, #1a1a1a);
  font-size: 11px;
  box-shadow: var(--shadow, 0 1px 2px rgba(0,0,0,0.1));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;
  transform-origin: center center;

  &:hover {
    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
  }
`;

/* ------------------ Header ------------------ */
export const CardHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

/* ------------------ Title ------------------ */
export const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
  color: var(--text-primary, #fff);
`;

/* ------------------ Description ------------------ */
export const CardDesc = styled.p`
  font-size: 11px;
  margin-bottom: 4px;
  color: var(--text-secondary, #ccc);
  flex-grow: 1;
`;

/* ------------------ Meta Info ------------------ */
export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 4px;
`;

export const PriorityDot = styled(CircleIcon)<{ level: "high" | "medium" | "low" }>`
  && {
    width: 10px;
    height: 10px;
    margin-right: 4px;
    color: ${({ level }) =>
      level === "high"
        ? "var(--priority-high, #ef4444)"
        : level === "medium"
        ? "var(--priority-medium, #facc15)"
        : "var(--priority-low, #22c55e)"};
  }
`;

/* ------------------ Category Label ------------------ */
export const CategoryLabel = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 12px;
  border: 1px solid #fff;
  color: #fff;
  background: #494848;
  white-space: nowrap;
  max-width: max-content;
  margin-top: 2px;
`;

/* ------------------ Status Label ------------------ */
export const StatusLabel = styled.span<{ status: string }>`
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
  color: ${({ status }) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "var(--status-completed, #22c55e)";
      case "in-progress":
        return "var(--status-in-progress, #3b82f6)";
      case "yet-to-start":
        return "var(--status-yet, #facc15)";
      default:
        return "#ccc";
    }
  }};
`;

/* ------------------ Actions ------------------ */
export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
`;

export const EditActionIcon = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #3b82f6;

  &:hover {
    transform: scale(1.1);
  }
`;

export const DeleteActionIcon = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ef4444;

  &:hover {
    transform: scale(1.1);
  }
`;