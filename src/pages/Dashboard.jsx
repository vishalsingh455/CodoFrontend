import React, {useEffect, useState} from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Dashboard(){
  const [data,setData] = useState({organizedCompetitions:[], registeredCompetitions:[]})
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [message,setMessage] = useState('')

  useEffect(()=>{
    api.get('/user/dashboard')
      .then(r=>setData({organizedCompetitions:r.data.organizedCompetitions || [], registeredCompetitions:r.data.registeredCompetitions || []}))
      .catch(()=>{})
  },[])

  return (
    <div className="container">
      <h2 className="h1">Your Dashboard</h2>
      <div className="card" style={{maxWidth:700}}>
        <h3 style={{marginTop:0}}>Create Competition</h3>
        <div className="small">Organizers can create competitions</div>
        <form style={{display:'grid',gap:8,marginTop:8}} onSubmit={async e=>{e.preventDefault();setMessage('');try{const r=await api.post('/competitions/create',{title,description});setMessage('Created');setTitle('');setDescription('');window.location.reload();}catch(err){setMessage(err?.response?.data?.message||'Create failed')}}}>
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn" type="submit">Create</button>
          </div>
          {message && <div style={{color:'#9fb1ff'}}>{message}</div>}
        </form>
      </div>
      <div className="grid">
        <div className="card">
          <h3 style={{marginTop:0}}>Organized Competitions</h3>
          {data.organizedCompetitions.length===0 ? <div className="small">No organized competitions yet</div> : data.organizedCompetitions.map(c=>(
            <div key={c._id} style={{padding:'8px 0',borderTop:'1px solid rgba(255,255,255,0.02)'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div>{c.title}</div>
                <div><Link to={`/competitions/${c._id}`}>Open</Link></div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{marginTop:0}}>Registered Competitions</h3>
          {data.registeredCompetitions.length===0 ? <div className="small">No registrations yet</div> : data.registeredCompetitions.map(c=>(
            <div key={c._id} style={{padding:'8px 0',borderTop:'1px solid rgba(255,255,255,0.02)'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div>{c.title}</div>
                <div><Link to={`/competitions/${c._id}`}>Open</Link></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
