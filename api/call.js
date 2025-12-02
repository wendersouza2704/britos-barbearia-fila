export const config = {
  api: {
    bodyParser: true,
  },
};

let state = global.state || {
  queues: { breno: [] },
  stats: { atendidos: 0 }
};

global.state = state;

export default function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, erro: "Método inválido" });
    }

    const { barber, index } = req.body;

    if (!barber || index === undefined) {
      return res.status(400).json({ ok: false, erro: "Dados inválidos" });
    }

    if (!state.queues[barber]) {
      return res.status(400).json({ ok: false, erro: "Fila inexistente" });
    }

    const cliente = state.queues[barber][index];

    if (!cliente) {
      return res.status(404).json({ ok: false, erro: "Cliente não encontrado" });
    }

    state.queues[barber].splice(index, 1);
    state.stats.atendidos++;

    return res.status(200).json({ ok: true, cliente });

  } catch (err) {
    return res.status(500).json({ ok: false, erro: "Erro interno", detalhe: err.message });
  }
}
