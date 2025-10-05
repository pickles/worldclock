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
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
      const local = new Date(utc.toLocaleString("en-US", {timeZone: tz}))
      const offset = (local.getTime() - utc.getTime()) / (1000 * 60 * 60)
      return `UTC${offset >= 0 ? '+' : ''}${offset}`
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