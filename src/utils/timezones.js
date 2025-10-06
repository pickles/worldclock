import cityTimezones from 'city-timezones'

const { findFromCityStateProvince, lookupViaCity, cityMapping } = cityTimezones

const buildCityId = (record) => [
  record.city,
  record.province || '',
  record.country,
  record.timezone
].join('|')

const buildCityLabel = (record) => {
  const parts = [record.city]
  const province = record.province && record.province !== record.country ? record.province : null
  if (province) parts.push(province)
  parts.push(record.country)
  return parts.filter(Boolean).join(', ')
}

const toCityOption = (record) => ({
  id: buildCityId(record),
  city: record.city,
  cityAscii: record.city_ascii,
  country: record.country,
  province: record.province,
  iso2: record.iso2,
  iso3: record.iso3,
  timezone: record.timezone,
  population: typeof record.pop === 'number' ? record.pop : 0,
  label: buildCityLabel(record)
})

const dedupeOptions = (records) => {
  const map = new Map()
  for (const record of records) {
    if (!record || !record.city || !record.timezone) continue
    const option = toCityOption(record)
    const existing = map.get(option.id)
    if (!existing || existing.population < option.population) {
      map.set(option.id, option)
    }
  }
  return Array.from(map.values())
}

const sortByPopulation = (options) => options.sort((a, b) => b.population - a.population)

const CITY_CACHE = (() => {
  const byId = new Map()
  const byCity = new Map()
  for (const record of cityMapping) {
    const option = toCityOption(record)
    const existing = byId.get(option.id)
    if (!existing || existing.population < option.population) {
      byId.set(option.id, option)
    }
    const cityKey = option.city.toLowerCase()
    const list = byCity.get(cityKey)
    if (list) {
      list.push(option)
    } else {
      byCity.set(cityKey, [option])
    }
  }
  for (const list of byCity.values()) {
    list.sort((a, b) => b.population - a.population)
  }
  return { byId, byCity }
})()

const POPULAR_CITIES = (() => {
  const unique = Array.from(CITY_CACHE.byId.values())
  return sortByPopulation(unique)
})()

export const getCityOptionById = (id) => {
  if (!id) return null
  return CITY_CACHE.byId.get(id) || null
}

export const getPopularCities = (limit = 12) => POPULAR_CITIES.slice(0, limit)

export const searchCityTimezones = (query, { limit = 10, minPopulation = 0 } = {}) => {
  if (!query || !query.trim()) return []
  const trimmed = query.trim()
  let records = findFromCityStateProvince(trimmed)
  if (!records.length) {
    records = lookupViaCity(trimmed)
    if (!records.length) {
      const cityList = CITY_CACHE.byCity.get(trimmed.toLowerCase())
      if (cityList) return cityList.slice(0, limit)
    }
  }

  const options = sortByPopulation(dedupeOptions(records))
  const filtered = options.filter(option => option.population >= minPopulation)
  const shortlist = filtered.length ? filtered : options
  return shortlist.slice(0, limit)
}

export const resolveCityTimezone = (input) => {
  if (!input || !input.trim()) return null
  const trimmed = input.trim()
  const suggestions = searchCityTimezones(trimmed, { limit: 10 })

  if (!suggestions.length) return null

  const lower = trimmed.toLowerCase()
  const labelMatch = suggestions.find(option => option.label.toLowerCase() === lower)
  if (labelMatch) return labelMatch

  const cityMatch = suggestions.find(option => option.city.toLowerCase() === lower)
  if (cityMatch) return cityMatch

  const cached = CITY_CACHE.byCity.get(lower)
  if (cached && cached.length) return cached[0]

  return suggestions[0]
}

const ISO2_TO_REGION = {
  AF: 'アジア', AL: 'ヨーロッパ', DZ: 'アフリカ', AO: 'アフリカ', AR: '南米', AT: 'ヨーロッパ', AU: 'オセアニア',
  AZ: 'アジア', BA: 'ヨーロッパ', BD: 'アジア', BE: 'ヨーロッパ', BF: 'アフリカ', BG: 'ヨーロッパ', BH: '中東',
  BI: 'アフリカ', BJ: 'アフリカ', BN: 'アジア', BO: '南米', BR: '南米', BS: '北米', BT: 'アジア', BW: 'アフリカ',
  BY: 'ヨーロッパ', BZ: '北米', CA: '北米', CD: 'アフリカ', CF: 'アフリカ', CG: 'アフリカ', CH: 'ヨーロッパ',
  CI: 'アフリカ', CL: '南米', CM: 'アフリカ', CN: 'アジア', CO: '南米', CR: '北米', CU: '北米', CY: 'ヨーロッパ',
  CZ: 'ヨーロッパ', DE: 'ヨーロッパ', DK: 'ヨーロッパ', DO: '北米', DZ: 'アフリカ', EC: '南米', EE: 'ヨーロッパ',
  EG: 'アフリカ', ES: 'ヨーロッパ', ET: 'アフリカ', FI: 'ヨーロッパ', FJ: 'オセアニア', FR: 'ヨーロッパ', GA: 'アフリカ',
  GB: 'ヨーロッパ', GE: 'アジア', GH: 'アフリカ', GM: 'アフリカ', GN: 'アフリカ', GQ: 'アフリカ', GR: 'ヨーロッパ',
  GT: '北米', GW: 'アフリカ', GY: '南米', HK: 'アジア', HN: '北米', HR: 'ヨーロッパ', HT: '北米', HU: 'ヨーロッパ',
  ID: 'アジア', IE: 'ヨーロッパ', IL: '中東', IN: 'アジア', IQ: '中東', IR: '中東', IS: 'ヨーロッパ', IT: 'ヨーロッパ',
  JM: '北米', JO: '中東', JP: 'アジア', KE: 'アフリカ', KG: 'アジア', KH: 'アジア', KM: 'アフリカ', KN: '北米',
  KP: 'アジア', KR: 'アジア', KW: '中東', KZ: 'アジア', LA: 'アジア', LB: '中東', LC: '北米', LK: 'アジア',
  LR: 'アフリカ', LS: 'アフリカ', LT: 'ヨーロッパ', LU: 'ヨーロッパ', LV: 'ヨーロッパ', LY: 'アフリカ', MA: 'アフリカ',
  MD: 'ヨーロッパ', ME: 'ヨーロッパ', MG: 'アフリカ', MK: 'ヨーロッパ', ML: 'アフリカ', MM: 'アジア', MN: 'アジア',
  MO: 'アジア', MR: 'アフリカ', MT: 'ヨーロッパ', MU: 'アフリカ', MV: 'アジア', MW: 'アフリカ', MX: '北米', MY: 'アジア',
  MZ: 'アフリカ', NA: 'アフリカ', NE: 'アフリカ', NG: 'アフリカ', NI: '北米', NL: 'ヨーロッパ', NO: 'ヨーロッパ',
  NP: 'アジア', NZ: 'オセアニア', OM: '中東', PA: '北米', PE: '南米', PG: 'オセアニア', PH: 'アジア', PK: 'アジア',
  PL: 'ヨーロッパ', PT: 'ヨーロッパ', PY: '南米', QA: '中東', RO: 'ヨーロッパ', RS: 'ヨーロッパ', RU: 'ヨーロッパ',
  RW: 'アフリカ', SA: '中東', SC: 'アフリカ', SD: 'アフリカ', SE: 'ヨーロッパ', SG: 'アジア', SI: 'ヨーロッパ',
  SK: 'ヨーロッパ', SL: 'アフリカ', SN: 'アフリカ', SO: 'アフリカ', SR: '南米', SV: '北米', SY: '中東', SZ: 'アフリカ',
  TD: 'アフリカ', TG: 'アフリカ', TH: 'アジア', TJ: 'アジア', TL: 'アジア', TN: 'アフリカ', TR: 'ヨーロッパ',
  TT: '北米', TW: 'アジア', TZ: 'アフリカ', UA: 'ヨーロッパ', UG: 'アフリカ', US: '北米', UY: '南米', UZ: 'アジア',
  VE: '南米', VN: 'アジア', YE: '中東', ZA: 'アフリカ', ZM: 'アフリカ', ZW: 'アフリカ'
}

export const getCityRegion = (value) => {
  if (!value) return 'その他'
  if (typeof value === 'string') {
    const cached = CITY_CACHE.byCity.get(value.toLowerCase())
    if (cached && cached.length) {
      const iso = cached[0].iso2
      return ISO2_TO_REGION[iso] || 'その他'
    }
    return ISO2_TO_REGION[value.toUpperCase()] || 'その他'
  }

  const iso2 = value.iso2 || value.iso || (value.country && value.country.iso2)
  if (!iso2) return 'その他'
  return ISO2_TO_REGION[iso2] || 'その他'
}
