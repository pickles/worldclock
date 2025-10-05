import React, { useState, useEffect, useRef } from 'react'
import { Plus, X, Globe } from 'lucide-react'
import ClockCard from './components/ClockCard'
import AddClockModal from './components/AddClockModal'
import { getTimezoneList } from './utils/timezones'
import './App.css'

function App() {
  const [clocks, setClocks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loaded, setLoaded] = useState(false) // 初期ロード完了フラグ
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const dragFromIndexRef = useRef(null)

  // タイムゾーンリストを取得
  const timezones = getTimezoneList()

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
            setClocks(parsed)
          } else {
            console.warn('保存フォーマットが不正のため初期化します')
          }
        } catch (e) {
          console.warn('JSONパースに失敗したため初期化します')
        }
      }
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

  // 時計を追加
  const addClock = (cityName) => {
    // 完全一致または部分一致を探す
    let timezone = timezones[cityName]
    if (!timezone) {
      const matches = Object.keys(timezones).filter(city => 
        city.toLowerCase().includes(cityName.toLowerCase())
      )
      if (matches.length > 0) {
        timezone = timezones[matches[0]]
        cityName = matches[0] // 正式な都市名を使用
      }
    }

    if (!timezone) {
      throw new Error('対応していない都市です。候補から選択してください。')
    }

    // 既に追加されているかチェック
    if (clocks.some(clock => clock.city === cityName)) {
      throw new Error('この都市の時計は既に追加されています。')
    }

    const clockData = {
      id: Date.now(),
      city: cityName,
      timezone: timezone
    }

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
    <div className="app">
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
          />
          
          {/* 追加された時計 */}
          {clocks.map((clock) => (
            <ClockCard
              key={clock.id}
              city={clock.city}
              timezone={clock.timezone}
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
            />
          ))}
        </div>
      </main>

      {/* 都市追加モーダル */}
      <AddClockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddClock={addClock}
        timezones={timezones}
      />
    </div>
  )
}

export default App