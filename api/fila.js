};

export default function handler(req, res) {
  const now = Date.now();

  // POST -> adicionar cliente
  if (req.method === 'POST') {
    const { nome, telefone } = req.body;
    const FIX_MIN = 45;
    const b = 'breno';

    const cliente = { nome, telefone, barber: b, ts: now, avg: FIX_MIN };
    state.queues[b].push(cliente);

    const pos = state.queues[b].length - 1;

    // tempo certo: primeiro = 45, segundo = 90, terceiro 135...
    const tempo = (pos + 1) * FIX_MIN;

    res.status(200).json({
      ok: true,
      posicao: pos + 1,
      posicao_index: pos,
      tempo
    });
    return;
  }

  // GET -> listar
  if (req.method === 'GET') {
    res.status(200).json({ queues: state.queues, stats: state.stats });
    return;
  }

  // DELETE -> remover
  if (req.method === 'DELETE') {
    const idx = parseInt(req.query.index);
    const b = 'breno';

    if (!isNaN(idx)) {
      state.queues[b].splice(idx, 1);
      res.status(200).json({ ok: true });
      return;
    }
  }

  res.status(200).json({ ok: false });
}
