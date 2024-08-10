'use client'

import { useEffect, useRef, useState } from 'react'
import BlurFadeText from './magicui/blur-fade-text'

function getDistance(
  Lat1: number,
  Lon1: number,
  Lat2: number,
  Lon2: number,
  unit: 'miles' | 'km'
): number {
  const R = unit === 'miles' ? 3958.8 : 6371
  const rLat1 = (Math.PI * Lat1) / 180
  const rLat2 = (Math.PI * Lat2) / 180
  const dLat = rLat2 - rLat1
  const dLon = (Math.PI * (Lon2 - Lon1)) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

const BLUR_FADE_DELAY = 0.04

export function Distance({ geo }: { geo: { lat: number; lon: number } }) {
  const [distance, setDistance] = useState<string | null>(null)
  const runOnce = useRef(false)

  useEffect(() => {
    const fetchDistance = async () => {
      if (runOnce.current) return
      runOnce.current = true
      const navigator = typeof window !== 'undefined' && window.navigator

      if (navigator && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords
          const unit = 'miles'
          const dist = getDistance(latitude, longitude, geo.lat, geo.lon, unit)
          setDistance(`${dist} ${unit}`)
        })
      }
    }

    fetchDistance()
  }, [geo.lat, geo.lon])

  return (
    distance !== null && (
      <BlurFadeText
        className="text-sm text-muted-foreground"
        delay={BLUR_FADE_DELAY}
        text={`You are ${distance} away from me`}
      />
    )
  )
}
