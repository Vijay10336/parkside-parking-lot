async function call(path, options) {
  const response = await fetch(`/api/parking/${path}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const parkingApi = {
  availability: () => call('availability'),
  vehicles: () => call('vehicles'),
  enter: plate => call('enter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plate }) }),
  exit: plate => call('exit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plate }) })
};
