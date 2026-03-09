import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const SUPABASE_URL = "https://uwlqyhhyyelbpgmgtann.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bHF5aGh5eWVsYnBnbWd0YW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDgxODYsImV4cCI6MjA4ODI4NDE4Nn0.n-8rbXwsZiz3xG7A5nMBryYYmwEImGmijyKjo48gtPk";

const sb = async (table, method = "GET", body = null, extra = "") => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${extra}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  if (method === "DELETE" || res.status === 204) return [];
  return res.json();
};

const SEED_WORKSHOPS = [
  { client:"גולני", date:"2024-06-03", price:0, venue_cost:400, venue:"MindCET", lead:"עידו", source:"פה לאוזן", album:"" },
  { client:"Microsoft", date:"2024-06-16", price:1500, venue_cost:0, venue:"בית בהוד השרון", lead:"עידו", source:"משפחה/חברים", album:"" },
  { client:"MadAwar", date:"2024-07-24", price:4000, venue_cost:1500, venue:"תיכון אביב", lead:"עידו", source:"", album:"" },
  { client:"Mataf", date:"2024-09-08", price:3000, venue_cost:0, venue:"עיינות", lead:"עידו", source:"", album:"" },
  { client:"siraj", date:"2024-09-10", price:3000, venue_cost:0, venue:"בחברה", lead:"עידו", source:"מעוז", album:"" },
  { client:"Rom", date:"2024-09-16", price:3510, venue_cost:0, venue:"באר יעקב", lead:"עידו", source:"משפחה/חברים", album:"" },
  { client:"IQL", date:"2024-09-18", price:1755, venue_cost:0, venue:"IQL", lead:"עידו", source:"Linkedin", album:"" },
  { client:'ממ"ג', date:"2024-09-24", price:4500, venue_cost:1500, venue:"גבעות וושינגטון", lead:"עידו", source:"", album:"" },
  { client:"מרכז תמר", date:"2024-09-25", price:1755, venue_cost:400, venue:"MindCET", lead:"עידו", source:"מעוז", album:"" },
  { client:"Cisco", date:"2024-09-29", price:2250, venue_cost:0, venue:"WeWork ToHa", lead:"עידו", source:"משפחה/חברים", album:"" },
  { client:"Rewire", date:"2024-09-30", price:3000, venue_cost:0, venue:"רוטשילד 57", lead:"עידו", source:"לקוח מרוצה", album:"" },
  { client:"Tufin", date:"2024-10-29", price:3000, venue_cost:0, venue:"בחברה", lead:"עידו", source:"קבוצת HR", album:"" },
  { client:"בר אילן", date:"2024-11-04", price:1000, venue_cost:0, venue:"בחברה", lead:"עידו", source:"משפחה/חברים", album:"" },
  { client:"IrLabs", date:"2024-12-08", price:3510, venue_cost:0, venue:"MyCampus", lead:"עידו", source:"", album:"" },
  { client:"בית חולים באר שבע", date:"2024-12-12", price:3000, venue_cost:400, venue:"MindCET", lead:"עידו", source:"מעוז", album:"" },
  { client:"גליקס", date:"2024-12-22", price:3510, venue_cost:0, venue:"פירמה", lead:"דני סחרוב", source:"לקוח מרוצה", album:"" },
  { client:"Mitiga", date:"2024-12-22", price:4680, venue_cost:0, venue:"יד השמונה", lead:"עידו", source:"", album:"" },
  { client:"ביס תלמים", date:"2024-12-23", price:4680, venue_cost:0, venue:"בחברה", lead:"עידו", source:"יעל פצ'יץ", album:"" },
  { client:"מיתר1", date:"2025-01-01", price:3540, venue_cost:0, venue:"בחברה", lead:"עוזי", source:"עידו", album:"" },
  { client:"MSD", date:"2025-01-23", price:19890, venue_cost:0, venue:"מלון אינטרקונטיננטל", lead:"עידו", source:"חברת אמצע", album:"" },
  { client:"אינפינידום", date:"2025-01-28", price:1652, venue_cost:0, venue:"כפר מונש", lead:"עידו", source:"אור סף", album:"" },
  { client:"אשכול", date:"2025-02-03", price:3600, venue_cost:0, venue:"גרובטק", lead:"עידו", source:"אורן חפץ", album:"" },
  { client:"oracle", date:"2025-02-12", price:4720, venue_cost:400, venue:"MindCET", lead:"עידו", source:"ליאור", album:"" },
  { client:"מעוף מחוננים", date:"2025-02-17", price:3540, venue_cost:0, venue:"בחברה", lead:"עידו", source:"עידו", album:"" },
  { client:"אשכול 2", date:"2025-02-17", price:3600, venue_cost:0, venue:"גרובטק", lead:"עידו", source:"אורן חפץ", album:"" },
  { client:"ג'ון ברייס", date:"2025-02-19", price:3540, venue_cost:0, venue:"ג'ון ברייס", lead:"דני סחרוב", source:"ליאור", album:"" },
  { client:"אשכול 3", date:"2025-02-24", price:3600, venue_cost:0, venue:"גרובטק", lead:"עידו", source:"אורן חפץ", album:"" },
  { client:"הפועלים", date:"2025-03-02", price:7080, venue_cost:0, venue:"בחברה", lead:"עידו + דניס", source:"יעל פצ'יץ", album:"" },
  { client:"אשכול 4", date:"2025-03-10", price:3600, venue_cost:0, venue:"גרובטק", lead:"עידו", source:"אורן חפץ", album:"" },
  { client:"CaPaw", date:"2025-03-27", price:4720, venue_cost:400, venue:"MindCET", lead:"עידו + עוזי", source:"ליאור", album:"" },
  { client:"Leidos", date:"2025-04-03", price:4720, venue_cost:0, venue:"כרמים", lead:"עידו", source:"סדנת HR", album:"" },
  { client:"כלל ביטוח", date:"2025-05-20", price:9440, venue_cost:0, venue:"בחברה", lead:"עידו", source:"אפקטיב", album:"" },
  { client:"MDCLONE", date:"2025-07-14", price:4720, venue_cost:400, venue:"MindCET", lead:"רם", source:"עידו", album:"" },
  { client:"ICL", date:"2025-08-27", price:8260, venue_cost:2000, venue:"מתנס הרצליה", lead:"עידו", source:"עידו", album:"" },
  { client:'וא"א', date:"2025-09-03", price:7080, venue_cost:0, venue:"תעוז", lead:"עידו", source:"אלווישן", album:"" },
  { client:'ממ"ג 2', date:"2025-09-07", price:7080, venue_cost:0, venue:"תעוז", lead:"עידו", source:"אלווישן", album:"" },
  { client:"ממן", date:"2025-10-27", price:4720, venue_cost:0, venue:"ארזה", lead:"עידו", source:"סוזנה", album:"" },
  { client:"לומינס", date:"2025-11-05", price:4720, venue_cost:0, venue:"רמת הנדיב", lead:"עידו", source:"אפקטיב", album:"" },
  { client:"אלקטרה מעליות", date:"2025-11-05", price:5900, venue_cost:0, venue:"בחברה", lead:"עידו", source:"גלית לוי", album:"" },
  { client:"דיפנד", date:"2025-11-05", price:5900, venue_cost:0, venue:"מוזיאון אנו", lead:"עידו", source:"מירקל", album:"" },
  { client:"IQL Monday", date:"2025-11-26", price:5310, venue_cost:0, venue:"אקוסטה", lead:"עידו", source:"IQL", album:"" },
  { client:"Qlik", date:"2025-12-04", price:5900, venue_cost:0, venue:"בחברה", lead:"עידו", source:"דיאגו", album:"" },
  { client:"Fiverr", date:"2025-12-09", price:5900, venue_cost:0, venue:"בחברה", lead:"עידו", source:"אפקטיב", album:"" },
  { client:"רפאל", date:"2025-12-16", price:5900, venue_cost:0, venue:"קיבוץ אושה", lead:"עידו", source:"אפקטיב", album:"" },
  { client:"בטחון פנים", date:"2025-12-24", price:7080, venue_cost:0, venue:"ארזה", lead:"עידו+אורי", source:"אלווישן", album:"" },
  { client:"כלל 1", date:"2025-12-28", price:4720, venue_cost:0, venue:"בחברה", lead:"עידו", source:"אפקטיב", album:"" },
  { client:"כלל 2", date:"2025-12-29", price:4720, venue_cost:0, venue:"בחברה", lead:"עידו", source:"אפקטיב", album:"" },
  { client:'קמ"ג', date:"2026-01-08", price:7080, venue_cost:400, venue:"MindCET", lead:"עידו + אורי", source:"אלווישן", album:"https://photos.app.goo.gl/WFtakCKeoukcgoMr5" },
  { client:"משרד רוהמ", date:"2026-01-12", price:5500, venue_cost:400, venue:"MindCET", lead:"עידו", source:"", album:"" },
  { client:"מיתר2", date:"2026-01-22", price:3540, venue_cost:0, venue:"בחברה", lead:"עוזי", source:"עידו", album:"" },
  { client:"מורים דימונה", date:"2026-02-01", price:0, venue_cost:400, venue:"MindCET", lead:"עידו", source:"MindCET", album:"https://photos.app.goo.gl/EdkTc9vtK3txT1bo7" },
  { client:"הייטק משרד החינוך", date:"2026-02-23", price:0, venue_cost:0, venue:"פסגה מודיעין", lead:"עידו", source:"MindCET", album:"https://photos.app.goo.gl/1CGQQ3XWTZ6QNHki6" },
];

const SEED_EXPENSES = [
  { date:"2026-01-08", description:"אלווישן 5", category:"תפעול", amount:1500 },
  { date:"2026-01-01", description:"רואה חשבון", category:"הנהלה וכלליות", amount:2596 },
  { date:"2026-01-01", description:"Google", category:"הנהלה וכלליות", amount:164 },
  { date:"2026-01-12", description:"תיקוני רחפן", category:"תפעול", amount:1100 },
  { date:"2026-01-07", description:"הדס פיתוח", category:"פיתוח מוצר", amount:2500 },
  { date:"2026-01-19", description:"קורס AI", category:"פיתוח מוצר", amount:402 },
  { date:"2026-01-19", description:"כנס פ.א.י", category:"שיווק ומכירות", amount:102 },
  { date:"2026-01-26", description:"אלווישן 6", category:"תפעול", amount:1500 },
  { date:"2026-01-29", description:"טמפו", category:"תפעול", amount:500 },
  { date:"2026-02-01", description:"מחברות", category:"תפעול", amount:5015 },
  { date:"2026-02-01", description:"ויקטור", category:"תפעול", amount:1000 },
  { date:"2026-02-01", description:"יהונתן", category:"תפעול", amount:1000 },
  { date:"2026-02-01", description:"הדס סדנאות", category:"תפעול", amount:1850 },
  { date:"2026-02-01", description:"עוזי מיתר", category:"תפעול", amount:750 },
  { date:"2026-02-01", description:"גזיבו", category:"שיווק ומכירות", amount:3469 },
  { date:"2026-02-01", description:"רשת יונים", category:"שיווק ומכירות", amount:206 },
  { date:"2026-02-24", description:"רשם החברות", category:"הנהלה וכלליות", amount:1338 },
  { date:"2026-03-01", description:"הדס סדנאות", category:"תפעול", amount:1850 },
  { date:"2026-03-01", description:"הדס תוכנה", category:"פיתוח מוצר", amount:1100 },
  { date:"2026-03-01", description:"יהונתן HR דרום", category:"תפעול", amount:500 },
  { date:"2026-03-01", description:"רואה חשבון", category:"הנהלה וכלליות", amount:2596 },
  { date:"2026-03-01", description:"Google", category:"הנהלה וכלליות", amount:164 },
  { date:"2026-01-01", description:"טק19 - פיתוח", category:"פיתוח מוצר", amount:4720 },
];

const SEED_LEADS = [
  { company:"אגף החינוך דימונה", contact:"שמעון רוזיליו", status:"ממתינים להזמנה", manager:"עידו", phone:"052-3820475", source:"עידו", album:"" },
  { company:"Cyera", contact:"מקסים ריבקוב", status:"בניית הצעה", manager:"אור", phone:"0525664964", source:"אור", album:"" },
  { company:"beewise", contact:"הגר", status:"ממתינים להזמנה", manager:"אור", phone:"0506693063", source:"לינקדין", album:"" },
  { company:"Intel", contact:"חן טפר-חן", status:"ממתינים להזמנה", manager:"אור", phone:"", source:"אתר", album:"" },
  { company:"טבע", contact:"דנה לידר", status:"ממתינים להזמנה", manager:"אור", phone:"0526791050", source:"שמעו מרפאל", album:"" },
  { company:'ויצ"ו', contact:"ליטל נחמיאס", status:"תואמה סדנה", manager:"אור", phone:"0535200124", source:"אתר", album:"" },
  { company:"EY", contact:"הילה נצר קהלני", status:"בניית הצעה", manager:"", phone:"0524249248", source:"", album:"" },
  { company:"אל על", contact:"איה", status:"בניית הצעה", manager:"עידו", phone:"0529247200", source:"שי חיון", album:"" },
  { company:"Plan it israel", contact:"Rachel", status:"ממתינים להזמנה", manager:"אור", phone:"0526353548", source:"אתר", album:"" },
  { company:"קרית חינוך דרור", contact:"יערה דוד", status:"בניית הצעה", manager:"עידו", phone:"050-250-8588", source:"אתר", album:"" },
  { company:"blinkops", contact:"יונתן הוכמן", status:"פנייה חדשה", manager:"אור", phone:"0547785438", source:"אתר", album:"" },
  { company:"META", contact:"אלכס אומנסקי", status:"ממתינים להזמנה", manager:"אתר", phone:"0549077196", source:"אתר", album:"" },
  { company:"KAYHUT", contact:"אבי ויסמן", status:"ממתינים להזמנה", manager:"אור", phone:"972-54-940-2945", source:"אתר", album:"" },
  { company:"Honeywell", contact:"Marco Bonzi", status:"פנייה חדשה", manager:"אור", phone:"", source:"אור", album:"" },
  { company:"Aitech Systems", contact:"ניצנית בר לוי", status:"פנייה חדשה", manager:"אור", phone:"0545704211", source:"אתר", album:"" },
];

const SEED_VENUES = [
  { name:"גבעות וושינגטון", cost:1500, album:"https://photos.app.goo.gl/7RitjVh462t4Jeni7", area:"יבנה", maps:"https://maps.app.goo.gl/gkKDzEVKeDvTA2F99", contact:"עדה בוגנים", phone:"054-6222207", notes:"מקום פשוט + פינת קפה", url:"" },
  { name:"תיכון אביב", cost:1500, album:"https://photos.app.goo.gl/DCDgqc3mygsFzqGY9", area:"רעננה", maps:"https://maps.app.goo.gl/zyK3E18teQode8ax7", contact:"אורי", phone:"054-4823860", notes:"בתוך בית ספר - גדול", url:"" },
  { name:"חניית IQL", cost:1500, album:"https://photos.app.goo.gl/DhKdRSH6LNdXUSc59", area:"לינקולן תל אביב", maps:"https://maps.app.goo.gl/6iYLWMU3yEQZHJpk8", contact:"עידו", phone:"", notes:"וייב של חניון עם גראפיטי", url:"" },
  { name:"MyCampus", cost:3000, album:"https://photos.app.goo.gl/37e5vYqFdMP4JYYQ6", area:"בני ברק", maps:"https://maps.app.goo.gl/49FS6wdSRoibxGMm7", contact:"", phone:"", notes:"מקום טוב מאובזר ומטבחון", url:"https://mycampus.co.il" },
  { name:"רוטשילד 57", cost:0, album:"https://photos.app.goo.gl/67pyHybbyu6KGm8b7", area:"רוטשילד תל אביב", maps:"https://maps.app.goo.gl/ZMtyHHe5Ptx13sf1A", contact:"", phone:"", notes:"מקום טוב מאובזר ומטבחון", url:"https://rothschild57.com" },
  { name:"WeWork ToHa", cost:0, album:"https://photos.app.goo.gl/FrSaJyuMU2rcRZDu8", area:"ליד עזריאלי", maps:"https://maps.app.goo.gl/ZMtyHHe5Ptx13sf1A", contact:"", phone:"", notes:"רמה מאוד גבוהה", url:"" },
  { name:"MindCET", cost:0, album:"https://photos.app.goo.gl/NQwBkgGHYWZzJbcCA", area:"ירוחם", maps:"https://maps.app.goo.gl/EaxCL7NC87GA4j9a7", contact:"עידו", phone:"", notes:"גדול, נוח, יפה, פסיליטיז", url:"https://www.mindcet.org" },
  { name:"פארק קרסו", cost:1500, album:"", area:"באר שבע", maps:"https://maps.app.goo.gl/FyWZLQ8czvjpk8ZJ7", contact:"עידו", phone:"", notes:"", url:"" },
  { name:"פירמה", cost:1600, album:"https://photos.app.goo.gl/4WbmPzaM8FLrT1G7A", area:"תושיה 9 תל אביב", maps:"https://maps.app.goo.gl/Wqn6qtVvKbLSZhUC8", contact:"עדי דינר", phone:"054-4760773", notes:"מקום מעולה מאובזר במרכז תל אביב", url:"https://www.firmabrands.com" },
  { name:"טרמינל עיצוב בת ים", cost:0, album:"", area:"בת ים", maps:"https://maps.app.goo.gl/WTEDviLHry58tMfi7", contact:"ניצן טביב", phone:"054-6740143", notes:"", url:"" },
  { name:"מלון לוגוס", cost:6000, album:"https://photos.app.goo.gl/XiYs485eUhojJMc7A", area:"יד השמונה", maps:"https://maps.app.goo.gl/56F2H7HmMeRDj8Pw9", contact:"", phone:"", notes:"", url:"" },
  { name:"המועצה לישראל יפה", cost:2450, album:"", area:"גני התערוכה", maps:"https://maps.app.goo.gl/UfKuaEDJ4jTNS1T47", contact:"גלינה", phone:"galinay@israel-yafa.org.il", notes:"טרם עשינו - נראה מושלם!", url:"" },
  { name:"בית העם כפר מונש", cost:700, album:"https://photos.app.goo.gl/S3Mv6goD7Jucszy86", area:"כפר מונש", maps:"https://maps.app.goo.gl/dz8iRpAEpHy83KeeA", contact:"ליטל", phone:"053-5200592", notes:"גדול ונוח. דשה ענק ויפה", url:"" },
  { name:"בית ארזה", cost:1000, album:"", area:"מוצא עילית", maps:"https://maps.app.goo.gl/1i4Mjj8FzxPRunsXA", contact:"חיה", phone:"050-6888382", notes:"מקום יפיפה ומאוד מתאים", url:"" },
  { name:"מתנס הרצליה", cost:2000, album:"https://photos.app.goo.gl/Jaz7uJxQg9WYQPGR8", area:"הרצליה", maps:"https://maps.app.goo.gl/AAK8CSpBD5rTvBor5", contact:"חבצלת", phone:"050-4097779", notes:"מקום מתאים מאוד", url:"" },
  { name:"מוזיאון אנו", cost:0, album:"https://photos.app.goo.gl/B71Qv7VkkmYQEJMg9", area:"תל אביב", maps:"", contact:"עטרת", phone:"052-2448431", notes:"מקום מעולה!!", url:"" },
  { name:"רמת הנדיב", cost:0, album:"https://photos.app.goo.gl/cMYb65NapnbcNruN8", area:"זכרון יעקוב", maps:"", contact:"גלי", phone:"052-6961888", notes:"מקום מעולה!!", url:"" },
  { name:"אקוסטה", cost:0, album:"https://photos.app.goo.gl/DqRUdiCHAsosqBD16", area:"תל אביב", maps:"", contact:"", phone:"050-6554421", notes:"מקום טוב ויפה. מעט קטן", url:"https://www.acosta.co.il" },
];

const fmt = n => "₪" + (n || 0).toLocaleString("he-IL");
const monthLabel = d => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`; };
const COLORS = ["#00d4aa","#ff6b35","#7c3aed","#fbbf24","#3b82f6","#ec4899","#10b981","#f97316"];
const STATUS_COLORS = { "פנייה חדשה":"#64748b","שיחה ראשונה":"#3b82f6","בניית הצעה":"#f59e0b","ממתינים להזמנה":"#8b5cf6","תואמה סדנה":"#10b981","בוצעה סדנה":"#00d4aa","לא מעוניין":"#ef4444" };

function AlbumBtn({ url, small }) {
  if (!url) return null;
  return <a href={url} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:4, padding: small?"2px 8px":"4px 10px", background:"#1a1a2e", border:"1px solid #4338ca55", borderRadius:6, color:"#818cf8", textDecoration:"none", fontSize:small?10:12, fontWeight:600, whiteSpace:"nowrap" }}>📷 {!small && "אלבום"}</a>;
}
function MapsBtn({ url }) {
  if (!url) return null;
  return <a href={url} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:3, padding:"2px 8px", background:"#0f2027", border:"1px solid #06b6d422", borderRadius:6, color:"#22d3ee", textDecoration:"none", fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>📍 מפה</a>;
}
function Stat({ label, value, sub, color="#00d4aa" }) {
  return <div style={{ background:"#111827", border:`1px solid ${color}33`, borderRadius:12, padding:"16px 20px", minWidth:148 }}><div style={{ fontSize:10, color:"#6b7280", marginBottom:3, letterSpacing:1, textTransform:"uppercase" }}>{label}</div><div style={{ fontSize:22, fontWeight:700, color, fontFamily:"'Space Grotesk',sans-serif" }}>{value}</div>{sub && <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{sub}</div>}</div>;
}
function Modal({ title, onClose, children }) {
  return <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}><div style={{ background:"#1f2937", borderRadius:16, padding:26, width:"90%", maxWidth:540, maxHeight:"88vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}><h3 style={{ margin:0, color:"#f9fafb", fontSize:16 }}>{title}</h3><button onClick={onClose} style={{ background:"none", border:"none", color:"#6b7280", fontSize:20, cursor:"pointer" }}>✕</button></div>{children}</div></div>;
}
const inp = { width:"100%", padding:"8px 11px", background:"#111827", border:"1px solid #374151", borderRadius:8, color:"#f9fafb", fontSize:13, boxSizing:"border-box" };
function F({ label, children }) { return <div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:11, color:"#9ca3af", marginBottom:3 }}>{label}</label>{children}</div>; }
function Spinner() { return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:60, color:"#6b7280", fontSize:14 }}>⏳ טוען נתונים...</div>; }

function Dashboard({ workshops, expenses }) {
  const totalRevenue = workshops.reduce((s,w)=>s+(w.price||0),0);
  const totalExpenses = expenses.reduce((s,e)=>s+(e.amount||0),0);
  const totalVenueCost = workshops.reduce((s,w)=>s+(w.venue_cost||0),0);
  const profit = totalRevenue - totalExpenses - totalVenueCost;
  const wsThisYear = workshops.filter(w=>new Date(w.date).getFullYear()===2026);
  const revThisYear = wsThisYear.reduce((s,w)=>s+w.price,0);
  const byMonth={}, expByMonth={};
  workshops.forEach(w=>{const m=monthLabel(w.date);byMonth[m]=(byMonth[m]||0)+(w.price||0);});
  expenses.forEach(e=>{const m=monthLabel(e.date);expByMonth[m]=(expByMonth[m]||0)+(e.amount||0);});
  const months=[...new Set([...Object.keys(byMonth),...Object.keys(expByMonth)])].sort().slice(-14);
  const monthlyData=months.map(m=>({month:m.slice(5)+"/"+m.slice(2,4),הכנסות:byMonth[m]||0,הוצאות:expByMonth[m]||0}));
  const bySource={};
  workshops.filter(w=>w.price>0).forEach(w=>{const s=w.source||"לא ידוע";bySource[s]=(bySource[s]||0)+1;});
  const sourceData=Object.entries(bySource).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([name,value])=>({name,value}));
  const byCat={};
  expenses.forEach(e=>{byCat[e.category]=(byCat[e.category]||0)+e.amount;});
  const catData=Object.entries(byCat).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  let cum=0;
  const cumulativeData=[...workshops].filter(w=>w.price>0).sort((a,b)=>new Date(a.date)-new Date(b.date)).map(w=>({date:w.date?.slice(0,7),total:(cum+=w.price)}));
  return (
    <div>
      <h2 style={{color:"#f9fafb",fontSize:20,marginBottom:18,fontFamily:"'Space Grotesk',sans-serif"}}>📊 דשבורד ראשי</h2>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:22}}>
        <Stat label="הכנסות כל הזמנים" value={fmt(totalRevenue)} color="#00d4aa" />
        <Stat label="הכנסות 2026" value={fmt(revThisYear)} sub={`${wsThisYear.length} סדנאות`} color="#3b82f6" />
        <Stat label="הוצאות + מקום" value={fmt(totalExpenses+totalVenueCost)} color="#f59e0b" />
        <Stat label="מאזן" value={fmt(profit)} color={profit>=0?"#10b981":"#ef4444"} />
        <Stat label="סדנאות שבוצעו" value={workshops.length} color="#8b5cf6" />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:"#111827",borderRadius:12,padding:16}}>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>הכנסות vs הוצאות לפי חודש</div>
          <ResponsiveContainer width="100%" height={190}><BarChart data={monthlyData} margin={{left:-20,right:4}}><XAxis dataKey="month" tick={{fill:"#6b7280",fontSize:9}}/><YAxis tick={{fill:"#6b7280",fontSize:9}} tickFormatter={v=>`₪${(v/1000).toFixed(0)}k`}/><Tooltip formatter={v=>[fmt(v)]} contentStyle={{background:"#1f2937",border:"1px solid #374151",borderRadius:8,fontSize:12}}/><Bar dataKey="הכנסות" fill="#00d4aa" radius={[3,3,0,0]}/><Bar dataKey="הוצאות" fill="#ef444477" radius={[3,3,0,0]}/><Legend wrapperStyle={{fontSize:11,color:"#9ca3af"}}/></BarChart></ResponsiveContainer>
        </div>
        <div style={{background:"#111827",borderRadius:12,padding:16}}>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>מקורות לידים</div>
          <ResponsiveContainer width="100%" height={190}><PieChart><Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={26}>{sourceData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip contentStyle={{background:"#1f2937",border:"1px solid #374151",borderRadius:8,fontSize:12}}/><Legend wrapperStyle={{fontSize:9,color:"#9ca3af"}}/></PieChart></ResponsiveContainer>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{background:"#111827",borderRadius:12,padding:16}}>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>הוצאות לפי קטגוריה</div>
          <ResponsiveContainer width="100%" height={140}><BarChart data={catData} layout="vertical" margin={{left:4,right:16}}><XAxis type="number" tick={{fill:"#6b7280",fontSize:9}} tickFormatter={v=>`₪${(v/1000).toFixed(0)}k`}/><YAxis type="category" dataKey="name" tick={{fill:"#9ca3af",fontSize:10}} width={100}/><Tooltip formatter={v=>[fmt(v)]} contentStyle={{background:"#1f2937",border:"1px solid #374151",borderRadius:8,fontSize:12}}/><Bar dataKey="value" fill="#f59e0b" radius={[0,3,3,0]}/></BarChart></ResponsiveContainer>
        </div>
        <div style={{background:"#111827",borderRadius:12,padding:16}}>
          <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>צמיחה מצטברת</div>
          <ResponsiveContainer width="100%" height={140}><LineChart data={cumulativeData} margin={{left:-20,right:4}}><XAxis dataKey="date" tick={{fill:"#6b7280",fontSize:8}}/><YAxis tick={{fill:"#6b7280",fontSize:9}} tickFormatter={v=>`₪${(v/1000).toFixed(0)}k`}/><Tooltip formatter={v=>[fmt(v),"מצטבר"]} contentStyle={{background:"#1f2937",border:"1px solid #374151",borderRadius:8,fontSize:12}}/><Line type="monotone" dataKey="total" stroke="#00d4aa" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function WorkshopsPage({ workshops, setWorkshops, venues, loading }) {
  const [showAdd,setShowAdd]=useState(false);
  const [search,setSearch]=useState("");
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({client:"",date:"",price:"",venue_cost:"",venue:"",lead:"עידו",source:"",album:""});
  const filtered=workshops.filter(w=>w.client?.toLowerCase().includes(search.toLowerCase())||(w.venue||"").toLowerCase().includes(search.toLowerCase())).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const handleVenueChange=venueName=>{const v=venues.find(v=>v.name===venueName);setForm(f=>({...f,venue:venueName,venue_cost:v?v.cost:f.venue_cost,album:f.album||(v?.album||"")}));};
  const add=async()=>{if(!form.client||!form.date)return;setSaving(true);try{const row={...form,price:parseFloat(form.price)||0,venue_cost:parseFloat(form.venue_cost)||0};const[saved]=await sb("workshops","POST",row);setWorkshops(p=>[saved,...p]);setForm({client:"",date:"",price:"",venue_cost:"",venue:"",lead:"עידו",source:"",album:""});setShowAdd(false);}catch(e){alert("שגיאה: "+e.message);}setSaving(false);};
  if(loading)return <Spinner/>;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{color:"#f9fafb",fontSize:20,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>🚁 שוטף סדנאות ({workshops.length})</h2>
        <button onClick={()=>setShowAdd(true)} style={{background:"#00d4aa",color:"#000",border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ סדנה חדשה</button>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="חפש לקוח / מקום..." style={{...inp,marginBottom:12,width:250}}/>
      <div style={{background:"#111827",borderRadius:12,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 0.8fr 0.8fr 1fr 0.7fr 0.5fr",padding:"8px 14px",borderBottom:"1px solid #1f2937",fontSize:10,color:"#6b7280",textAlign:"right"}}>
          <span>לקוח</span><span>תאריך</span><span>מחיר</span><span>עלות מקום</span><span>מקום</span><span>מקור</span><span>אלבום</span>
        </div>
        {filtered.map(w=>(
          <div key={w.id} style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 0.8fr 0.8fr 1fr 0.7fr 0.5fr",padding:"8px 14px",borderBottom:"1px solid #1f2937",fontSize:12,color:"#e5e7eb",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="#1f2937"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontWeight:600,color:"#f9fafb"}}>{w.client}</span>
            <span style={{color:"#6b7280",fontSize:11}}>{w.date?.slice(0,10)}</span>
            <span style={{color:w.price>0?"#00d4aa":"#374151",fontWeight:600}}>{fmt(w.price)}</span>
            <span style={{color:w.venue_cost>0?"#f59e0b":"#374151"}}>{fmt(w.venue_cost)}</span>
            <span style={{color:"#9ca3af",fontSize:11}}>{w.venue}</span>
            <span style={{color:"#6b7280",fontSize:10}}>{w.source}</span>
            <span><AlbumBtn url={w.album} small/></span>
          </div>
        ))}
      </div>
      {showAdd&&<Modal title="סדנה חדשה" onClose={()=>setShowAdd(false)}>
        <F label="לקוח *"><input style={inp} value={form.client} onChange={e=>setForm({...form,client:e.target.value})}/></F>
        <F label="תאריך *"><input type="date" style={inp} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></F>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <F label="מחיר (₪)"><input type="number" style={inp} value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></F>
          <F label="עלות מקום (₪)"><input type="number" style={inp} value={form.venue_cost} onChange={e=>setForm({...form,venue_cost:e.target.value})}/></F>
        </div>
        <F label="מקום"><select style={inp} value={form.venue} onChange={e=>handleVenueChange(e.target.value)}><option value="">בחר מקום...</option>{venues.map(v=><option key={v.id} value={v.name}>{v.name} ({v.area})</option>)}<option value="בחברה">בחברה</option><option value="אחר">אחר</option></select></F>
        <F label="מדריך ראשי"><input style={inp} value={form.lead} onChange={e=>setForm({...form,lead:e.target.value})}/></F>
        <F label="מקור הליד"><input style={inp} value={form.source} onChange={e=>setForm({...form,source:e.target.value})}/></F>
        <F label="📷 Google Photos"><input style={inp} value={form.album} onChange={e=>setForm({...form,album:e.target.value})} placeholder="https://photos.app.goo.gl/..."/></F>
        <button onClick={add} disabled={saving} style={{width:"100%",padding:"9px",background:"#00d4aa",color:"#000",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,marginTop:4}}>{saving?"שומר...":"שמור"}</button>
      </Modal>}
    </div>
  );
}

function FinancePage({ workshops, expenses, setExpenses, loading }) {
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({date:"",description:"",category:"תפעול",amount:""});
  const CATS=["תפעול","הנהלה וכלליות","שיווק ומכירות","פיתוח מוצר","תשלום מע״מ"];
  const totalRevenue=workshops.reduce((s,w)=>s+w.price,0);
  const totalVenue=workshops.reduce((s,w)=>s+w.venue_cost,0);
  const totalExp=expenses.reduce((s,e)=>s+e.amount,0);
  const profit=totalRevenue-totalVenue-totalExp;
  const add=async()=>{if(!form.description||!form.amount)return;setSaving(true);try{const row={...form,amount:parseFloat(form.amount)||0};const[saved]=await sb("expenses","POST",row);setExpenses(p=>[saved,...p]);setForm({date:"",description:"",category:"תפעול",amount:""});setShowAdd(false);}catch(e){alert("שגיאה: "+e.message);}setSaving(false);};
  if(loading)return <Spinner/>;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{color:"#f9fafb",fontSize:20,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>💰 ניהול כספי</h2>
        <button onClick={()=>setShowAdd(true)} style={{background:"#f59e0b",color:"#000",border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ הוצאה חדשה</button>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
        <Stat label="הכנסות סה״כ" value={fmt(totalRevenue)} color="#00d4aa"/>
        <Stat label="עלויות מקום" value={fmt(totalVenue)} color="#f59e0b"/>
        <Stat label="הוצאות ישירות" value={fmt(totalExp)} color="#ef4444"/>
        <Stat label="מאזן" value={fmt(profit)} color={profit>=0?"#10b981":"#ef4444"}/>
      </div>
      <div style={{background:"#111827",borderRadius:12,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"0.8fr 1.5fr 1fr 0.7fr",padding:"8px 14px",borderBottom:"1px solid #1f2937",fontSize:10,color:"#6b7280",textAlign:"right"}}>
          <span>תאריך</span><span>תיאור</span><span>קטגוריה</span><span>סכום</span>
        </div>
        {[...expenses].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>(
          <div key={e.id} style={{display:"grid",gridTemplateColumns:"0.8fr 1.5fr 1fr 0.7fr",padding:"8px 14px",borderBottom:"1px solid #1f2937",fontSize:12,color:"#e5e7eb",alignItems:"center"}} onMouseEnter={ev=>ev.currentTarget.style.background="#1f2937"} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
            <span style={{color:"#6b7280",fontSize:11}}>{e.date?.slice(0,10)}</span>
            <span style={{fontWeight:500}}>{e.description}</span>
            <span style={{fontSize:10}}><span style={{background:"#374151",borderRadius:4,padding:"2px 7px"}}>{e.category}</span></span>
            <span style={{color:"#ef4444",fontWeight:600}}>{fmt(e.amount)}</span>
          </div>
        ))}
      </div>
      {showAdd&&<Modal title="הוצאה חדשה" onClose={()=>setShowAdd(false)}>
        <F label="תאריך"><input type="date" style={inp} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></F>
        <F label="תיאור *"><input style={inp} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></F>
        <F label="קטגוריה"><select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATS.map(c=><option key={c}>{c}</option>)}</select></F>
        <F label="סכום (₪) *"><input type="number" style={inp} value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></F>
        <button onClick={add} disabled={saving} style={{width:"100%",padding:"9px",background:"#f59e0b",color:"#000",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,marginTop:4}}>{saving?"שומר...":"שמור"}</button>
      </Modal>}
    </div>
  );
}

function LeadsPage({ leads, setLeads, loading }) {
  const [showAdd,setShowAdd]=useState(false);
  const [filter,setFilter]=useState("הכל");
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({company:"",contact:"",status:"פנייה חדשה",manager:"עידו",phone:"",source:"",album:""});
  const STATUSES=["הכל","פנייה חדשה","שיחה ראשונה","בניית הצעה","ממתינים להזמנה","תואמה סדנה","בוצעה סדנה","לא מעוניין"];
  const filtered=leads.filter(l=>filter==="הכל"||l.status===filter);
  const add=async()=>{if(!form.company)return;setSaving(true);try{const[saved]=await sb("leads","POST",form);setLeads(p=>[saved,...p]);setForm({company:"",contact:"",status:"פנייה חדשה",manager:"עידו",phone:"",source:"",album:""});setShowAdd(false);}catch(e){alert("שגיאה: "+e.message);}setSaving(false);};
  if(loading)return <Spinner/>;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{color:"#f9fafb",fontSize:20,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>🎯 ניהול לקוחות ולידים</h2>
        <button onClick={()=>setShowAdd(true)} style={{background:"#8b5cf6",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ ליד חדש</button>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:16}}>
        {STATUSES.map(s=>{const count=s==="הכל"?leads.length:leads.filter(l=>l.status===s).length;const col=STATUS_COLORS[s]||"#374151";return <div key={s} onClick={()=>setFilter(s)} style={{background:filter===s?col+"22":"#111827",border:`1px solid ${col}44`,borderRadius:8,padding:"6px 11px",cursor:"pointer",textAlign:"center",minWidth:78}}><div style={{fontSize:9,color:"#6b7280",marginBottom:1}}>{s}</div><div style={{fontSize:17,fontWeight:700,color:col}}>{count}</div></div>;})}
      </div>
      <div style={{background:"#111827",borderRadius:12,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 0.7fr 0.9fr 0.4fr",padding:"8px 14px",borderBottom:"1px solid #1f2937",fontSize:10,color:"#6b7280",textAlign:"right"}}>
          <span>חברה</span><span>איש קשר</span><span>סטטוס</span><span>מנהל</span><span>טלפון</span><span>אלבום</span>
        </div>
        {filtered.map(l=>(
          <div key={l.id} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 0.7fr 0.9fr 0.4fr",padding:"8px 14px",borderBottom:"1px solid #1f2937",fontSize:12,color:"#e5e7eb",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="#1f2937"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontWeight:600,color:"#f9fafb"}}>{l.company}</span>
            <span style={{color:"#9ca3af",fontSize:11}}>{l.contact}</span>
            <span><span style={{background:(STATUS_COLORS[l.status]||"#374151")+"22",color:STATUS_COLORS[l.status]||"#9ca3af",border:`1px solid ${(STATUS_COLORS[l.status]||"#374151")}55`,borderRadius:4,padding:"2px 7px",fontSize:10}}>{l.status}</span></span>
            <span style={{color:"#9ca3af",fontSize:11}}>{l.manager}</span>
            <span style={{color:"#6b7280",fontSize:11}}>{l.phone}</span>
            <span><AlbumBtn url={l.album} small/></span>
          </div>
        ))}
      </div>
      {showAdd&&<Modal title="ליד חדש" onClose={()=>setShowAdd(false)}>
        <F label="חברה *"><input style={inp} value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></F>
        <F label="איש קשר"><input style={inp} value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}/></F>
        <F label="סטטוס"><select style={inp} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{STATUSES.slice(1).map(s=><option key={s}>{s}</option>)}</select></F>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <F label="מנהל לקוח"><input style={inp} value={form.manager} onChange={e=>setForm({...form,manager:e.target.value})}/></F>
          <F label="טלפון"><input style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></F>
        </div>
        <F label="מקור הליד"><input style={inp} value={form.source} onChange={e=>setForm({...form,source:e.target.value})}/></F>
        <F label="📷 Google Photos"><input style={inp} value={form.album} onChange={e=>setForm({...form,album:e.target.value})} placeholder="https://photos.app.goo.gl/..."/></F>
        <button onClick={add} disabled={saving} style={{width:"100%",padding:"9px",background:"#8b5cf6",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,marginTop:4}}>{saving?"שומר...":"שמור"}</button>
      </Modal>}
    </div>
  );
}

function VenuesPage({ venues, setVenues, loading }) {
  const [showAdd,setShowAdd]=useState(false);
  const [search,setSearch]=useState("");
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({name:"",cost:"",album:"",area:"",maps:"",contact:"",phone:"",notes:"",url:""});
  const filtered=venues.filter(v=>v.name?.toLowerCase().includes(search.toLowerCase())||v.area?.toLowerCase().includes(search.toLowerCase()));
  const add=async()=>{if(!form.name)return;setSaving(true);try{const row={...form,cost:parseFloat(form.cost)||0};const[saved]=await sb("venues","POST",row);setVenues(p=>[...p,saved]);setForm({name:"",cost:"",album:"",area:"",maps:"",contact:"",phone:"",notes:"",url:""});setShowAdd(false);}catch(e){alert("שגיאה: "+e.message);}setSaving(false);};
  if(loading)return <Spinner/>;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{color:"#f9fafb",fontSize:20,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>📍 מקומות לסדנאות ({venues.length})</h2>
        <button onClick={()=>setShowAdd(true)} style={{background:"#22d3ee",color:"#000",border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ מקום חדש</button>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="חפש מקום / אזור..." style={{...inp,marginBottom:12,width:240}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {filtered.map(v=>(
          <div key={v.id} style={{background:"#111827",border:"1px solid #1f2937",borderRadius:12,padding:16}} onMouseEnter={e=>e.currentTarget.style.borderColor="#374151"} onMouseLeave={e=>e.currentTarget.style.borderColor="#1f2937"}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div><div style={{fontWeight:700,color:"#f9fafb",fontSize:14,marginBottom:2}}>{v.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{v.area}</div></div>
              {v.cost>0?<span style={{background:"#f59e0b22",color:"#f59e0b",border:"1px solid #f59e0b44",borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700}}>{fmt(v.cost)}</span>:<span style={{background:"#10b98122",color:"#10b981",border:"1px solid #10b98144",borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700}}>חינם</span>}
            </div>
            {v.notes&&<div style={{fontSize:11,color:"#9ca3af",marginBottom:10,lineHeight:1.5}}>{v.notes}</div>}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <AlbumBtn url={v.album}/>
              <MapsBtn url={v.maps}/>
              {v.url&&<a href={v.url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",background:"#0f172a",border:"1px solid #37415155",borderRadius:6,color:"#94a3b8",textDecoration:"none",fontSize:10}}>🌐 אתר</a>}
            </div>
            {(v.contact||v.phone)&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #1f2937",display:"flex",gap:12}}>{v.contact&&<span style={{fontSize:11,color:"#9ca3af"}}>👤 {v.contact}</span>}{v.phone&&<span style={{fontSize:11,color:"#6b7280"}}>📞 {v.phone}</span>}</div>}
          </div>
        ))}
      </div>
      {showAdd&&<Modal title="מקום חדש" onClose={()=>setShowAdd(false)}>
        <F label="שם המקום *"><input style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></F>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <F label="אזור"><input style={inp} value={form.area} onChange={e=>setForm({...form,area:e.target.value})}/></F>
          <F label="עלות (₪)"><input type="number" style={inp} value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})}/></F>
        </div>
        <F label="📷 Google Photos"><input style={inp} value={form.album} onChange={e=>setForm({...form,album:e.target.value})} placeholder="https://photos.app.goo.gl/..."/></F>
        <F label="📍 Google Maps"><input style={inp} value={form.maps} onChange={e=>setForm({...form,maps:e.target.value})} placeholder="https://maps.app.goo.gl/..."/></F>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <F label="איש קשר"><input style={inp} value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}/></F>
          <F label="טלפון"><input style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></F>
        </div>
        <F label="הערות"><input style={inp} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></F>
        <F label="אתר"><input style={inp} value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..."/></F>
        <button onClick={add} disabled={saving} style={{width:"100%",padding:"9px",background:"#22d3ee",color:"#000",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,marginTop:4}}>{saving?"שומר...":"שמור"}</button>
      </Modal>}
    </div>
  );
}

export default function App() {
  const [page,setPage]=useState("dashboard");
  const [workshops,setWorkshops]=useState([]);
  const [expenses,setExpenses]=useState([]);
  const [leads,setLeads]=useState([]);
  const [venues,setVenues]=useState([]);
  const [loading,setLoading]=useState(true);
  const [seeding,setSeeding]=useState(false);
  const [error,setError]=useState(null);

  useEffect(()=>{
    const load=async()=>{
      try{
        const[ws,ex,ld,vn]=await Promise.all([
          sb("workshops","GET",null,"?order=date.desc"),
          sb("expenses","GET",null,"?order=date.desc"),
          sb("leads","GET",null,"?order=created_at.desc"),
          sb("venues","GET",null,"?order=name.asc"),
        ]);
        setWorkshops(ws);setExpenses(ex);setLeads(ld);setVenues(vn);
      }catch(e){setError(e.message);}
      setLoading(false);
    };
    load();
  },[]);

  const seedAll=async()=>{
    setSeeding(true);
    try{
      const[ws,ex,ld,vn]=await Promise.all([
        sb("workshops","POST",SEED_WORKSHOPS),
        sb("expenses","POST",SEED_EXPENSES),
        sb("leads","POST",SEED_LEADS),
        sb("venues","POST",SEED_VENUES),
      ]);
      setWorkshops(ws);setExpenses(ex);setLeads(ld);setVenues(vn);
    }catch(e){alert("שגיאה בטעינת נתונים: "+e.message);}
    setSeeding(false);
  };

  const nav=[{id:"dashboard",label:"דשבורד",icon:"📊"},{id:"workshops",label:"סדנאות",icon:"🚁"},{id:"finance",label:"כספים",icon:"💰"},{id:"leads",label:"לקוחות",icon:"🎯"},{id:"venues",label:"מקומות",icon:"📍"}];
  const isEmpty=!loading&&workshops.length===0&&expenses.length===0;

  return (
    <div dir="rtl" style={{minHeight:"100vh",background:"#0a0f1a",fontFamily:"system-ui,sans-serif",color:"#f9fafb"}}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet"/>
      <div style={{background:"#111827",borderBottom:"1px solid #1f2937",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0"}}>
          <div style={{width:28,height:28,background:"linear-gradient(135deg,#00d4aa,#3b82f6)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🚁</div>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:16,color:"#f9fafb"}}>Drazer</span>
          <span style={{color:"#374151",fontSize:12,margin:"0 2px"}}>|</span>
          <span style={{color:"#10b981",fontSize:10,background:"#10b98122",border:"1px solid #10b98144",borderRadius:4,padding:"1px 7px"}}>● מחובר לענן</span>
        </div>
        <nav style={{display:"flex",gap:2}}>
          {nav.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{background:page===n.id?"#1f2937":"none",border:page===n.id?"1px solid #374151":"1px solid transparent",borderRadius:8,padding:"6px 13px",color:page===n.id?"#f9fafb":"#9ca3af",cursor:"pointer",fontSize:12,display:"flex",gap:5,alignItems:"center"}}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
      </div>
      <div style={{padding:"22px 26px",maxWidth:1150,margin:"0 auto"}}>
        {error&&<div style={{background:"#ef444422",border:"1px solid #ef4444",borderRadius:10,padding:14,marginBottom:16,color:"#fca5a5",fontSize:13}}>❌ שגיאת חיבור: {error}</div>}
        {isEmpty&&(
          <div style={{background:"#111827",border:"1px solid #374151",borderRadius:14,padding:32,textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:36,marginBottom:12}}>🚁</div>
            <div style={{color:"#f9fafb",fontSize:16,fontWeight:600,marginBottom:6}}>מסד הנתונים ריק</div>
            <div style={{color:"#6b7280",fontSize:13,marginBottom:18}}>לחץ לטעינת כל הנתונים הקיימים (52 סדנאות, 23 הוצאות, 15 לידים, 18 מקומות)</div>
            <button onClick={seedAll} disabled={seeding} style={{background:"#00d4aa",color:"#000",border:"none",borderRadius:8,padding:"10px 28px",cursor:"pointer",fontWeight:700,fontSize:14}}>
              {seeding?"⏳ טוען נתונים...":"📥 טען את כל הנתונים שלי"}
            </button>
          </div>
        )}
        {page==="dashboard"&&<Dashboard workshops={workshops} expenses={expenses}/>}
        {page==="workshops"&&<WorkshopsPage workshops={workshops} setWorkshops={setWorkshops} venues={venues} loading={loading}/>}
        {page==="finance"&&<FinancePage workshops={workshops} expenses={expenses} setExpenses={setExpenses} loading={loading}/>}
        {page==="leads"&&<LeadsPage leads={leads} setLeads={setLeads} loading={loading}/>}
        {page==="venues"&&<VenuesPage venues={venues} setVenues={setVenues} loading={loading}/>}
      </div>
    </div>
  );
}
