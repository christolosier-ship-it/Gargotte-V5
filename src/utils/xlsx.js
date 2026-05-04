
import {readZip, makeZip, toBytes, fromBytes} from './zip.js';

const XML_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';

export function xmlEscape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
export function xmlUnescape(s) {
  return String(s ?? '')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}
export function colToIndex(col) {
  let n = 0;
  for (const ch of col.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}
export function indexToCol(idx) {
  let n = idx + 1;
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
function getAttr(str, name) {
  const m = new RegExp(`${name}="([^"]*)"`).exec(str);
  return m ? m[1] : '';
}
function parseSharedStrings(xml) {
  if (!xml) return [];
  const out = [];
  const re = /<si\b[\s\S]*?<\/si>/g;
  let m;
  while ((m = re.exec(xml))) {
    const block = m[0];
    const texts = [];
    const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let tm;
    while ((tm = tRe.exec(block))) texts.push(xmlUnescape(tm[1]));
    out.push(texts.join(''));
  }
  return out;
}
function parseSheetXml(xml, sharedStrings = []) {
  const rows = [];
  const rowRe = /<row\b[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(xml))) {
    const rowIndex = Number(rm[1]) - 1;
    const inner = rm[2];
    const cells = [];
    const cellRe = /<c\b([^>]*)>([\s\S]*?)<\/c>/g;
    let cm;
    let maxCol = -1;
    while ((cm = cellRe.exec(inner))) {
      const attrs = cm[1];
      const cellXml = cm[2];
      const ref = getAttr(attrs, 'r');
      const col = ref ? colToIndex(ref.match(/^[A-Z]+/i)?.[0] || 'A') : cells.length;
      maxCol = Math.max(maxCol, col);
      let val = '';
      const type = getAttr(attrs, 't');
      if (type === 'inlineStr') {
        const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
        const parts = [];
        let tm;
        while ((tm = tRe.exec(cellXml))) parts.push(xmlUnescape(tm[1]));
        val = parts.join('');
      } else if (type === 's') {
        const v = /<v>([\s\S]*?)<\/v>/.exec(cellXml)?.[1];
        val = sharedStrings[Number(v)] ?? '';
      } else if (type === 'str') {
        val = xmlUnescape(/<v>([\s\S]*?)<\/v>/.exec(cellXml)?.[1] ?? '');
      } else if (type === 'b') {
        val = /<v>1<\/v>/.test(cellXml) ? true : false;
      } else {
        const v = /<v>([\s\S]*?)<\/v>/.exec(cellXml)?.[1];
        if (v === undefined || v === null || v === '') val = '';
        else if (/^-?\d+(\.\d+)?$/.test(v)) val = Number(v);
        else val = xmlUnescape(v);
      }
      cells[col] = val;
    }
    rows[rowIndex] = cells;
  }
  return rows.map(r => r ?? []);
}
function sheetXmlFromRows(sheetName, headers, rows) {
  const allRows = [headers, ...rows.map(r => Array.isArray(r) ? r : headers.map(h => r[h]))];
  const maxCol = headers.length;
  const dim = `A1:${indexToCol(maxCol - 1)}${allRows.length}`;
  const rowXml = allRows.map((row, idx) => {
    const cells = row.map((value, cIdx) => {
      const ref = `${indexToCol(cIdx)}${idx + 1}`;
      if (value === null || value === undefined) value = '';
      if (typeof value === 'number' && Number.isFinite(value)) {
        return `<c r="${ref}"><v>${String(value)}</v></c>`;
      }
      if (typeof value === 'boolean') {
        return `<c r="${ref}" t="b"><v>${value ? 1 : 0}</v></c>`;
      }
      const text = String(value);
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`;
    }).join('');
    return `<row r="${idx + 1}">${cells}</row>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="${XML_NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<dimension ref="${dim}"/><sheetViews><sheetView workbookViewId="0"/></sheetViews>` +
    `<sheetData>${rowXml}</sheetData></worksheet>`;
}
function workbookXml(sheetName) {
  return workbookXmlMulti([{ sheetName }]);
}
function workbookXmlMulti(sheets) {
  const xmlSheets = sheets.map((sheet, idx) => `<sheet name="${xmlEscape(sheet.sheetName || sheet.name || `Sheet${idx + 1}`)}" sheetId="${idx + 1}" r:id="rId${idx + 1}"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<workbook xmlns="${XML_NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheets>${xmlSheets}</sheets></workbook>`;
}
function workbookRelsXml() {
  return workbookRelsXmlMulti([{ }]);
}
function workbookRelsXmlMulti(sheets) {
  const rels = sheets.map((_, idx) => `<Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${idx + 1}.xml"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}</Relationships>`;
}
function rootRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
    `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>` +
    `<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>` +
    `</Relationships>`;
}
function contentTypesXml() {
  return contentTypesXmlMulti([{ }]);
}
function contentTypesXmlMulti(sheets) {
  const overrides = sheets.map((_, idx) => `<Override PartName="/xl/worksheets/sheet${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `${overrides}` +
    `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>` +
    `<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>` +
    `</Types>`;
}
function appXml(sheetNames) {
  const list = Array.isArray(sheetNames) ? sheetNames : [sheetNames];
  const parts = list.map(name => `<vt:lpstr>${xmlEscape(name || 'Sheet1')}</vt:lpstr>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">` +
    `<Application>Gargottex</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop>` +
    `<HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>${list.length}</vt:i4></vt:variant></vt:vector></HeadingPairs>` +
    `<TitlesOfParts><vt:vector size="${list.length}" baseType="lpstr">${parts}</vt:vector></TitlesOfParts>` +
    `</Properties>`;
}
function coreXml() {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ` +
    `xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ` +
    `xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
    `<dc:creator>Gargottex</dc:creator><cp:lastModifiedBy>Gargottex</cp:lastModifiedBy>` +
    `<dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>` +
    `</cp:coreProperties>`;
}
export function buildXlsxBlob(sheetName, headers, rows) {
  return buildXlsxWorkbookBlob([{ sheetName, headers, rows }]);
}

export function buildXlsxWorkbookBlob(sheets) {
  const files = [
    {name: '[Content_Types].xml', data: toBytes(contentTypesXmlMulti(sheets))},
    {name: '_rels/.rels', data: toBytes(rootRelsXml())},
    {name: 'docProps/app.xml', data: toBytes(appXml(sheets.map(s => s.sheetName || s.name || 'Sheet1'))) },
    {name: 'docProps/core.xml', data: toBytes(coreXml())},
    {name: 'xl/workbook.xml', data: toBytes(workbookXmlMulti(sheets))},
    {name: 'xl/_rels/workbook.xml.rels', data: toBytes(workbookRelsXmlMulti(sheets))},
  ];
  sheets.forEach((sheet, idx) => {
    files.push({ name: `xl/worksheets/sheet${idx + 1}.xml`, data: toBytes(sheetXmlFromRows(sheet.sheetName || sheet.name || `Sheet${idx + 1}`, sheet.headers, sheet.rows)) });
  });
  return new Blob([makeZip(files)], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
export async function readXlsxFile(fileOrBuffer) {
  const ab = fileOrBuffer instanceof ArrayBuffer ? fileOrBuffer : await fileOrBuffer.arrayBuffer();
  const files = await readZip(ab);
  const fileNames = Object.keys(files);
  const shared = files['xl/sharedStrings.xml'] ? parseSharedStrings(fromBytes(files['xl/sharedStrings.xml'])) : [];
  const wsPaths = fileNames.filter(n => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort((a, b) => {
    const na = Number(a.match(/sheet(\d+)\.xml$/)?.[1] || 0);
    const nb = Number(b.match(/sheet(\d+)\.xml$/)?.[1] || 0);
    return na - nb;
  });
  if (!wsPaths.length) throw new Error('Aucune feuille trouvée');

  const wbXml = files['xl/workbook.xml'] ? fromBytes(files['xl/workbook.xml']) : '';
  const nameMatches = [...wbXml.matchAll(/<sheet\b[^>]*name="([^"]+)"[^>]*r:id="rId(\d+)"/g)]
    .sort((a, b) => Number(a[2]) - Number(b[2]))
    .map(m => m[1]);
  const sheets = wsPaths.map((wsPath, idx) => {
    const sheetName = nameMatches[idx] || `Sheet${idx + 1}`;
    const sheetXml = fromBytes(files[wsPath]);
    const rows = parseSheetXml(sheetXml, shared);
    const headers = (rows[0] || []).map(v => String(v ?? '').trim());
    const data = rows.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = r[i] ?? '');
      return obj;
    }).filter(obj => Object.values(obj).some(v => String(v ?? '').trim() !== ''));
    return { sheetName, headers, rows: data, sheetXml, sheetPath: wsPath };
  });

  const first = sheets[0];
  return { headers: first.headers, rows: first.rows, sheetName: first.sheetName, sheets, sharedStrings: shared, sheetPath: first.sheetPath, files };
}
export function parseCsv(text) {
  const rows = [];
  let cur = '', row = [], inQ = false;
  const push = () => { row.push(cur); cur = ''; };
  const end = () => { rows.push(row); row = []; };
  for (let i=0;i<text.length;i++){
    const ch = text[i], next = text[i+1];
    if (inQ){
      if (ch === '"' && next === '"'){ cur += '"'; i++; }
      else if (ch === '"'){ inQ = false; }
      else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ';' || ch === ',') push();
      else if (ch === '\n'){ push(); end(); }
      else if (ch === '\r') {}
      else cur += ch;
    }
  }
  if (cur.length || row.length) { push(); end(); }
  if (!rows.length) return [];
  const headers = rows.shift().map(h => String(h ?? '').trim());
  return rows.filter(r => r.some(v => String(v ?? '').trim())).map(r => {
    const obj = {};
    headers.forEach((h,i)=>obj[h]=r[i] ?? '');
    return obj;
  });
}
export function buildCsv(headers, rows) {
  const esc = v => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
  };
  return [headers, ...rows.map(row => headers.map(h => row[h] ?? ''))].map(r => r.map(esc).join(';')).join('\n');
}
