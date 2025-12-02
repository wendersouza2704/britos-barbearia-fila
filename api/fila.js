let state = {
  queues: { breno: [] },
  stats: { atendidos: 0 }
};

export default function handler(req, res) {
  const now = Date.now();

  if (req.method === 'POST') {
    const { nome, telefone } = req.body;
    const FIX_MIN = 45;
    const cliente = { nome, telefone, barber: 'breno', ts: now, avg: FIX_MIN };
    state.queues.breno.push(cliente);

    const pos = state.queues.breno.length - 1;
    const tempo = pos * FIX_MIN;
    res.status(200).json({ ok: true, posicao: pos + 1, posicao_index: pos, tempo });
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ queues: state.queues, stats: state.stats });
    return;
  }

  if (req.method === 'DELETE') {
    const idx = parseInt(req.query.index);
    if (!isNaN(idx)) {
      state.queues.breno.splice(idx, 1);
      res.status(200).json({ ok: true });
      return;
    }
  }

  res.status(200).json({ ok: false });
}
