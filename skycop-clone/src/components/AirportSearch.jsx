import { useState, useRef, useEffect, useCallback } from 'react'
import europeanAirports from '../data/airports'
import './AirportSearch.css'

const normalize = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const searchAirports = (query) => {
  if (!query || query.length < 2) return []

  const q = normalize(query.trim())

  // Score each airport based on match quality
  const scored = europeanAirports
    .map((airport) => {
      const iata = airport.iata.toLowerCase()
      const city = normalize(airport.city)
      const name = normalize(airport.name)
      const country = normalize(airport.country)

      let score = 0

      // Exact IATA match — highest priority
      if (iata === q) score = 100
      // IATA starts with query
      else if (iata.startsWith(q)) score = 90
      // City exact match
      else if (city === q) score = 85
      // City starts with query
      else if (city.startsWith(q)) score = 80
      // Name starts with query
      else if (name.startsWith(q)) score = 70
      // City contains query
      else if (city.includes(q)) score = 60
      // Name contains query
      else if (name.includes(q)) score = 50
      // Country starts with query
      else if (country.startsWith(q)) score = 40
      // Country contains query
      else if (country.includes(q)) score = 30
      // IATA contains query
      else if (iata.includes(q)) score = 20

      return { ...airport, score }
    })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  return scored
}

const AirportSearch = ({ placeholder = 'Search airport...', value, onChange, icon }) => {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync external value
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value)
    }
  }, [value])

  const handleInput = useCallback((e) => {
    const val = e.target.value
    setQuery(val)
    setActiveIndex(-1)

    if (val.length >= 2) {
      const matches = searchAirports(val)
      setResults(matches)
      setIsOpen(matches.length > 0)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [])

  const selectAirport = useCallback(
    (airport) => {
      const display = `${airport.city} (${airport.iata})`
      setQuery(display)
      setIsOpen(false)
      setResults([])
      onChange?.(airport)
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (activeIndex >= 0 && results[activeIndex]) {
            selectAirport(results[activeIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          break
      }
    },
    [isOpen, results, activeIndex, selectAirport]
  )

  const handleFocus = useCallback(() => {
    if (query.length >= 2) {
      const matches = searchAirports(query)
      if (matches.length > 0) {
        setResults(matches)
        setIsOpen(true)
      }
    }
  }, [query])

  // Country flag emoji from country code
  const getFlag = (countryCode) => {
    try {
      return countryCode
        .toUpperCase()
        .split('')
        .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
        .join('')
    } catch {
      return ''
    }
  }

  // Highlight matched text
  const highlightMatch = (text, query) => {
    if (!query || query.length < 2) return text
    const q = normalize(query.trim())
    const normalizedText = normalize(text)
    const idx = normalizedText.indexOf(q)
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark>{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    )
  }

  return (
    <div className="airport-search" ref={wrapperRef}>
      <div className="airport-search__input-wrap">
        {icon && <span className="airport-search__icon">{icon}</span>}
        <input
          ref={inputRef}
          type="text"
          className="airport-search__input"
          placeholder={placeholder}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {query.length > 0 && (
          <button
            className="airport-search__clear"
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
              onChange?.(null)
              inputRef.current?.focus()
            }}
            aria-label="Clear"
          >
            &times;
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="airport-search__dropdown" role="listbox">
          {results.map((airport, i) => (
            <li
              key={airport.iata + i}
              className={`airport-search__item ${i === activeIndex ? 'airport-search__item--active' : ''}`}
              onClick={() => selectAirport(airport)}
              onMouseEnter={() => setActiveIndex(i)}
              role="option"
              aria-selected={i === activeIndex}
            >
              <span className="airport-search__item-flag">
                {getFlag(airport.countryCode)}
              </span>
              <div className="airport-search__item-info">
                <span className="airport-search__item-city">
                  {highlightMatch(airport.city, query)}
                </span>
                <span className="airport-search__item-name">
                  {highlightMatch(airport.name, query)}
                </span>
              </div>
              <span className="airport-search__item-iata">
                {highlightMatch(airport.iata, query)}
              </span>
              <span className="airport-search__item-country">
                {airport.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AirportSearch
