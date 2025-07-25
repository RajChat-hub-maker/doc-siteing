// main.js

async function saveDoc() {
  const content = document.getElementById('editor').value;
  const res = await fetch('/api/docs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  const data = await res.json();
  alert(data.message || 'Saved');
}

async function loadDoc() {
  const res = await fetch('/api/docs');
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

