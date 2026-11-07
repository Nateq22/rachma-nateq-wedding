/**
 * Google Sheets backend for Rachma & Nateq wedding invitation.
 * Bind this Apps Script to the spreadsheet: Extensions > Apps Script.
 * Deploy as Web app: Execute as Me; Who has access: Anyone.
 * PUBLIC ENDPOINT: suitable for low-volume wedding RSVP. It is not spam-proof.
 */
const SHEET_NAME = 'RSVP';
const HEADERS = ['Timestamp','Nama Lengkap','Kehadiran','Jumlah Tamu','Ucapan & Doa'];

function sheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Apps Script must be bound to a Google Spreadsheet.');
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.getRange('A:E').setWrap(true);
  }
  return sheet;
}

function sanitize_(value, maxLength) {
  let s = String(value == null ? '' : value).trim().slice(0,maxLength);
  s = s.replace(/[\u0000-\u001f\u007f]/g, ' ');
  // Prevent spreadsheet formula injection.
  if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return json_({ok:false,error:'Rejected'});
    const name = sanitize_(p.name,100);
    const attendance = String(p.attendance||'');
    const guests = Number(p.guests);
    const message = sanitize_(p.message,1000);
    if (!name || !message || !['Hadir','Tidak Hadir'].includes(attendance))
      return json_({ok:false,error:'Invalid form'});
    if (!Number.isInteger(guests) || guests < 0 || guests > 5 || (attendance==='Tidak Hadir' && guests!==0) || (attendance==='Hadir' && guests<1))
      return json_({ok:false,error:'Invalid guest count'});
    const lock=LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      sheet_().appendRow([new Date(),name,attendance,guests,message]);
      SpreadsheetApp.flush();
    } finally { lock.releaseLock(); }
    return json_({ok:true});
  } catch(err) { console.error(err);return json_({ok:false,error:'Server error'}); }
}

function doGet(e) {
  const p=(e&&e.parameter)||{};
  if (p.action!=='wishes') return json_({ok:true,service:'Rachma & Nateq RSVP API'});
  try {
    const sheet=sheet_(),last=sheet.getLastRow();
    const start=Math.max(2,last-99);
    const values=last<2?[]:sheet.getRange(start,1,last-start+1,5).getValues();
    const wishes=values.reverse().filter(r=>r[4]).map(r=>({
      name:String(r[1]).slice(0,100),message:String(r[4]).slice(0,1000),
      date:r[0] instanceof Date?Utilities.formatDate(r[0],'Asia/Jakarta','dd MMM yyyy, HH:mm'):''
    }));
    return json_({ok:true,wishes:wishes},p.callback);
  } catch(err) { console.error(err);return json_({ok:false,error:'Server error'},p.callback); }
}

function json_(obj, callback) {
  const payload=JSON.stringify(obj);
  // Strictly whitelist callback identifiers to prevent script injection.
  if (callback && /^[A-Za-z_$][\w$]{0,80}$/.test(callback))
    return ContentService.createTextOutput(callback+'('+payload+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}
