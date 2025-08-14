import React, { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

const initial = { fullName:'', email:'', phone:'', address:'', city:'', state:'', zip:'' }

export default function PrizeModal({ onClose }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  useEffect(() => {
    // Burst of confetti on open
    confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 } })
    confetti({ particleCount: 120, angle: 120, spread: 55, origin: { x: 0.2, y: 0.3 } })
    confetti({ particleCount: 120, angle: 60, spread: 55, origin: { x: 0.8, y: 0.3 } })
  }, [])

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Valid email required'
    if (!/^\+?[0-9\-()\s]{7,}$/.test(form.phone)) errs.phone = 'Valid phone required'
    ;['address','city','state','zip'].forEach(k => { if (!form[k].trim()) errs[k] = 'Required' })
    return errs
  }

  const submit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    setStatus('submitting')
    try {
      const res = await fetch('http://localhost:8787/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consent: true })
      })
      if (!res.ok) throw new Error('Server error')
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className='overlay'>
        <div className='card'>
          <h2>You're entered! 🎁</h2>
          <p>We saved your contact details. We do <b>not</b> collect bank information in this demo.</p>
          <button onClick={onClose} style={{marginTop:'12px',padding:'10px 14px',borderRadius:'10px',background:'#10b981',color:'#fff',border:'none'}}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className='overlay' role='dialog' aria-modal='true'>
      <form className='card' onSubmit={submit}>
        <h2 style={{marginTop:0}}>Claim Prize</h2>
        <p style={{marginTop:0, color:'#475569'}}>Enter your contact info so we can reach you. <b>Do not</b> send bank details.</p>
        <div className='grid2'>
          <div><label>Full Name<input name='fullName' value={form.fullName} onChange={change}/>{errors.fullName && <div className='error'>{errors.fullName}</div>}</label></div>
          <div><label>Email<input name='email' value={form.email} onChange={change}/>{errors.email && <div className='error'>{errors.email}</div>}</label></div>
          <div><label>Phone<input name='phone' value={form.phone} onChange={change}/>{errors.phone && <div className='error'>{errors.phone}</div>}</label></div>
          <div><label>Address<input name='address' value={form.address} onChange={change}/>{errors.address && <div className='error'>{errors.address}</div>}</label></div>
          <div><label>City<input name='city' value={form.city} onChange={change}/>{errors.city && <div className='error'>{errors.city}</div>}</label></div>
          <div><label>State<input name='state' value={form.state} onChange={change}/>{errors.state && <div className='error'>{errors.state}</div>}</label></div>
          <div><label>Zip<input name='zip' value={form.zip} onChange={change}/>{errors.zip && <div className='error'>{errors.zip}</div>}</label></div>
        </div>
        <div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
          <button type='submit' disabled={status==='submitting'} style={{padding:'10px 14px',borderRadius:'10px',background:'#3b82f6',color:'#fff',border:'none'}}>{status==='submitting'?'Submitting…':'Submit'}</button>
          <button type='button' onClick={onClose} style={{padding:'10px 14px',borderRadius:'10px',background:'#e5e7eb',border:'none'}}>Cancel</button>
        </div>
        {status==='error' && <div className='error' style={{marginTop:'8px'}}>Something went wrong. Try again.</div>}
      </form>
    </div>
  )
}
