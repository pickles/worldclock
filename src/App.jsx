import React, { useState, useEffect } from 'react'
import { Plus, X, Globe } from 'lucide-react'
import ClockCard from './components/ClockCard'
import AddClockModal from './components/AddClockModal'
import { getTimezoneList } from './utils/timezones'
import './App.css'

function App() {
  const [clocks, setClocks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

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
        setClocks(JSON.parse(saved))
      }
    } catch (error) {
      console.error('設定の読み込みでエラーが発生しました:', error)
    }
  }, [])

  // 設定をローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('worldClockSettings', JSON.stringify(clocks))
  }, [clocks])

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
          {clocks.map(clock => (
            <ClockCard
              key={clock.id}
              city={clock.city}
              timezone={clock.timezone}
              currentTime={currentTime}
              isRemovable={true}
              onRemove={() => removeClock(clock.id)}
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