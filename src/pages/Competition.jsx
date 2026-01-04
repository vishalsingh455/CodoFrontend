import React, {useEffect, useState, useRef} from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function Competition(){
  const { competitionId } = useParams();
  const [competition, setCompetition] = useState(null);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('// write your code here');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [mySubmissions, setMySubmissions] = useState([]);
  const pollRef = useRef(null);

  useEffect(()=>{
    let mounted = true;

    api.get('/competitions')
      .then(r=>{
        const comps = r.data.competitions||[];
        const comp = comps.find(c=>c._id===competitionId)
        if(mounted) setCompetition(comp||null)
      })
      .catch(()=>{})

    // Try to fetch problems for this competition (some backends expose this)
    api.get(`/competitions/${competitionId}/problems`)
      .then(r=> setProblems(r.data.problems || []))
      .catch(()=> {
        // fallback: try a generic problems endpoint (may not exist)
        api.get('/problems')
          .then(r=> setProblems((r.data.problems||[]).filter(p=> String(p.competition) === String(competitionId))))
          .catch(()=> setProblems([]))
      })

    // fetch my submissions (to show and to poll results)
    api.get('/my-submissions')
      .then(r=>{
        const subs = r.data.submissions || [];
        if(mounted) setMySubmissions(subs.filter(s=> s.competition && String(s.competition._id || s.competition) === String(competitionId)));
      })
      .catch(()=>{})

    return ()=> { mounted = false; if(pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } }
  },[competitionId])

  const submit = async ()=>{
    if(!selectedProblem) return alert('select a problem')
    try{
      const res = await api.post(`/problems/${selectedProblem}/submit`, {code, language});
      const submissionId = res.data.submissionId;
      setOutput('Submission queued — polling for result...')

      // start polling for this submission status
      if(pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async ()=>{
        try{
          const r = await api.get('/my-submissions');
          const subs = r.data.submissions || [];
          const s = subs.find(x=> x._id === submissionId);
          if(s){
            setMySubmissions(prev => [s, ...prev.filter(x=> x._id !== s._id)]);
            if(s.status !== 'pending'){
              setOutput(`Status: ${s.status} • Score: ${s.score}`);
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          }
        }catch(e){
          console.error('Polling error', e);
        }
      }, 2000);

    }catch(err){
      setOutput(err?.response?.data?.message || 'Submission failed')
    }
  }

  return (
    <div className="container">
      <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          <div className="card">
            <h2 className="h1">{competition?.title || 'Competition'}</h2>
            <div className="small">{competition?.description}</div>
            <div style={{marginTop:12}}>
              <Link to={`/competitions/${competitionId}/leaderboard`} className="small">View Leaderboard</Link>
              <span style={{marginLeft:12}} className="small">|</span>
              <Link to={`/competitions/${competitionId}/analytics`} className="small" style={{marginLeft:12}}>Analytics</Link>
            </div>
          </div>
          <div className="card">
            <h3 style={{marginTop:0}}>Problems</h3>
            <div className="small">Select a problem to solve</div>
            <div style={{marginTop:8}}>
              {problems.length===0 ? <div className="small">No problems listed yet</div> : problems.map(p=>(
                <div key={p._id} style={{padding:'8px 0',borderTop:'1px solid rgba(255,255,255,0.02)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <strong>{p.title}</strong>
                      <div className="small">{p.difficulty} • {p.marksPerTestCase} pts/test</div>
                    </div>
                    <div>
                      <button className="btn" onClick={()=>setSelectedProblem(p._id)}>Select</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{marginTop:0}}>Organizer: Add Problem</h3>
            <div className="small">If you're the organizer, add a problem to this competition</div>
            <AddProblemForm competitionId={competitionId} onAdded={(p)=> setProblems(prev=> [p, ...prev])} />
          </div>

          <div className="card">
            <h3 style={{marginTop:0}}>Organizer: Submissions</h3>
            <div className="small">View all submissions (organizer only)</div>
            <OrganizerSubmissions competitionId={competitionId} />
          </div>
        </div>

        <div style={{width:520}}>
          <div className="card">
            <h3 style={{marginTop:0}}>Editor</h3>
            <div style={{display:'grid',gap:8}}>
              <select value={language} onChange={e=>setLanguage(e.target.value)} className="input">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
              </select>
              <textarea className="code-area" value={code} onChange={e=>setCode(e.target.value)} />
              <div style={{display:'flex',gap:8,justifyContent:'space-between',alignItems:'center'}}>
                <button className="btn" onClick={submit}>Submit</button>
                <div className="small">Output: <span style={{color:'#9fb1ff'}}>{output}</span></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{marginTop:0}}>Quick Links</h4>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <Link to={`/competitions/${competitionId}/leaderboard`} className="small">Leaderboard</Link>
              <Link to={`/competitions/${competitionId}/analytics`} className="small">Analytics (organizer)</Link>
              <Link to="/dashboard" className="small">Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
