import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CarFront, CircleParking, Clock3, LogOut, Plus, RefreshCw, Search, ArrowUpRight } from 'lucide-react';
import { parkingApi } from './api';
import './style.css';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [free, setFree] = useState(10);
  const [plate, setPlate] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const [availability, parked] = await Promise.all([parkingApi.availability(), parkingApi.vehicles()]);
    setFree(availability.freeSlots);
    setVehicles(parked);
  }

  useEffect(() => { refresh().catch(e => notice(e.message, true)); }, []);
  function notice(text, failed = false) { setMessage(text); setError(failed); }

  async function enter(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const ticket = await parkingApi.enter(plate);
      setPlate('');
      notice(`${ticket.plate} parked in space ${String(ticket.slot).padStart(2, '0')}`);
      await refresh();
    } catch (e) { notice(e.message, true); }
    finally { setBusy(false); }
  }

  async function leave(vehicle) {
    setBusy(true);
    try {
      const receipt = await parkingApi.exit(vehicle.plate);
      notice(`${receipt.plate} checked out · Fee ${receipt.fee} units`);
      await refresh();
    } catch (e) { notice(e.message, true); }
    finally { setBusy(false); }
  }

  const visible = vehicles.filter(v => v.plate.toLowerCase().includes(query.toLowerCase()));
  const occupied = 10 - free;
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><CircleParking size={23}/></div><span>parkside<span className="brand-dot">.</span></span></div>
      <div className="nav-label">WORKSPACE</div>
      <div className="nav-item active"><CarFront size={18}/> Overview</div>
      <div className="sidebar-bottom"><div className="sidebar-card"><span className="live-dot"/> Lot is open<br/><small>Ready for arrivals</small></div><div className="version">Parking manager · v1.0</div></div>
    </aside>
    <main className="main">
      <header><div className="breadcrumb">Workspace <span>/</span> Overview</div><div className="header-right"><span className="today">{new Date().toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})}</span><div className="avatar">PK</div></div></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">PARKING OPERATIONS</div><h1>Good to see you.</h1><p>Here's what's happening in your lot right now.</p></div><button className="refresh" onClick={() => refresh().catch(e => notice(e.message, true))}><RefreshCw size={16}/> Refresh</button></div>
        <div className="stats">
          <div className="stat"><div className="stat-top"><span>Available spaces</span><div className="stat-icon green"><CircleParking size={19}/></div></div><div className="stat-value">{free}<span> / 10</span></div><div className="stat-note"><span className="mini-dot green-dot"/> Ready for new vehicles</div></div>
          <div className="stat"><div className="stat-top"><span>Currently parked</span><div className="stat-icon blue"><CarFront size={19}/></div></div><div className="stat-value">{occupied}<span> vehicles</span></div><div className="stat-note">Live occupancy</div></div>
          <div className="stat"><div className="stat-top"><span>Occupancy rate</span><div className="stat-icon amber"><ArrowUpRight size={19}/></div></div><div className="stat-value">{occupied * 10}<span>%</span></div><div className="progress"><div style={{width:`${occupied*10}%`}}/></div></div>
        </div>
        <div className="workspace-grid">
          <section className="panel entry-panel"><div className="panel-head"><div><h2>New arrival</h2><p>Assign the next available space.</p></div><div className="panel-icon"><Plus size={20}/></div></div><form onSubmit={enter}><label htmlFor="plate">LICENSE PLATE</label><input id="plate" value={plate} onChange={e=>setPlate(e.target.value)} placeholder="e.g. HR 12 AB 1234" required/><button className="primary" disabled={busy || free===0}><Plus size={17}/> Park vehicle</button></form><div className="hint"><Clock3 size={16}/> 20 units per started hour · 1 hour minimum</div></section>
          <section className="panel map-panel"><div className="panel-head"><div><h2>Space overview</h2><p>A quick look at all 10 spaces.</p></div><span className="capacity">10 TOTAL</span></div><div className="spaces">{Array.from({length:10},(_,i)=>{const item=vehicles.find(v=>v.slot===i+1);return <div key={i} className={`space ${item?'taken':''}`} title={item?.plate||'Available'}><span>{String(i+1).padStart(2,'0')}</span>{item?<CarFront size={22}/>:<span className="space-plus">+</span>}</div>})}</div><div className="legend"><span><i className="legend-free"/> Available</span><span><i className="legend-taken"/> Occupied</span></div></section>
        </div>
        {message && <div className={`notice ${error?'error':''}`} role="status">{message}</div>}
        <section className="panel vehicles-panel"><div className="list-head"><div><h2>Parked vehicles</h2><p>Manage vehicles currently in the lot.</p></div><div className="search"><Search size={17}/><input aria-label="Search plate" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search plate"/></div></div><div className="table-wrap"><table><thead><tr><th>VEHICLE</th><th>SPACE</th><th>ARRIVAL TIME</th><th>STATUS</th><th></th></tr></thead><tbody>{visible.map(v=><tr key={v.plate}><td><div className="vehicle"><div className="vehicle-icon"><CarFront size={17}/></div><strong>{v.plate}</strong></div></td><td>#{String(v.slot).padStart(2,'0')}</td><td>{new Date(v.enteredAt).toLocaleString()}</td><td><span className="status"><span/> Parked</span></td><td><button className="checkout" disabled={busy} onClick={()=>leave(v)}><LogOut size={15}/> Check out</button></td></tr>)}</tbody></table>{visible.length===0&&<div className="empty">{query?'No matching vehicles.':'No vehicles parked yet. Add an arrival to get started.'}</div>}</div></section>
        <footer>Parkside · A simple parking management demo</footer>
      </div>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
