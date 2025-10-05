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
  // Helper: compute offset minutes for a given date/timezone using Intl parts (robust across DST)
  const getOffsetMinutes = (date, tz) => {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    })
    const parts = dtf.formatToParts(date)
    const map = {}
    for (const p of parts) { if (p.type !== 'literal') map[p.type] = p.value }
    const syntheticUTC = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour),
      Number(map.minute),
      Number(map.second)
    )
    let offsetMinutes = Math.round((syntheticUTC - date.getTime()) / 60000)
    if (offsetMinutes === 1440 || offsetMinutes === -1440) offsetMinutes = 0
    return offsetMinutes
  }

  const formatOffset = (offsetMinutes) => {
    const sign = offsetMinutes >= 0 ? '+' : '-'
    const abs = Math.abs(offsetMinutes)
    const h = Math.floor(abs / 60)
    const m = abs % 60
    return `UTC${sign}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
  }

  const getTimezoneOffset = (tz) => {
    try {
      const now = new Date()
      const current = getOffsetMinutes(now, tz)
      // Sample Jan 1 and Jul 1 to infer standard offset (works for both hemispheres)
      const year = now.getUTCFullYear()
      const jan = new Date(Date.UTC(year, 0, 1, 12, 0, 0)) // midday to avoid edge cases
      const jul = new Date(Date.UTC(year, 6, 1, 12, 0, 0))
      const offJan = getOffsetMinutes(jan, tz)
      const offJul = getOffsetMinutes(jul, tz)

      let standard = offJan
      if (offJan !== offJul) {
        // Determine which is standard: standard + 60 == DST (DST shifts +1h local time)
        if (offJan + 60 === offJul) {
          standard = offJan
        } else if (offJul + 60 === offJan) {
            standard = offJul
        } else {
          // Fallback: pick the one whose absolute value is farther from zero for negative zones, else nearer for positive
          // but this is rare; keep offJan as default.
        }
      }

      const isDST = current !== standard
      if (isDST) {
        // Show standard primary per user expectation (e.g., LA => UTC-08:00) and annotate current DST
        return `${formatOffset(standard)} (DST: ${formatOffset(current)})`
      }
      return formatOffset(standard)
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