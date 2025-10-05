import React, { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

const AddClockModal = ({ isOpen, onClose, onAddClock, timezones }) => {
  const [cityInput, setCityInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  // モーダルが開いた時にフォーカス
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // 入力値が変更された時の処理
  const handleInputChange = (e) => {
    const value = e.target.value
    setCityInput(value)
    setError('')

    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // 候補都市を検索
    const matches = Object.keys(timezones).filter(city => 
      city.toLowerCase().includes(value.toLowerCase())
    )

    setSuggestions(matches.slice(0, 5))
    setShowSuggestions(matches.length > 0)
  }

  // 候補を選択
  const handleSuggestionClick = (city) => {
    setCityInput(city)
    setShowSuggestions(false)
  }

  // 時計を追加
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!cityInput.trim()) {
      setError('都市名を入力してください。')
      return
    }

    try {
      onAddClock(cityInput.trim())
      handleClose()
    } catch (err) {
      setError(err.message)
    }
  }

  // モーダルを閉じる
  const handleClose = () => {
    setCityInput('')
    setSuggestions([])
    setShowSuggestions(false)
    setError('')
    onClose()
  }

  // Escキーでモーダルを閉じる
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  // モーダルが閉じている場合は何も表示しない
  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={handleKeyDown}
    >
      <div className="modal-content">
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
                autoComplete="off"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((city, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(city)}
                    >
                      {city}
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
              className="submit-btn"
              disabled={!cityInput.trim()}
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