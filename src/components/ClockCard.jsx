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

  return (
    <div className="clock-card" data-timezone={timezone}>
      <div className="clock-header">
        <h2 className="clock-title">{city}</h2>
        <span className="timezone-info">
          {description || getTimezoneOffset(timezone)}
        </span>
      </div>
      
      <div className="time-display">
        {formatTime()}
      </div>
      
      <div className="date-display">
        {formatDate()}
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