import React, { useEffect, useMemo, useState } from 'react'
import PrizeModal from './prize/PrizeModal.jsx'

function BasicBlackjack() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const drawTwoCards = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=2')
      if (!res.ok) throw new Error('Network error while drawing cards')
      const { cards } = await res.json()
      setCards(cards.map(({ code, image, value, suit }) => ({ code, image, value, suit })))
    } catch (e) { setError(e?.message || 'Unknown error') } finally { setLoading(false) }
  }

  useEffect(() => { drawTwoCards() }, [])

  const score = useMemo(() => {
    const toPoints = (v) => v === 'ACE' ? 11 : (['KING','QUEEN','JACK'].includes(v) ? 10 : Number(v) || 0)
    return cards.reduce((sum, { value }) => sum + toPoints(value), 0)
  }, [cards])

  const isBlackjack = score === 21

  return (
    <section style={{width:'100%',maxWidth:'768px'}}>
      <div style={{background:'rgba(255,255,255,.06)',borderRadius:'16px',padding:'24px',border:'1px solid rgba(255,255,255,.15)',boxShadow:'0 10px 30px rgba(0,0,0,.2)'}}>
        <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px',color:'white'}}>
          <h1 style={{margin:0,fontSize:'28px',fontWeight:600}}>Basic Blackjack</h1>
          <button onClick={drawTwoCards} disabled={loading} aria-busy={loading}
            style={{padding:'8px 14px',borderRadius:'14px',border:'1px solid rgba(255,255,255,.25)',background:'rgba(255,255,255,.15)',color:'#fff',opacity:loading?0.7:1}}>
            {loading ? 'Dealing…' : 'Deal Again'}
          </button>
        </header>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'18px',placeItems:'center',padding:'16px 0'}}>
          {cards.length === 2 ? (
            cards.map(({ code, image, value, suit }) => (
              <figure key={code} style={{background:'#fff',borderRadius:'16px',padding:'10px',boxShadow:'0 6px 18px rgba(0,0,0,.25)'}}>
                <img src={image} alt={`${value} of ${suit}`} style={{display:'block',height:'220px',width:'auto'}} loading='eager' />
              </figure>
            ))
          ) : (
            <p style={{gridColumn:'1 / -1', color:'rgba(255,255,255,.9)'}}>{loading ? 'Drawing cards…' : error ? '' : ''}</p>
          )}
        </div>
        {error && <p style={{color:'#fecaca',background:'rgba(248,113,113,.2)',border:'1px solid rgba(248,113,113,.3)',borderRadius:'12px',padding:'10px 12px',fontSize:'14px'}}>{error}</p>}
        <div style={{textAlign:'center',marginTop:'8px',color:'#fff'}}>
          <p style={{fontSize:'22px',fontWeight:600}}>Score: {cards.length === 2 ? score : '–'}</p>
          {isBlackjack && (<p style={{marginTop:'8px',fontSize:'20px',fontWeight:700,color:'#fffbcc'}}>🎉🎉 BLACKJACK!!! 🎉🎉</p>)}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [showPrize, setShowPrize] = useState(false)
  const [paused, setPaused] = useState(false)

  const openPrize = () => { setShowPrize(true); setPaused(true) }
  const onClose = () => { setShowPrize(false); setPaused(false) }

  return (
    <main style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <BasicBlackjack />
      <button onClick={openPrize} style={{marginTop:'18px',padding:'10px 16px',borderRadius:'14px',border:'none',background:'#f59e0b',color:'#111',fontWeight:700}}>Claim Prize</button>
      {showPrize && <PrizeModal onClose={onClose}/>}
      {paused && <div aria-hidden className='overlay' />}
    </main>
  )
}
