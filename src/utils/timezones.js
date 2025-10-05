// 主要都市のタイムゾーンマッピング
export const getTimezoneList = () => {
  return {
    'Tokyo': 'Asia/Tokyo',
    'New York': 'America/New_York',
    'London': 'Europe/London',
    'Paris': 'Europe/Paris',
    'Berlin': 'Europe/Berlin',
    'Sydney': 'Australia/Sydney',
    'Los Angeles': 'America/Los_Angeles',
    'Chicago': 'America/Chicago',
    'Moscow': 'Europe/Moscow',
    'Dubai': 'Asia/Dubai',
    'Singapore': 'Asia/Singapore',
    'Hong Kong': 'Asia/Hong_Kong',
    'Seoul': 'Asia/Seoul',
    'Mumbai': 'Asia/Kolkata',
    'Bangkok': 'Asia/Bangkok',
    'Manila': 'Asia/Manila',
    'Jakarta': 'Asia/Jakarta',
    'Beijing': 'Asia/Shanghai',
    'Shanghai': 'Asia/Shanghai',
    'Taipei': 'Asia/Taipei',
    'Amsterdam': 'Europe/Amsterdam',
    'Rome': 'Europe/Rome',
    'Madrid': 'Europe/Madrid',
    'Stockholm': 'Europe/Stockholm',
    'Vienna': 'Europe/Vienna',
    'Cairo': 'Africa/Cairo',
    'Johannesburg': 'Africa/Johannesburg',
    'Lagos': 'Africa/Lagos',
    'Toronto': 'America/Toronto',
    'Vancouver': 'America/Vancouver',
    'Mexico City': 'America/Mexico_City',
    'São Paulo': 'America/Sao_Paulo',
    'Buenos Aires': 'America/Argentina/Buenos_Aires',
    'Lima': 'America/Lima',
    'Santiago': 'America/Santiago',
    'Auckland': 'Pacific/Auckland',
    'Melbourne': 'Australia/Melbourne',
    'Perth': 'Australia/Perth',
    'Zurich': 'Europe/Zurich',
    'Geneva': 'Europe/Zurich',
    'Brussels': 'Europe/Brussels',
    'Copenhagen': 'Europe/Copenhagen',
    'Oslo': 'Europe/Oslo',
    'Helsinki': 'Europe/Helsinki',
    'Istanbul': 'Europe/Istanbul',
    'Tel Aviv': 'Asia/Jerusalem',
    'Riyadh': 'Asia/Riyadh',
    'Kuwait': 'Asia/Kuwait',
    'Doha': 'Asia/Qatar',
    'Muscat': 'Asia/Muscat',
    'Karachi': 'Asia/Karachi',
    'Dhaka': 'Asia/Dhaka',
    'Colombo': 'Asia/Colombo',
    'Kathmandu': 'Asia/Kathmandu',
    'Almaty': 'Asia/Almaty',
    'Tashkent': 'Asia/Tashkent',
    'Frankfurt': 'Europe/Berlin',
    'Munich': 'Europe/Berlin',
    'Prague': 'Europe/Prague',
    'Warsaw': 'Europe/Warsaw',
    'Budapest': 'Europe/Budapest',
    'Bucharest': 'Europe/Bucharest',
    'Athens': 'Europe/Athens',
    'Lisbon': 'Europe/Lisbon',
    'Dublin': 'Europe/Dublin',
    'Edinburgh': 'Europe/London',
    'Manchester': 'Europe/London',
    'Barcelona': 'Europe/Madrid',
    'Valencia': 'Europe/Madrid',
    'Milan': 'Europe/Rome',
    'Naples': 'Europe/Rome',
    'Lyon': 'Europe/Paris',
    'Marseille': 'Europe/Paris',
    'Hamburg': 'Europe/Berlin',
    'Cologne': 'Europe/Berlin',
    'Rotterdam': 'Europe/Amsterdam',
    'The Hague': 'Europe/Amsterdam'
  }
}

// タイムゾーンオフセットを計算
export const getTimezoneOffset = (timezone) => {
  try {
    const now = new Date()
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
    const local = new Date(utc.toLocaleString("en-US", {timeZone: timezone}))
    const offset = (local.getTime() - utc.getTime()) / (1000 * 60 * 60)
    return `UTC${offset >= 0 ? '+' : ''}${offset}`
  } catch (e) {
    return 'UTC'
  }
}

// 都市名から地域情報を取得
export const getCityRegion = (cityName) => {
  const regionMap = {
    'Tokyo': 'アジア',
    'Seoul': 'アジア',
    'Beijing': 'アジア',
    'Shanghai': 'アジア',
    'Hong Kong': 'アジア',
    'Singapore': 'アジア',
    'Bangkok': 'アジア',
    'Manila': 'アジア',
    'Jakarta': 'アジア',
    'Mumbai': 'アジア',
    'Dubai': '中東',
    'Riyadh': '中東',
    'Tel Aviv': '中東',
    'London': 'ヨーロッパ',
    'Paris': 'ヨーロッパ',
    'Berlin': 'ヨーロッパ',
    'Rome': 'ヨーロッパ',
    'Madrid': 'ヨーロッパ',
    'Amsterdam': 'ヨーロッパ',
    'Moscow': 'ヨーロッパ',
    'New York': '北米',
    'Los Angeles': '北米',
    'Chicago': '北米',
    'Toronto': '北米',
    'Vancouver': '北米',
    'Mexico City': '北米',
    'São Paulo': '南米',
    'Buenos Aires': '南米',
    'Lima': '南米',
    'Santiago': '南米',
    'Sydney': 'オセアニア',
    'Melbourne': 'オセアニア',
    'Auckland': 'オセアニア',
    'Cairo': 'アフリカ',
    'Johannesburg': 'アフリカ',
    'Lagos': 'アフリカ'
  }
  
  return regionMap[cityName] || '其他'
}