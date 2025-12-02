let state = {
  queues: { joao: [], marcos: [], qualquer: [] },
  stats: { atendidos: 0 }
};

export default function handler(req, res) {
  const now = Date.now();
  if(req.method === 'POST' && req.url && req.url.includes('/api/fila')) {
    const { nome, telefone, barber, avg } = req.body;
    const cliente = { nome, telefone, barber: barber || 'qualquer', ts: now, avg: avg || 15 };
    const b = (cliente.barber === 'joao' || cliente.barber === 'marcos') ? cliente.barber : 'qualquer';
    state.queues[b].push(cliente);
    const pos = state.queues[b].length - 1;
    const tempo = pos * (cliente.avg || 15);
    res.status(200).json({ ok:true, posicao: pos+1, posicao_index: pos, tempo });
    return;
  }
  if(req.method === 'GET' && req.url && req.url.includes('/api/fila')) {
    res.status(200).json({ queues: state.queues, stats: state.stats });
    return;
  }
  if(req.method === 'DELETE' && req.url && req.url.includes('/api/fila')) {
    const q = req.query;
    const barber = q.barber || 'qualquer';
    const idx = parseInt(q.index);
    if(!isNaN(idx) && state.queues[barber] && state.queues[barber][idx]) {
      state.queues[barber].splice(idx,1);
      res.status(200).json({ ok:true });
      return;
    }
    res.status(400).json({ ok:false });
    return;
  }
  if(req.method === 'POST' && req.url && req.url.includes('/api/call')) {
    const { barber, index } = req.body;
    const b = barber || 'qualquer';
    if(state.queues[b] && state.queues[b].length > 0 && state.queues[b][index]) {
      const cliente = state.queues[b].splice(index,1)[0];
      state.stats.atendidos = (state.stats.atendidos || 0) + 1;
      res.status(200).json({ ok:true, cliente, stats: state.stats });
      return;
    }
    res.status(400).json({ ok:false });
    return;
  }
  res.status(200).json({ ok:true });
}
