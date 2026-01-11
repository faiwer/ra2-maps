import { useState } from 'react';
import { Image } from 'antd';
import { useGridNavigation } from './hooks/useGridNavigation';
import { useFilteredMaps } from './hooks/useFilteredMaps';
import { useAutoFocus } from './hooks/useAutoFocus';
import { useStableCallback } from './hooks/useStableCallback';
import { SearchBar } from './components/SearchBar';
import styles from './App.module.scss';

export function App() {
  const [search, setSearch] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const searchRef = useAutoFocus<HTMLInputElement>();

  const filteredMaps = useFilteredMaps(search);

  const { gridRef, cellRefs, focusCell, onCellKeyDown } = useGridNavigation({
    totalItems: filteredMaps.length,
    previewOpen,
    onEnter: useStableCallback((index: number) => {
      const img = cellRefs.current[index]?.querySelector(
        '.ant-image img',
      ) as HTMLElement;
      img?.click();
    }),
    onEscape: useStableCallback(() => {
      searchRef.current?.focus();
    }),
    onExitTop: useStableCallback(() => {
      searchRef.current?.focus();
    }),
  });

  const onSearchBarArrowDown = useStableCallback(() => {
    if (filteredMaps.length > 0) {
      focusCell(0);
    }
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>RA2 Maps</h1>
      <SearchBar
        ref={searchRef}
        value={search}
        onChange={setSearch}
        onArrowDown={onSearchBarArrowDown}
      />
      <Image.PreviewGroup
        // It seems antd has a bug. They don't update the inner cache of the
        // rendered images once they are updated. It does it only on the
        // `<PreviewGroup />` level during a regular render.
        key={search}
        preview={{
          // @ts-expect-error Not typed on the lib's side :(
          onOpenChange: (visible) => setPreviewOpen(visible),
        }}
      >
        <div ref={gridRef} className={styles.grid}>
          {filteredMaps.map((map, index) => (
            <div
              key={map.path}
              ref={(el) => {
                cellRefs.current[index] = el;
              }}
              className={styles.cell}
              tabIndex={0}
              onKeyDown={(e) => onCellKeyDown(e, index)}
            >
              <Image
                src={`maps/${map.path.replace('.jpg', '.min.jpg')}`}
                alt={map.name}
                className={styles.image}
                preview={{ src: `maps/${map.path}`, mask: null }}
              />
              <span className={styles.name}>{map.name}</span>
            </div>
          ))}
        </div>
      </Image.PreviewGroup>
      {filteredMaps.length === 0 && (
        <p className={styles.noResults}>No maps found</p>
      )}
    </div>
  );
}
