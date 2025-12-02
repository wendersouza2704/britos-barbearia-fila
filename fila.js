let state = {
  queues: { breno: [], qualquer: [] }, // mantemos 'qualquer' como reserva (não usado no front)
  stats: { atendidos: 0 }
};

export default function handler(req, res) {
  const now = Date.now();

  // POST -> adicionar cliente
  if (req.method === 'POST' && req.url && req.url.includes('/api/fila')) {
    const { nome, telefone, barber } = req.body;
    const FIX_MIN = 45; // tempo fixo por cliente em minutos
    const cliente = { nome, telefone, barber: barber || 'breno', ts: now, avg: FIX_MIN };

    // normalize barber key (só breno por agora)
    const b = (cliente.barber && cliente.barber.toLowerCase() === 'breno') ? 'breno' : 'qualquer';
    if (!state.queues[b]) state.queues[b] = [];
    state.queues[b].push(cliente);

    const posIndex = state.queues[b].length - 1;
    const tempo = (posIndex) * FIX_MIN; // minutos até ser atendido
    res.status(200).json({ ok: true, posicao: posIndex + 1, posicao_index: posIndex, tempo });
    return;
  }

  // GET -> listar filas e stats
  if (req.method === 'GET' && req.url && req.url.includes('/api/fila')) {
    res.status(200).json({ queues: state.queues, stats: state.stats });
    return;
  }

  // DELETE -> remover por index/filas
  if (req.method === 'DELETE' && req.url && req.url.includes('/api/fila')) {
    const q = req.query;
    const barber = q.barber || 'qualquer';
    const idx = parseInt(q.index);
    if (!isNaN(idx) && state.queues[barber] && state.queues[barber][idx]) {
      state.queues[barber].splice(idx, 1);
      res.status(200).json({ ok: true });
      return;
    }
    res.status(400).json({ ok: false });
    return;
  }

  // chamar cliente (remover e retornar)
  if (req.method === 'POST' && req.url && req.url.includes('/api/call')) {
    const { barber, index } = req.body;
    const b = barber || 'qualquer';
    if (state.queues[b] && state.queues[b].length > 0 && state.queues[b][index]) {
      const cliente = state.queues[b].splice(index, 1)[0];
      state.stats.atendidos = (state.stats.atendidos || 0) + 1;
      res.status(200).json({ ok: true, cliente, stats: state.stats });
      return;
    }
    res.status(400).json({ ok: false });
    return;
  }

  res.status(200).json({ ok: true });
}
