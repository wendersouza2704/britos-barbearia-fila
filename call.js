let state = global.state || {
  queues: { breno: [] },
  stats: { atendidos: 0 }
};

global.state = state;

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ ok: false });
  }

  const { barber, index } = req.body;

  if (barber !== "breno") {
    return res.status(400).json({ ok: false });
  }

  const cliente = state.queues.breno[index];

  if (!cliente) {
    return res.status(200).json({ ok: false });
  }

  // Remove da fila
  state.queues.breno.splice(index, 1);

  // Conta como atendido
  state.stats.atendidos++;

  // Retorna cliente para o painel enviar WhatsApp
  return res.status(200).json({
    ok: true,
    cliente
  });
}
