async function chamar(barber, index) {
  try {
    const res = await fetch('/api/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barber: barber,
        index: index
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erro do servidor:", data);
      alert("Erro ao chamar cliente");
      return;
    }

    // sucesso
    playSound();

    const tel = data.cliente.telefone;
    const msg = encodeURIComponent(
      `Olá ${data.cliente.nome}, sua vez chegou na Britos Barbearia. Pode vir agora!`
    );

    window.open(`https://wa.me/55${tel}?text=${msg}`, '_blank');

    setTimeout(() => carregar(), 500);

  } catch (err) {
    console.error("Erro na chamada:", err);
    alert("Erro ao chamar cliente");
  }
}
