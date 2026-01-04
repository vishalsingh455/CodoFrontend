import React, {useEffect, useState} from 'react'
import api from '../api'

export default function OrganizerSubmissions({competitionId}){
  const [subs,setSubs]=useState([])
  const [error,setError]=useState('')

  useEffect(()=>{
    api.get(`/competitions/${competitionId}/submissions`)
      .then(r=> setSubs(r.data.submissions || []))
      .catch(err=> setError(err?.response?.data?.message || 'No access'))
  },[competitionId])

  if(error) return <div className="small">{error}</div>

  return (
    <div style={{marginTop:8}}>
      {subs.length===0 ? <div className="small">No submissions yet</div> : subs.map(s=> (
        <div key={s._id} style={{padding:'8px 0',borderTop:'1px solid rgba(255,255,255,0.02)'}}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div>
              <strong>{s.problem?.title || 'Problem'}</strong>
              <div className="small">By: {s.user?.name} • {s.language}</div>
            </div>
            <div className="small">Status: {s.status} • Score: {s.score}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
