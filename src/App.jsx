import React, { useState, useEffect, useRef } from 'react'
import { Plus, Globe } from 'lucide-react'
import ClockCard from './components/ClockCard'
import AddClockModal from './components/AddClockModal'
import { resolveCityTimezone, getCityOptionById, getCityRegion } from './utils/timezones'
import './App.css'

const createClockId = () => Date.now() + Math.floor(Math.random() * 1000)

const buildClockData = (option, overrides = {}) => {
  const base = {
    id: overrides.id ?? createClockId(),
    cityId: option?.id ?? overrides.cityId ?? null,
    city: option?.city ?? overrides.city ?? '',
    label: option?.label ?? overrides.label ?? option?.city ?? overrides.city ?? '',
    country: option?.country ?? overrides.country ?? '',
    timezone: option?.timezone ?? overrides.timezone ?? 'UTC',
    iso2: option?.iso2 ?? overrides.iso2 ?? null
  }

  return {
    ...base,
    region: overrides.region ?? getCityRegion(option || base.iso2 || base.country)
  }
}

const normalizeSavedClock = (entry) => {
  if (!entry) return null

  let option = null
  if (entry.cityId) {
    option = getCityOptionById(entry.cityId)
  }
  if (!option && entry.label) {
    option = resolveCityTimezone(entry.label)
  }
  if (!option && entry.city) {
    option = resolveCityTimezone(entry.city)
  }

  if (option) {
    return buildClockData(option, { id: entry.id ?? createClockId() })
  }

  if (entry.city && entry.timezone) {
    return buildClockData(null, {
      id: entry.id ?? createClockId(),
      cityId: entry.cityId ?? null,
      city: entry.city,
      label: entry.label ?? entry.city,
      country: entry.country ?? '',
      timezone: entry.timezone,
      iso2: entry.iso2 ?? null,
      region: entry.region ?? getCityRegion(entry.iso2 ?? entry.country ?? null)
    })
  }

  return null
}

function App() {
  const [clocks, setClocks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loaded, setLoaded] = useState(false) // 初期ロード完了フラグ
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const dragFromIndexRef = useRef(null)
  const [compact, setCompact] = useState(false)

  // 時刻更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem('worldClockSettings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            const normalized = parsed
              .map((entry) => normalizeSavedClock(entry))
              .filter(Boolean)
            setClocks(normalized)
          } else {
            console.warn('保存フォーマットが不正のため初期化します')
          }
        } catch (e) {
          console.warn('JSONパースに失敗したため初期化します')
        }
      }
      const compactPref = localStorage.getItem('worldClockCompactMode')
      if (compactPref === 'true') setCompact(true)
    } catch (error) {
      console.error('設定の読み込みでエラーが発生しました:', error)
    } finally {
      setLoaded(true)
    }
  }, [])

  // 設定をローカルストレージに保存
  useEffect(() => {
    if (!loaded) return // 初期ロード完了前は空配列で上書きしない
    try {
      localStorage.setItem('worldClockSettings', JSON.stringify(clocks))
    } catch (e) {
      console.error('設定の保存に失敗しました:', e)
    }
  }, [clocks, loaded])

  // コンパクトモード保存
  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem('worldClockCompactMode', compact ? 'true' : 'false') } catch {}
  }, [compact, loaded])

  const toggleCompact = () => setCompact(c => !c)

  // 時計を追加
  const addClock = ({ inputValue, suggestionId }) => {
    const trimmed = (inputValue || '').trim()
    if (!trimmed) {
      throw new Error('都市名を入力してください')
    }

    let option = null
    if (suggestionId) {
      option = getCityOptionById(suggestionId)
    }
    if (!option) {
      option = resolveCityTimezone(trimmed)
    }

    if (!option) {
      throw new Error('対応していない都市です')
    }

    if (clocks.some(clock => clock.cityId === option.id)) {
      throw new Error('この都市の時計は既に追加されています')
    }

    const clockData = buildClockData(option)
    setClocks(prev => [...prev, clockData])
  }

  // 時計を削除
  const removeClock = (clockId) => {
    setClocks(prev => prev.filter(clock => clock.id !== clockId))
  }

  // DnD: 並べ替え実行
  const reorder = (fromIdx, toIdx) => {
    setClocks(prev => {
      if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || fromIdx >= prev.length || toIdx >= prev.length) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      return next
    })
  }

  const handleDragStart = (id) => (e) => {
    setDraggingId(id)
    dragFromIndexRef.current = clocks.findIndex(c => c.id === id)
    e.dataTransfer.effectAllowed = 'move'
    try { e.dataTransfer.setData('text/plain', String(id)) } catch {}
  }

  const handleDragEnter = (id) => (e) => {
    e.preventDefault()
    if (id !== draggingId) {
      setDragOverId(id)
    }
  }

  const handleDragOver = (id) => (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (id) => (e) => {
    e.preventDefault()
    const fromIdx = dragFromIndexRef.current
    const toIdx = clocks.findIndex(c => c.id === id)
    reorder(fromIdx, toIdx)
    setDraggingId(null)
    setDragOverId(null)
    dragFromIndexRef.current = null
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverId(null)
    dragFromIndexRef.current = null
  }

  return (
    <div className={`app ${compact ? 'compact-mode' : ''}`}> 
      <header className="header">
        <h1 className="title">
          <Globe className="globe-icon" />
          世界時計
        </h1>
        <button 
          className="add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          時計を追加
        </button>
        <button
          className={`compact-toggle ${compact ? 'active' : ''}`}
          onClick={toggleCompact}
          aria-pressed={compact}
          aria-label="コンパクトモード切り替え"
        >{compact ? '通常表示' : 'コンパクト'}</button>
      </header>

      <main className="main">
        <div className="clocks-container">
          {/* UTC時計は常に表示 */}
          <ClockCard
            city="UTC"
            timezone="UTC"
            description="協定世界時"
            currentTime={currentTime}
            isRemovable={false}
            compact={compact}
          />
          
          {/* 追加された時計 */}
          {clocks.map((clock) => (
            <ClockCard
              key={clock.id}
              city={clock.city}
              timezone={clock.timezone}
              description={clock.region || clock.country}
              currentTime={currentTime}
              isRemovable={true}
              onRemove={() => removeClock(clock.id)}
              draggable
              onDragStart={handleDragStart(clock.id)}
              onDragEnter={handleDragEnter(clock.id)}
              onDragOver={handleDragOver(clock.id)}
              onDrop={handleDrop(clock.id)}
              onDragEnd={handleDragEnd}
              isDragging={draggingId === clock.id}
              isDragOver={dragOverId === clock.id}
              compact={compact}
            />
          ))}
        </div>
      </main>

      {/* 都市追加モーダル */}
      <AddClockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddClock={addClock}
      />
    </div>
  )
}

export default App