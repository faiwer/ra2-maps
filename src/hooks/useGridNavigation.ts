import { useRef, useEffect } from 'react';
import { useStableCallback } from './useStableCallback';
import { getKeyCombo, Key } from '../utils/keyboard';

interface UseGridNavigationOptions {
  totalItems: number;
  previewOpen: boolean;
  onEscape: () => void;
  onEnter: (index: number) => void;
  onExitTop: () => void;
}

export function useGridNavigation({
  totalItems,
  previewOpen,
  onEscape,
  onEnter,
  onExitTop,
}: UseGridNavigationOptions) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewOpenRef = useRef(false);

  // Keep ref in sync for use in event handlers
  useEffect(() => {
    previewOpenRef.current = previewOpen;
  }, [previewOpen]);

  const getColumnsCount = useStableCallback(() => {
    if (!gridRef.current) return 1;
    const gridStyle = getComputedStyle(gridRef.current);
    const columns = gridStyle.gridTemplateColumns.split(' ').length;
    return columns;
  });

  const focusCell = useStableCallback((index: number) => {
    cellRefs.current[index]?.focus();
  });

  const onCellKeyDown = useStableCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (previewOpenRef.current) return;

      const cols = getColumnsCount();
      const key = getKeyCombo(e);
      let nextIndex: number | null = null;

      switch (key) {
        case Key.ArrowDown:
          e.preventDefault();
          nextIndex = Math.min(index + cols, totalItems - 1);
          break;
        case Key.ArrowUp:
          e.preventDefault();
          if (index === 0) {
            onExitTop();
            return;
          }
          nextIndex = Math.max(index - cols, 0);
          break;
        case Key.ArrowRight:
          e.preventDefault();
          nextIndex = Math.min(index + 1, totalItems - 1);
          break;
        case Key.ArrowLeft:
          e.preventDefault();
          nextIndex = Math.max(index - 1, 0);
          break;
        case Key.Enter:
          e.preventDefault();
          onEnter(index);
          return;
        case Key.Escape:
          e.preventDefault();
          onEscape();
          return;
      }

      if (nextIndex !== null && nextIndex !== index) {
        cellRefs.current[nextIndex]?.focus();
      }
    },
  );

  return {
    gridRef,
    cellRefs,
    focusCell,
    onCellKeyDown,
  };
}
