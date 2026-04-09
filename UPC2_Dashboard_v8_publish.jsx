// React globals injected by index.html

const PINS = { PU4:"4401", PU5:"5502", PU6:"6603", DU3:"3304", DU4:"4405", MGR:"9999" };


const APR_TGT = {
  PU4:{ESPOGEN:1351000,EPOTIV:374500,EUVAX:39165,ZEMIGLO:461250,ZEMIMET:4875,ZEMIDAPA:48000},
  PU5:{ESPOGEN:2394000,EPOTIV:1523900,EUVAX:38024,ZEMIGLO:354000,ZEMIMET:5250,ZEMIDAPA:32000},
  PU6:{ESPOGEN:1183000,EPOTIV:339500,EUVAX:16956.38,ZEMIGLO:253500,ZEMIMET:4875,ZEMIDAPA:20000},
  DU3:{ZEMIGLO:2096250,ZEMIMET:71250,ZEMIDAPA:60000},
  DU4:{ZEMIGLO:1845000,ZEMIMET:26250,ZEMIDAPA:60000},
};
const SCHEME_DEF = {
  // Apr: EPO=ESPOGEN+EPOTIV, ZEMI=ZEMIGLO+ZEMIMET+ZEMIDAPA
  PU4:[{name:"EPO Family",brands:["ESPOGEN","EPOTIV"],tgt:1725500},{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:514125},{name:"TOTAL",brands:null,tgt:2278790}],
  PU5:[{name:"EPO Family",brands:["ESPOGEN","EPOTIV"],tgt:3917900},{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:391250},{name:"TOTAL",brands:null,tgt:4347174}],
  PU6:[{name:"EPO Family",brands:["ESPOGEN","EPOTIV"],tgt:1522500},{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:278375},{name:"TOTAL",brands:null,tgt:1817831.38}],
  DU3:[{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:2227500},{name:"Zemidapa",brands:["ZEMIDAPA"],tgt:60000}],
  DU4:[{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:1931250},{name:"Zemidapa",brands:["ZEMIDAPA"],tgt:60000}],
  MGR:[{name:"EPO Family",brands:["ESPOGEN","EPOTIV"],tgt:7165900},{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:5342500},{name:"TOTAL",brands:null,tgt:12602545.38}],
};
const Q2_SCHEME = {
  // Q2 = Apr+May+Jun targets; ZEMI Family = ZEMIGLO+ZEMIMET+ZEMIDAPA; janFebAct=0 (Apr is Q2 month 1)
  PU4:[{name:"EPO Family",brands:["ESPOGEN","EPOTIV"],tgt:6162500,janFebAct:0},{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:1733750,janFebAct:0},{name:"TOTAL",brands:null,tgt:8036125,janFebAct:0}],
  PU5:[{name:"EPO Family",brands:["ESPOGEN","EPOTIV"],tgt:13992500,janFebAct:0},{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:1317500,janFebAct:0},{name:"TOTAL",brands:null,tgt:15445800,janFebAct:0}],
  PU6:[{name:"EPO Family",brands:["ESPOGEN","EPOTIV"],tgt:5437500,janFebAct:0},{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:936250,janFebAct:0},{name:"TOTAL",brands:null,tgt:6434308.50,janFebAct:0}],
  DU3:[{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:7450000,janFebAct:0},{name:"Zemidapa",brands:["ZEMIDAPA"],tgt:225000,janFebAct:0}],
  DU4:[{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:6462500,janFebAct:0},{name:"Zemidapa",brands:["ZEMIDAPA"],tgt:225000,janFebAct:0}],
  MGR:[{name:"EPO Family",brands:["ESPOGEN","EPOTIV"],tgt:25592500,janFebAct:0},{name:"ZEMI Family",brands:["ZEMIGLO","ZEMIMET","ZEMIDAPA"],tgt:17900000,janFebAct:0},{name:"TOTAL",brands:null,tgt:43828733.50,janFebAct:0}],
};

const BC={ESPOGEN:"#3b82f6",EPOTIV:"#8b5cf6",EUVAX:"#10b981",ZEMIGLO:"#ef4444",ZEMIMET:"#f97316",ZEMIDAPA:"#ec4899"};
const fmt=n=>Math.round(n).toLocaleString("th-TH");
const fmtK=n=>n>=1e6?`${(n/1e6).toFixed(1)}M`:n>=1e3?`${Math.round(n/1e3)}K`:fmt(n);
const pctCol=p=>p>=100?"#059669":p>=80?"#0ea5e9":p>=60?"#f59e0b":p>=40?"#f97316":"#ef4444";

function Gauge({pct,size=140}){const r=size*.35,cx=size/2,cy=size*.45,sw=size*.065;const cl=Math.min(pct,130),ang=(cl/130)*180;const sa=Math.PI,ea=sa-(ang*Math.PI/180);const x1=cx+r*Math.cos(sa),y1=cy-r*Math.sin(sa);const x2=cx+r*Math.cos(ea),y2=cy-r*Math.sin(ea);const col=pctCol(pct);return(<svg width={size} height={size*.52} viewBox={`0 0 ${size} ${size*.52}`} style={{display:"block",margin:"0 auto"}}><path d={`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"/>{cl>0&&<path d={`M${x1} ${y1} A${r} ${r} 0 ${ang>180?1:0} 1 ${x2} ${y2}`} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"/>}<text x={cx} y={cy-2} textAnchor="middle" style={{fontSize:size*.2,fontWeight:800,fill:col}}>{pct.toFixed(0)}%</text></svg>);}
function Mini({pct,size=80}){const r=size*.35,cx=size/2,cy=size*.45,sw=size*.07;const cl=Math.min(pct,130),ang=(cl/130)*180;const sa=Math.PI,ea=sa-(ang*Math.PI/180);const x1=cx+r*Math.cos(sa),y1=cy-r*Math.sin(sa);const x2=cx+r*Math.cos(ea),y2=cy-r*Math.sin(ea);const col=pctCol(pct);return(<svg width={size} height={size*.52} viewBox={`0 0 ${size} ${size*.52}`} style={{display:"block",margin:"0 auto"}}><path d={`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"/>{cl>0&&<path d={`M${x1} ${y1} A${r} ${r} 0 ${ang>180?1:0} 1 ${x2} ${y2}`} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"/>}<text x={cx} y={cy-1} textAnchor="middle" style={{fontSize:size*.19,fontWeight:800,fill:col}}>{pct.toFixed(0)}%</text></svg>);}
function Bar({pct,color,h=6}){return <div style={{background:"#f1f5f9",borderRadius:h/2,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:color,borderRadius:h/2}}/></div>;}
function calcScheme(area,rawData){const defs=SCHEME_DEF[area]||[];const areaData=rawData.filter(r=>r.a===area);const total=areaData.reduce((s,r)=>s+r.v,0);return defs.map(s=>{let act=0;if(s.brands){areaData.forEach(r=>{if(s.brands.includes(r.b))act+=r.v;});}else act=total;return{...s,act,pct:s.tgt>0?(act/s.tgt)*100:0};});}
function calcQ2Scheme(area,rawData){const defs=Q2_SCHEME[area]||[];const areaData=rawData.filter(r=>r.a===area);const total=areaData.reduce((s,r)=>s+r.v,0);return defs.map(s=>{let marAct=0;if(s.brands){areaData.forEach(r=>{if(s.brands.includes(r.b))marAct+=r.v;});}else marAct=total;const totalAct=s.janFebAct+marAct;return{...s,act:totalAct,marAct,pct:s.tgt>0?(totalAct/s.tgt)*100:0};});}

function Login({onLogin,dataDate}){
  const [area,setArea]=useState(null);const [pin,setPin]=useState("");const [err,setErr]=useState("");const [shake,setShake]=useState(false);
  const areas=["PU4","PU5","PU6","DU3","DU4"];
  const tryPin=()=>{const code=area||"MGR";if(PINS[code]===pin){onLogin(code);}else{setErr("รหัสไม่ถูกต้อง");setPin("");setShake(true);setTimeout(()=>setShake(false),500);}};
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0c1222 0%,#162032 40%,#1a1a3e 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Sarabun',system-ui,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{width:"100%",maxWidth:380,animation:"fadeUp .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16,boxShadow:"0 8px 32px rgba(99,102,241,.3)"}}><span style={{fontSize:24,color:"#fff",fontWeight:800}}>U2</span></div>
          <h1 style={{fontSize:24,fontWeight:800,color:"#f8fafc",margin:"0 0 4px"}}>UPC2 TEAM</h1>
          <p style={{fontSize:13,color:"#64748b",margin:0}}>Sales Achievement Dashboard</p>
        </div>
        {!area?(<div style={{animation:"fadeUp .4s ease"}}><p style={{fontSize:13,color:"#94a3b8",textAlign:"center",margin:"0 0 16px"}}>เลือก Area ของคุณ</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{areas.map(a=><button key={a} onClick={()=>{setArea(a);setPin("");setErr("");}} style={{padding:"18px 8px",borderRadius:14,border:"1.5px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.03)",color:"#e2e8f0",fontSize:17,fontWeight:700,cursor:"pointer",transition:"all .15s",fontFamily:"inherit"}}>{a}</button>)}</div>
          <div style={{textAlign:"center",marginTop:20}}><button onClick={()=>{setArea("MGR");setPin("");setErr("");}} style={{padding:"10px 24px",borderRadius:10,border:"1px solid rgba(255,255,255,.06)",background:"transparent",color:"#64748b",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Manager View</button></div>
        </div>):(<div style={{animation:"fadeUp .3s ease"}}>
          <div style={{textAlign:"center",marginBottom:24}}><div style={{display:"inline-block",padding:"6px 24px",borderRadius:10,background:area==="MGR"?"rgba(168,85,247,.15)":"rgba(99,102,241,.15)",color:area==="MGR"?"#c084fc":"#818cf8",fontSize:18,fontWeight:800,letterSpacing:1}}>{area==="MGR"?"MANAGER":area}</div></div>
          <p style={{fontSize:13,color:"#94a3b8",textAlign:"center",margin:"0 0 12px"}}>ใส่รหัส 4 หลัก</p>
          <div style={{animation:shake?"shake .4s ease":"none"}}><input type="password" inputMode="numeric" maxLength={6} value={pin} onChange={e=>{setPin(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryPin()} placeholder="• • • •" autoFocus style={{width:"100%",padding:16,borderRadius:14,border:`2px solid ${err?"#ef4444":"rgba(255,255,255,.1)"}`,background:"rgba(255,255,255,.04)",color:"#f8fafc",fontSize:24,textAlign:"center",letterSpacing:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/></div>
          {err&&<p style={{color:"#f87171",fontSize:13,textAlign:"center",margin:"8px 0 0",fontWeight:600}}>{err}</p>}
          <button onClick={tryPin} style={{width:"100%",padding:15,borderRadius:14,border:"none",marginTop:14,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(99,102,241,.3)"}}>เข้าดู</button>
          <button onClick={()=>{setArea(null);setErr("");}} style={{width:"100%",padding:10,borderRadius:10,border:"none",marginTop:8,background:"transparent",color:"#64748b",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← เปลี่ยน Area</button>
        </div>)}
        <p style={{textAlign:"center",fontSize:11,color:"#475569",marginTop:28}}>ข้อมูลอัพเดต: {dataDate}</p>
      </div>
    </div>
  );
}

function Dash({area,onLogout,rawData,dataDate,mtdLabel}){
  const isMgr=area==="MGR";
  const filterAreas=isMgr?["PU4","PU5","PU6","DU3","DU4"]:[area];
  const data=useMemo(()=>(rawData||[]).filter(r=>filterAreas.includes(r.a)),[area,rawData]);
  const [selBrand,setSelBrand]=useState(null);const [search,setSearch]=useState("");const [expandArea,setExpandArea]=useState(null);

  const brands=useMemo(()=>{const s=new Set();data.forEach(r=>s.add(r.b));return[...s].sort();},[data]);
  const activeBrand=selBrand&&brands.includes(selBrand)?selBrand:brands[0]||null;
  const brandSum=useMemo(()=>{const m={};data.forEach(r=>{if(!m[r.b])m[r.b]={b:r.b,v:0};m[r.b].v+=r.v;});return Object.values(m).sort((a,b)=>b.v-a.v);},[data]);
  const totalMTD=brandSum.reduce((s,b)=>s+b.v,0);
  const targets=useMemo(()=>{if(isMgr){const m={};Object.values(APR_TGT).forEach(at=>{Object.entries(at).forEach(([b,t])=>{m[b]=(m[b]||0)+t;});});return m;}return APR_TGT[area]||{};},[area,isMgr]);
  const totalTarget=Object.values(targets).reduce((s,t)=>s+t,0);
  const totalPct=totalTarget>0?(totalMTD/totalTarget)*100:0;
  const custByBrand=useMemo(()=>{if(!activeBrand)return[];const filtered=data.filter(r=>r.b===activeBrand);const m={};filtered.forEach(r=>{const key=isMgr?`${r.a}|${r.c}`:r.c;if(!m[key])m[key]={customer:r.c,area:r.a,amount:0,qty:0,dates:[]};m[key].amount+=r.v;m[key].qty+=r.q;if(!m[key].dates.includes(r.d))m[key].dates.push(r.d);});let list=Object.values(m).sort((a,b)=>b.amount-a.amount);if(search.trim()){const q=search.trim().toLowerCase();list=list.filter(c=>c.customer.toLowerCase().includes(q));}return list;},[data,activeBrand,isMgr,search]);
  const brandMTD=brandSum.find(b=>b.b===activeBrand)?.v||0;
  const brandTgt=targets[activeBrand]||0;
  const schemes=useMemo(()=>{const defs=SCHEME_DEF[isMgr?"MGR":area]||[];return defs.map(s=>{let act=0;if(s.brands){data.forEach(r=>{if(s.brands.includes(r.b))act+=r.v;});}else act=totalMTD;return{...s,act,pct:s.tgt>0?(act/s.tgt)*100:0};});},[area,data,totalMTD,isMgr]);
  const q1Schemes=useMemo(()=>{const defs=Q2_SCHEME[isMgr?"MGR":area]||[];return defs.map(s=>{let marAct=0;if(s.brands){data.forEach(r=>{if(s.brands.includes(r.b))marAct+=r.v;});}else marAct=totalMTD;const totalAct=s.janFebAct+marAct;return{...s,act:totalAct,marAct,pct:s.tgt>0?(totalAct/s.tgt)*100:0};});},[area,data,totalMTD,isMgr]);
  const areaBreak=useMemo(()=>{if(!isMgr)return null;return["PU4","PU5","PU6","DU3","DU4"].map(a=>{const act=(rawData||[]).filter(r=>r.a===a).reduce((s,r)=>s+r.v,0);const tgt=Object.values(APR_TGT[a]||{}).reduce((s,t)=>s+t,0);return{area:a,act,tgt,pct:tgt>0?(act/tgt)*100:0};});},[isMgr]);

  const downloadCSV=useCallback(()=>{let csv="\uFEFFวันที่,Area,ลูกค้า,แบรนด์,จำนวน,ยอดขาย\n";data.forEach(r=>csv+=`${r.d},${r.a},"${r.c}",${r.b},${r.q},${r.v}\n`);const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`SD0002_${area}_MTD.csv`;a.click();URL.revokeObjectURL(url);},[data,area]);

  const card={background:"#fff",borderRadius:16,padding:16,boxShadow:"0 1px 6px rgba(0,0,0,.04)",marginBottom:12};
  const sec={fontSize:11,color:"#94a3b8",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10};

  return(
    <div style={{minHeight:"100vh",background:"#f4f6f8",fontFamily:"'Sarabun',system-ui,sans-serif",padding:"12px 12px 32px",maxWidth:480,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0 12px"}}>
        <div><div style={{fontSize:10,color:"#94a3b8",fontWeight:700,letterSpacing:2}}>UPC2 TEAM</div>
          <h1 style={{fontSize:20,fontWeight:800,color:"#0f172a",margin:"2px 0 0"}}>{isMgr?"Team Total":area}<span style={{fontSize:13,fontWeight:400,color:"#94a3b8",marginLeft:6}}>MTD {mtdLabel}</span></h1></div>
        <button onClick={onLogout} style={{padding:"7px 14px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",color:"#64748b",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ออก</button>
      </div>
      <div style={{background:"#eff6ff",borderRadius:10,padding:"7px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:11}}>📅</span><span style={{fontSize:12,color:"#3b82f6",fontWeight:600}}>ข้อมูลอัพเดต: {dataDate}</span>
        <span style={{fontSize:10,color:"#94a3b8",marginLeft:"auto"}}>{(rawData||[]).length} รายการ</span>
      </div>

      <div style={{...card,padding:"20px 16px"}}><div style={{...sec,textAlign:"center"}}>MTD Achievement</div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><Gauge pct={totalPct} size={150}/><div style={{fontSize:22,fontWeight:800,color:"#0f172a",marginTop:6}}>฿{fmt(totalMTD)}</div><div style={{fontSize:12,color:"#94a3b8"}}>เป้าเดือน ฿{fmt(totalTarget)}</div></div></div>

      <div style={card}><div style={sec}>แยกตามแบรนด์</div>
        {brandSum.map((b,i)=>{const tgt=targets[b.b]||0;const pct=tgt>0?(b.v/tgt)*100:0;const col=pctCol(pct);return(<div key={i} style={{padding:"8px 0",borderBottom:i<brandSum.length-1?"1px solid #f8fafc":"none"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:4,background:BC[b.b]||"#94a3b8",flexShrink:0}}/><span style={{fontSize:13,fontWeight:700,color:"#1e293b"}}>{b.b}</span></div><span style={{fontSize:13,fontWeight:800,color:tgt>0?col:"#64748b"}}>{tgt>0?`${pct.toFixed(0)}%`:"—"}</span></div>{tgt>0&&<Bar pct={pct} color={col}/>}<div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#94a3b8",marginTop:2}}><span>฿{fmtK(b.v)}</span>{tgt>0&&<span>เป้า ฿{fmtK(tgt)}</span>}</div></div>);})}</div>

      {schemes.length>0&&(<div style={card}><div style={sec}>🎯 Incentive Scheme (เป้า เม.ย.)</div>
        <div style={{display:"grid",gridTemplateColumns:schemes.length<=2?"1fr 1fr":`repeat(${Math.min(schemes.length,3)},1fr)`,gap:8}}>
          {schemes.map((s,i)=>(<div key={i} style={{background:"#f8fafc",borderRadius:12,padding:10,textAlign:"center"}}><div style={{fontSize:10,fontWeight:700,color:"#64748b",marginBottom:2,lineHeight:1.2}}>{s.name}</div><Mini pct={s.pct} size={78}/><div style={{fontSize:11,fontWeight:700,color:"#1e293b"}}>฿{fmtK(s.act)}</div><div style={{fontSize:9,color:"#94a3b8"}}>เป้า ฿{fmtK(s.tgt)}</div></div>))}</div></div>)}

      {q1Schemes.length>0&&(<div style={card}><div style={sec}>📊 Q2 Incentive Scheme (เม.ย.–มิ.ย.)</div>
        <div style={{display:"grid",gridTemplateColumns:q1Schemes.length<=2?"1fr 1fr":`repeat(${Math.min(q1Schemes.length,3)},1fr)`,gap:8}}>
          {q1Schemes.map((s,i)=>(<div key={i} style={{background:"#faf5ff",borderRadius:12,padding:10,textAlign:"center",border:"1px solid #ede9fe"}}><div style={{fontSize:10,fontWeight:700,color:"#7c3aed",marginBottom:2,lineHeight:1.2}}>{s.name}</div><Mini pct={s.pct} size={78}/><div style={{fontSize:11,fontWeight:700,color:"#1e293b"}}>฿{fmtK(s.act)}</div><div style={{fontSize:9,color:"#94a3b8"}}>เป้า Q2 ฿{fmtK(s.tgt)}</div><div style={{fontSize:8,color:"#a78bfa",marginTop:2}}>เม.ย. ฿{fmtK(s.marAct)}</div></div>))}</div></div>)}

      {isMgr&&areaBreak&&(<div style={card}><div style={sec}>📍 แยกตาม Area — กดเพื่อดู Scheme</div>
        {areaBreak.map((a,i)=>{const col=pctCol(a.pct);const isOpen=expandArea===a.area;const areaSchemes=isOpen?calcScheme(a.area,rawData||[]):[];const areaQ1=isOpen?calcQ2Scheme(a.area,rawData||[]):[];
          return(<div key={i}><div onClick={()=>setExpandArea(isOpen?null:a.area)} style={{padding:"10px 0",borderBottom:!isOpen&&i<4?"1px solid #f8fafc":"none",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"rotate(0)",display:"inline-block"}}>▸</span><span style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>{a.area}</span></div><div style={{textAlign:"right"}}><span style={{fontSize:14,fontWeight:800,color:col}}>{a.pct.toFixed(1)}%</span><span style={{fontSize:10,color:"#94a3b8",marginLeft:6}}>฿{fmtK(a.act)}</span></div></div><Bar pct={a.pct} color={col} h={7}/><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#94a3b8",marginTop:3}}><span>Actual ฿{fmtK(a.act)}</span><span>Target ฿{fmtK(a.tgt)}</span></div></div>
            {isOpen&&(<div style={{background:"#f8fafc",borderRadius:12,padding:12,margin:"4px 0 4px",borderLeft:"3px solid "+col}}><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:8}}>เม.ย. Scheme — {a.area}</div>{areaSchemes.map((s,j)=>{const sc=pctCol(s.pct);return(<div key={j} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:j<areaSchemes.length-1?"1px solid #e9ecf0":"none"}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{s.name}</div><div style={{fontSize:10,color:"#94a3b8"}}>฿{fmtK(s.act)} / ฿{fmtK(s.tgt)}</div></div><div style={{width:50,textAlign:"right",fontSize:14,fontWeight:800,color:sc}}>{s.pct.toFixed(0)}%</div></div>);})}</div>)}
            {isOpen&&areaQ1.length>0&&(<div style={{background:"#faf5ff",borderRadius:12,padding:12,margin:"4px 0 12px",borderLeft:"3px solid #8b5cf6"}}><div style={{fontSize:11,fontWeight:700,color:"#7c3aed",marginBottom:8}}>Q2 Scheme — {a.area}</div>{areaQ1.map((s,j)=>{const sc=pctCol(s.pct);return(<div key={j} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:j<areaQ1.length-1?"1px solid #ede9fe":"none"}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{s.name}</div><div style={{fontSize:10,color:"#94a3b8"}}>฿{fmtK(s.act)} / ฿{fmtK(s.tgt)}</div></div><div style={{width:50,textAlign:"right",fontSize:14,fontWeight:800,color:sc}}>{s.pct.toFixed(0)}%</div></div>);})}</div>)}
          </div>);})}</div>)}

      <div style={card}><div style={sec}>📋 Customer By Brand</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{brands.map(b=>{const active=b===activeBrand;return(<button key={b} onClick={()=>{setSelBrand(b);setSearch("");}} style={{padding:"6px 12px",borderRadius:8,border:"none",background:active?(BC[b]||"#6366f1"):"#f1f5f9",color:active?"#fff":"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>);})}</div>
        <div style={{position:"relative",marginBottom:10}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94a3b8"}}>🔍</span><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="พิมพ์ชื่อลูกค้า..." style={{width:"100%",padding:"10px 10px 10px 32px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",color:"#1e293b"}}/>{search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",fontSize:14,color:"#94a3b8",cursor:"pointer"}}>✕</button>}</div>
        {activeBrand&&(<div style={{background:"#f8fafc",borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:14,fontWeight:800,color:BC[activeBrand]||"#1e293b"}}>{activeBrand}</span><span style={{fontSize:11,color:"#94a3b8",marginLeft:6}}>({custByBrand.length} ลูกค้า)</span></div><div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>฿{fmt(brandMTD)}</div>{brandTgt>0&&<div style={{fontSize:10,color:pctCol(brandMTD/brandTgt*100),fontWeight:700}}>{(brandMTD/brandTgt*100).toFixed(0)}% of target</div>}</div></div>)}
        {(()=>{const displayList=isMgr&&!search.trim()?custByBrand.slice(0,20):custByBrand;const hiddenCount=isMgr&&!search.trim()?custByBrand.length-20:0;
          return(<>{displayList.map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"9px 0",borderBottom:i<displayList.length-1?"1px solid #f8fafc":"none"}}><div style={{width:22,height:22,borderRadius:6,background:i<3?"#eff6ff":"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:i<3?"#3b82f6":"#b0b8c4",flexShrink:0,marginTop:1}}>{i+1}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"#1e293b",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{isMgr&&<span style={{fontSize:9,color:"#94a3b8",marginRight:3}}>[{c.area}]</span>}{c.customer}</div><div style={{fontSize:10,color:"#94a3b8",marginTop:1}}>📅 {c.dates.sort().join(", ")}{c.qty>0&&<span style={{marginLeft:8}}>Qty: {fmt(c.qty)}</span>}</div></div><div style={{fontSize:13,fontWeight:800,color:"#0f172a",flexShrink:0}}>฿{fmt(c.amount)}</div></div>))}
          {hiddenCount>0&&<p style={{fontSize:11,color:"#94a3b8",textAlign:"center",padding:"8px 0"}}>แสดง Top 20 จาก {custByBrand.length} ลูกค้า — ใช้ช่องค้นหาเพื่อดูเพิ่ม</p>}
          {displayList.length===0&&activeBrand&&<p style={{fontSize:12,color:"#94a3b8",textAlign:"center",padding:16}}>{search?"ไม่พบลูกค้าที่ค้นหา":"ยังไม่มีลูกค้าที่ซื้อแบรนด์นี้"}</p>}</>);})()}
      </div>

      <button onClick={downloadCSV} style={{width:"100%",padding:13,borderRadius:14,border:"1.5px solid #e2e8f0",background:"#fff",color:"#1e293b",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>📥 ดาวน์โหลดรายละเอียด (CSV)</button>
      <p style={{textAlign:"center",fontSize:10,color:"#b0b8c4",marginTop:16}}>UPC2 Team — ยอดขาย = Net Sales Amount − Borrow Amount</p>
    </div>
  );
}

export default function App(){
  const [area,setArea]=useState(null);
  const [appData,setAppData]=useState(null);
  const [loadErr,setLoadErr]=useState(false);

  useEffect(()=>{
    fetch('./data.json?_='+Date.now())
      .then(r=>{if(!r.ok)throw new Error();return r.json();})
      .then(d=>setAppData(d))
      .catch(()=>setLoadErr(true));
  },[]);

  if(loadErr) return(
    <div style={{minHeight:"100vh",background:"#0c1222",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#f87171",textAlign:"center",fontFamily:"system-ui"}}>
        <div style={{fontSize:32,marginBottom:8}}>⚠️</div>
        <div style={{fontWeight:700}}>ไม่พบ data.json</div>
        <div style={{fontSize:12,color:"#64748b",marginTop:4}}>กรุณารัน update.py ก่อนเปิด dashboard</div>
      </div>
    </div>);

  if(!appData) return(
    <div style={{minHeight:"100vh",background:"#0c1222",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#818cf8",textAlign:"center",fontFamily:"system-ui"}}>
        <div style={{fontSize:28,marginBottom:8,animation:"spin 1s linear infinite"}}>⏳</div>
        <div style={{fontWeight:600}}>กำลังโหลดข้อมูล...</div>
      </div>
    </div>);

  if(!area) return <Login onLogin={setArea} dataDate={appData.dataDate}/>;
  return <Dash area={area} onLogout={()=>setArea(null)} rawData={appData.raw} dataDate={appData.dataDate} mtdLabel={appData.mtdLabel}/>;
}
