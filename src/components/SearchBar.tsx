import { forwardRef } from 'react'
import { useStableCallback } from '../hooks/useStableCallback'
import { getKeyCombo, Key } from '../utils/keyboard'
import styles from '../App.module.scss'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onArrowDown: () => void
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, onArrowDown }, ref) => {
    const onKeyDown = useStableCallback((e: React.KeyboardEvent) => {
      if (getKeyCombo(e) === Key.ArrowDown) {
        e.preventDefault()
        onArrowDown()
      }
    })

    return (
      <input
        ref={ref}
        type="text"
        className={styles.search}
        placeholder="Search maps..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    )
  },
)
