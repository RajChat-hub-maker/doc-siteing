/* editor.js */

async function saveDoc() {
  const content = document.getElementById('editor').value;
  const res = await fetch('https://your-backend.onrender.com/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  alert(await res.text());
}

async function loadDoc() {
  const res = await fetch('https://your-backend.onrender.com/load');
  const data = await res.json();
  document.getElementById('editor').value = data.content || '';
}

function downloadPDF() {
  const content = document.getElementById('editor').value;
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

