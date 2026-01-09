import { useMemo, useState } from 'react'
import { Image } from 'antd'
import maps from './maps.json'
import styles from './App.module.scss'

const sortedMaps = [...maps].sort((a, b) => a.name.localeCompare(b.name))

function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  let queryIndex = 0
  for (const char of lowerText) {
    if (char === lowerQuery[queryIndex]) {
      queryIndex++
      if (queryIndex === lowerQuery.length) return true
    }
  }
  return queryIndex === lowerQuery.length
}

export function App() {
  const [search, setSearch] = useState('')

  const filteredMaps = useMemo(() => {
    if (!search.trim()) return sortedMaps
    return sortedMaps.filter((map) => fuzzyMatch(map.name, search))
  }, [search])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>RA2 Maps</h1>
      <input
        type="text"
        className={styles.search}
        placeholder="Search maps..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Image.PreviewGroup>
        <div className={styles.grid}>
          {filteredMaps.map((map) => (
            <div key={map.path} className={styles.cell}>
              <Image
                src={`/maps/${map.path}`}
                alt={map.name}
                className={styles.image}
                preview={{ mask: null }}
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
  )
}
