import React from 'react'
import { X } from 'lucide-react'

const ClockCard = ({ 
  city, 
  timezone, 
  description, 
  currentTime, 
  isRemovable = false, 
  onRemove 
}) => {
  // タイムゾーンオフセットを取得
  const getTimezoneOffset = (tz) => {
    try {
      const now = new Date()
      // Get UTC time reference
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
      // Local time in target timezone via locale conversion
      const local = new Date(utc.toLocaleString('en-US', { timeZone: tz }))
      let rawOffset = (local.getTime() - utc.getTime()) / (1000 * 60 * 60) // hours (can be fractional)

      // Handle floating point precision (e.g. 5.499999999)
      const sign = rawOffset >= 0 ? '+' : '-'
      rawOffset = Math.abs(rawOffset)
      let hours = Math.floor(rawOffset)
      let minutes = Math.round((rawOffset - hours) * 60)
      if (minutes === 60) { // normalize overflow
        hours += 1
        minutes = 0
      }
      const hh = String(hours).padStart(2, '0')
      const mm = String(minutes).padStart(2, '0')
      return `UTC${sign}${hh}:${mm}`
    } catch (e) {
      return 'UTC'
    }
  }

  // 時刻フォーマット
  const formatTime = () => {
    try {
      const options = {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
      return currentTime.toLocaleTimeString('ja-JP', options)
    } catch (e) {
      return '--:--:--'
    }
  }

  // 日付フォーマット
  const formatDate = () => {
    try {
      const dateOptions = {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
      return currentTime.toLocaleDateString('ja-JP', dateOptions)
    } catch (e) {
      return '----/--/--'
    }
  }

  // 時間帯分類 (dawn/day/dusk/night)
  const getPhaseClass = () => {
    try {
      const options = { timeZone: timezone, hour12: false, hour: '2-digit' }
      const hourStr = currentTime.toLocaleTimeString('en-US', options).slice(0,2)
      const hour = parseInt(hourStr, 10)
      if (hour >= 4 && hour <= 6) return 'clock--dawn'
      if (hour >= 7 && hour <= 16) return 'clock--day'
      if (hour >= 17 && hour <= 19) return 'clock--dusk'
      return 'clock--night'
    } catch {
      return ''
    }
  }

  const phaseClass = getPhaseClass()

  return (
    <div className={`clock-card ${phaseClass}`} data-timezone={timezone}>
      <div className="clock-header">
        <h2 className="clock-title">{city}</h2>
        <span className="timezone-info">
          {description || getTimezoneOffset(timezone)}
        </span>
      </div>
      
      <div className="time-display">
        <span className="time-text" aria-label="現在時刻">
          {formatTime()}
        </span>
      </div>
      
      <div className="date-display">
        <span className="date-text" aria-label="日付">
          {formatDate()}
        </span>
      </div>

      {isRemovable && (
        <button 
          className="remove-btn" 
          onClick={onRemove}
          aria-label="時計を削除"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default ClockCard