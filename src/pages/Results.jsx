import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function Results(){
  const { competitionId } = useParams();
  const [results,setResults]=useState([])
  const [total,setTotal]=useState(0)

  useEffect(()=>{
    api.get(`/competitions/${competitionId}/my-result`)
      .then(r=>{
        setResults(r.data.results || []);
        setTotal(r.data.totalScore || 0);
      })
      .catch(()=>{})
  },[competitionId])

  return (
    <div className="container">
      <div className="card">
        <h2 className="h1">My Result</h2>
        <div className="small">Total Score: {total}</div>
        <div style={{marginTop:12}}>
          {results.length===0 ? <div className="small">No submissions</div> : results.map(r=> (
            <div key={r.problemTitle} style={{padding:'8px 0',borderTop:'1px solid rgba(255,255,255,0.02)'}}>
              <div><strong>{r.problemTitle}</strong> <span className="small">{r.difficulty}</span></div>
              <div className="small">Score: {r.score} • Status: {r.status} • Submitted: {new Date(r.submittedAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
