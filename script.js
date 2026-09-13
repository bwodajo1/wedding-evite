const weddingDate = new Date('2026-11-22T05:00:00-05:00');

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;
  const ids = ['days', 'hours', 'minutes', 'seconds'];

  if (diff <= 0) {
    ids.forEach(id => document.getElementById(id).textContent = '0');
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

const calendarBtn = document.getElementById('calendarBtn');
calendarBtn.addEventListener('click', () => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Binyam and Hewan Wedding//EN',
    'BEGIN:VEVENT',
    'UID:binyam-hewan-wedding-20261122',
    'DTSTAMP:20260913T000000Z',
    'DTSTART:20261122T100000Z',
    'DTEND:20261122T180000Z',
    'SUMMARY:Binyam & Hewan Wedding',
    'LOCATION:4115 Muncaster Mill Rd\\, Rockville\\, MD 20853',
    'DESCRIPTION:Wedding ceremony 5:00–10:00 AM and reception 11:00 AM–1:00 PM.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'binyam-hewan-wedding.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

const form = document.getElementById('rsvpForm');
const status = document.getElementById('formStatus');
const guestFields = document.getElementById('guestFields');

form.querySelectorAll('input[name="attendance"]').forEach(input => {
  input.addEventListener('change', e => {
    const declining = e.target.value === 'Unable to attend';
    guestFields.style.display = declining ? 'none' : 'block';
  });
});

form.addEventListener('submit', (e) => {
  const isHosted = /netlify\.app$/.test(location.hostname) || document.body.dataset.forceNetlify === 'true';
  if (isHosted) return;

  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const saved = JSON.parse(localStorage.getItem('weddingRsvps') || '[]');
  saved.push({ ...data, submittedAt: new Date().toISOString() });
  localStorage.setItem('weddingRsvps', JSON.stringify(saved));

  form.reset();
  guestFields.style.display = 'block';
  status.textContent = 'Thank you — your RSVP has been saved on this device for this preview.';
  status.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
