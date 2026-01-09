import maps from './maps.json'
import styles from './App.module.scss'

const sortedMaps = [...maps].sort((a, b) => a.name.localeCompare(b.name))

export function App() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>RA2 Maps</h1>
      <div className={styles.grid}>
        {sortedMaps.map((map) => (
          <div key={map.path} className={styles.cell}>
            <img
              src={`/maps/${map.path}`}
              alt={map.name}
              className={styles.image}
            />
            <span className={styles.name}>{map.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
