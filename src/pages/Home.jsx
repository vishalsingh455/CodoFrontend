import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [comps, setComps] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/competitions")
      .then((r) => setComps(r.data.competitions || []))
      .catch(() => setComps([]));
  }, []);

  return (
    <div className="container">
      <h2 className="h1">Available Competitions</h2>
      <p className="small">Join with room code or open competition to view problems.</p>

      <div className="grid">
        {comps.map((c) => (
          <div key={c._id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h3 style={{margin:0}}>{c.title}</h3>
                <div className="small">{c.description}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="small">Room</div>
                <div style={{fontWeight:700}}>{c.roomCode}</div>
              </div>
            </div>
            <div style={{marginTop:12,display:'flex',gap:8}}>
              <Link to={`/competitions/${c._id}`} className="btn">Open</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{maxWidth:540, margin:'18px auto'}}>
        <h3 className="h1">Join Competition</h3>
        <p className="small">Enter a room code to join a competition</p>
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <input className="input" placeholder="Room code" value={roomCode} onChange={e=>setRoomCode(e.target.value)} />
          <button className="btn" onClick={async ()=>{
            setMessage('');
            try{
              const r = await api.post('/competitions/join', {roomCode});
              const competitionId = r.data.competitionId;
              navigate(`/competitions/${competitionId}`);
            }catch(err){
              setMessage(err?.response?.data?.message || 'Join failed');
            }
          }}>Join</button>
        </div>
        {message && <div style={{color:'#ffb4b4',marginTop:8}}>{message}</div>}
      </div>
    </div>
  );
}
