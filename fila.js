let fila = [];

export default function handler(req, res) {
    if (req.method === "POST") {
        const cliente = req.body;
        fila.push(cliente);
        res.json({ posicao: fila.length - 1 });
    }

    else if (req.method === "GET") {
        res.json(fila);
    }

    else if (req.method === "DELETE") {
        const index = parseInt(req.query.index);
        fila.splice(index, 1);
        res.json({ ok: true });
    }
}
