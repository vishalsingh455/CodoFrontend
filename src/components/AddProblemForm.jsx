import React, {useState} from 'react'
import api from '../api'

export default function AddProblemForm({competitionId, onAdded}){
  const [title,setTitle]=useState('')
  const [statement,setStatement]=useState('')
  const [inputFormat,setInputFormat]=useState('')
  const [outputFormat,setOutputFormat]=useState('')
  const [constraints,setConstraints]=useState('')
  const [difficulty,setDifficulty]=useState('easy')
  const [message,setMessage]=useState('')

  const submit = async (e)=>{
    e?.preventDefault()
    setMessage('')
    try{
      const r = await api.post(`/competitions/${competitionId}/problems`, {title,statement,inputFormat,outputFormat,constraints,difficulty})
      setMessage('Problem added')
      onAdded && onAdded(r.data.problem)
      setTitle('');setStatement('');setInputFormat('');setOutputFormat('');setConstraints('');setDifficulty('easy')
    }catch(err){
      setMessage(err?.response?.data?.message || 'Add problem failed')
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid',gap:8,marginTop:8}}>
      <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="input" placeholder="Statement" value={statement} onChange={e=>setStatement(e.target.value)} />
      <input className="input" placeholder="Input format" value={inputFormat} onChange={e=>setInputFormat(e.target.value)} />
      <input className="input" placeholder="Output format" value={outputFormat} onChange={e=>setOutputFormat(e.target.value)} />
      <input className="input" placeholder="Constraints" value={constraints} onChange={e=>setConstraints(e.target.value)} />
      <select className="input" value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <button className="btn" type="submit">Add Problem</button>
      </div>
      {message && <div className="small" style={{color:'#9fb1ff'}}>{message}</div>}
    </form>
  )
}
