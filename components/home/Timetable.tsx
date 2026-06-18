'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

/* "A day at camp" — Mini/Maxi weekly timetable toggle.
   Content matches the admin's 2026 camp schedules (June 2026). */
export default function Timetable() {
  const [group, setGroup] = useState<'mini' | 'maxi'>('mini')
  const t = useTranslations('day')
  const thead = t.raw('thead') as string[]

  return (
    <>
      <div className="sched-toggle">
        <button className={group === 'mini' ? 'on' : ''} onClick={() => setGroup('mini')}>
          {t('miniToggle')}
        </button>
        <button className={group === 'maxi' ? 'on' : ''} onClick={() => setGroup('maxi')}>
          {t('maxiToggle')}
        </button>
      </div>
      <div className="sched-tablewrap">
        <table className={`sched${group === 'mini' ? ' on' : ''}`}>
          <thead>
            <tr>{thead.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            <tr><td className="time">8:45–9:00</td><td className="shared" colSpan={5}>{t('cells.dropoff')}</td></tr>
            <tr><td className="time">9:00–9:30</td><td className="shared" colSpan={5}>{t('cells.circle')}</td></tr>
            <tr><td className="time">9:30–10:00</td><td className="shared" colSpan={5}>{t('cells.freeplay')}</td></tr>
            <tr><td className="time">10:00–10:30</td><td className="shared" colSpan={5}>{t('cells.yoga')}</td></tr>
            <tr><td className="time">10:30–11:00</td><td className="shared" colSpan={5}>{t('cells.snack')}</td></tr>
            <tr><td className="time">11:00–12:00</td><td>{t('cells.outdoorFreeplay')}</td><td>{t('cells.baking')}</td><td>{t('cells.outdoorFreeplay')}</td><td>{t('cells.waldorf')}</td><td>{t('cells.muayThai')}</td></tr>
            <tr><td className="time">12:00–12:30</td><td className="shared" colSpan={5}>{t('cells.lunch')}</td></tr>
            <tr><td className="time">12:30–1:50</td><td className="shared" colSpan={5}>{t('cells.nap')}</td></tr>
            <tr><td className="time">1:50–2:30</td><td>{t('cells.craftGroup')}</td><td>{t('cells.gardening')}</td><td>{t('cells.craftGroup')}</td><td>{t('cells.animalCare')}</td><td>{t('cells.craftGroup')}</td></tr>
            <tr><td className="time">2:30–3:00</td><td className="shared" colSpan={5}>{t('cells.snack')}</td></tr>
            <tr><td className="time">3:00</td><td className="shared" colSpan={5}>{t('cells.pickup')}</td></tr>
          </tbody>
        </table>
        <table className={`sched${group === 'maxi' ? ' on' : ''}`}>
          <thead>
            <tr>{thead.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            <tr><td className="time">8:45–9:00</td><td className="shared" colSpan={5}>{t('cells.dropoff')}</td></tr>
            <tr>
              <td className="time">9:00–9:30</td>
              <td>{t('cells.rulesTours')}</td>
              <td className="special" rowSpan={9}>🚌<br />{t('cells.fieldTrip')}<br /><span className="specsub">{t('cells.fieldTripSub')}</span></td>
              <td>{t('cells.yoga')}</td>
              <td className="special" rowSpan={9}>🏖️<br />{t('cells.beachDay')}</td>
              <td>{t('cells.peGames')}</td>
            </tr>
            <tr><td className="time">9:30–10:30</td><td>{t('cells.iceBreakers')}</td><td>{t('cells.sports')}</td><td>{t('cells.muayThai')}</td></tr>
            <tr><td className="time">10:30–11:00</td><td className="shared">{t('cells.snackShort')}</td><td className="shared">{t('cells.snackShort')}</td><td className="shared">{t('cells.snackShort')}</td></tr>
            <tr><td className="time">11:00–11:30</td><td>{t('cells.animalCare')}</td><td rowSpan={2}>{t('cells.themeCrafts')}</td><td>{t('cells.science')}</td></tr>
            <tr><td className="time">11:30–12:00</td><td>{t('cells.beadedArt')}</td><td>{t('cells.painting')}</td></tr>
            <tr><td className="time">12:00–1:00</td><td className="shared">{t('cells.lunchShort')}</td><td className="shared">{t('cells.lunchShort')}</td><td className="shared">{t('cells.lunchShort')}</td></tr>
            <tr><td className="time">1:00–1:45</td><td>{t('cells.clay')}</td><td>{t('cells.baking')}</td><td>{t('cells.teamWork')}</td></tr>
            <tr><td className="time">1:45–2:45</td><td>{t('cells.thaiBoxing')}</td><td>{t('cells.gardening')}</td><td>{t('cells.thaiCooking')}</td></tr>
            <tr><td className="time">2:45–3:00</td><td className="shared">{t('cells.snackShort')}</td><td className="shared">{t('cells.snackShort')}</td><td className="shared">{t('cells.snackShort')}</td></tr>
            <tr><td className="time">3:00</td><td className="shared" colSpan={5}>{t('cells.pickup')}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="sched-note">{t('note')}</p>
    </>
  )
}
