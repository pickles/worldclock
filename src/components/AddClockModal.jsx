import React, { useState, useRef, useEffect, useMemo } from 'react'
import { X } from 'lucide-react'
import { searchCityTimezones, getPopularCities } from '../utils/timezones'

const MAX_SUGGESTIONS = 8

const AddClockModal = ({ isOpen, onClose, onAddClock }) => {
  const [cityInput, setCityInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const popularCities = useMemo(() => getPopularCities(MAX_SUGGESTIONS), [])

  useEffect(() => {
    if (isOpen) {
      setCityInput('')
      setSuggestions(popularCities)
      setShowSuggestions(true)
      setHighlightedIndex(-1)
      setSelectedSuggestion(null)
      setError('')
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen, popularCities])

  const updateSuggestions = (value) => {
    if (!value.trim()) {
      setSuggestions(popularCities)
      setShowSuggestions(true)
      setHighlightedIndex(-1)
      return
    }

    const results = searchCityTimezones(value, { limit: MAX_SUGGESTIONS })
    setSuggestions(results)
    setShowSuggestions(results.length > 0)
    setHighlightedIndex(results.length ? 0 : -1)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setCityInput(value)
    setSelectedSuggestion(null)
    setError('')
    updateSuggestions(value)
  }

  const handleSuggestionSelect = (option) => {
    setCityInput(option.label)
    setSelectedSuggestion(option)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = cityInput.trim()
    if (!trimmed) {
      setError('都市名を入力してください')
      return
    }

    try {
      onAddClock({
        inputValue: trimmed,
        suggestionId: selectedSuggestion?.id || null
      })
      handleClose()
    } catch (err) {
      setError(err.message || '時計の追加に失敗しました')
    }
  }

  const handleOverlayKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
      return
    }

    if (!showSuggestions || !suggestions.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => {
        const next = prev + 1
        return next >= suggestions.length ? 0 : next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => {
        if (prev <= 0) return suggestions.length - 1
        return prev - 1
      })
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      const option = suggestions[highlightedIndex]
      if (option) {
        handleSuggestionSelect(option)
      }
    }
  }

  const handleClose = () => {
    setCityInput('')
    setSuggestions(popularCities)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    setSelectedSuggestion(null)
    setError('')
    onClose()
  }

  const isSubmitDisabled = !cityInput.trim()

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={handleOverlayKeyDown}
    >
      <div className="modal-content" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3 className="modal-title">時計を追加</h3>
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="モーダルを閉じる"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="city-input" className="form-label">
              都市名を入力:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                id="city-input"
                type="text"
                className="city-input"
                placeholder="例: Tokyo, New York, London"
                value={cityInput}
                onChange={handleInputChange}
                onFocus={() => {
                  if (!cityInput) {
                    setShowSuggestions(true)
                  }
                }}
                onKeyDown={handleInputKeyDown}
                autoComplete="off"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions" role="listbox">
                  {suggestions.map((option, index) => (
                    <div
                      key={option.id}
                      className={`suggestion-item ${index === highlightedIndex ? 'active' : ''}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionSelect(option)}
                      role="option"
                      aria-selected={index === highlightedIndex}
                    >
                      <div className="suggestion-label">{option.label}</div>
                      <div className="suggestion-subtext">{option.timezone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`submit-btn ${isSubmitDisabled ? 'submit-btn--disabled' : ''}`}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddClockModal
