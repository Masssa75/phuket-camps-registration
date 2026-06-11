'use client'

import { useState } from 'react'

/* "A day at camp" — Mini/Maxi weekly timetable toggle.
   Content matches the admin's 2026 camp schedules (June 2026). */
export default function Timetable() {
  const [group, setGroup] = useState<'mini' | 'maxi'>('mini')

  return (
    <>
      <div className="sched-toggle">
        <button className={group === 'mini' ? 'on' : ''} onClick={() => setGroup('mini')}>
          Mini · Ages 3–6
        </button>
        <button className={group === 'maxi' ? 'on' : ''} onClick={() => setGroup('maxi')}>
          Maxi · Ages 7–13
        </button>
      </div>
      <div className="sched-tablewrap">
        <table className={`sched${group === 'mini' ? ' on' : ''}`}>
          <thead>
            <tr><th>Time</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr>
          </thead>
          <tbody>
            <tr><td className="time">8:45–9:00</td><td className="shared" colSpan={5}>Drop-off</td></tr>
            <tr><td className="time">9:00–9:30</td><td className="shared" colSpan={5}>Circle time & story time</td></tr>
            <tr><td className="time">9:30–10:00</td><td className="shared" colSpan={5}>Free play</td></tr>
            <tr><td className="time">10:00–10:15</td><td className="shared" colSpan={5}>Yoga & meditation</td></tr>
            <tr><td className="time">10:15–10:30</td><td className="shared" colSpan={5}>Snack time</td></tr>
            <tr><td className="time">11:00–12:00</td><td>Outdoor free play</td><td>Baking</td><td>Outdoor free play</td><td>Waldorf painting</td><td>Music</td></tr>
            <tr><td className="time">12:00–12:30</td><td className="shared" colSpan={5}>Lunch time</td></tr>
            <tr><td className="time">12:30–1:50</td><td className="shared" colSpan={5}>Story time, quiet time & nap</td></tr>
            <tr><td className="time">1:50–2:30</td><td>Craft time & group activity</td><td>Gardening</td><td>Craft time & group activity</td><td>Animal care</td><td>Craft time & group activity</td></tr>
            <tr><td className="time">2:30–3:00</td><td className="shared" colSpan={5}>Snack time</td></tr>
            <tr><td className="time">3:00</td><td className="shared" colSpan={5}>Pick-up</td></tr>
          </tbody>
        </table>
        <table className={`sched${group === 'maxi' ? ' on' : ''}`}>
          <thead>
            <tr><th>Time</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr>
          </thead>
          <tbody>
            <tr><td className="time">8:45–9:00</td><td className="shared" colSpan={5}>Drop-off</td></tr>
            <tr>
              <td className="time">9:00–9:30</td>
              <td>Rules & tours</td>
              <td className="special" rowSpan={9}>🚌<br />Field Trip<br /><span className="specsub">A new destination each week</span></td>
              <td>Yoga & meditation</td>
              <td className="special" rowSpan={9}>🏖️<br />Beach Day</td>
              <td>P.E. games</td>
            </tr>
            <tr><td className="time">9:30–10:30</td><td>Ice breaker games</td><td>Sports</td><td>Theme-related crafts</td></tr>
            <tr><td className="time">10:30–11:00</td><td className="shared">Snack</td><td className="shared">Snack</td><td className="shared">Snack</td></tr>
            <tr><td className="time">11:00–11:30</td><td>Animal care</td><td rowSpan={2}>Theme-related crafts</td><td>Science experiment</td></tr>
            <tr><td className="time">11:30–12:00</td><td>Beaded art</td><td>Painting</td></tr>
            <tr><td className="time">12:00–1:00</td><td className="shared">Lunch</td><td className="shared">Lunch</td><td className="shared">Lunch</td></tr>
            <tr><td className="time">1:00–1:45</td><td>Clay work</td><td>Baking</td><td>Team work activity</td></tr>
            <tr><td className="time">1:45–2:45</td><td>Thai boxing</td><td>Gardening</td><td>Thai cooking</td></tr>
            <tr><td className="time">2:45–3:00</td><td className="shared">Snack</td><td className="shared">Snack</td><td className="shared">Snack</td></tr>
            <tr><td className="time">3:00</td><td className="shared" colSpan={5}>Pick-up</td></tr>
          </tbody>
        </table>
      </div>
      <p className="sched-note">Lunch and snacks included · Activities and field trips may change due to weather</p>
    </>
  )
}
