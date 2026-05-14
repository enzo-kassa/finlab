import { useState } from "react";

// URL base da API NestJS — troque pela URL do seu backend em produção
const API_URL = "http://localhost:3000";

const ModalLead = ({ pendingResult, onSuccess, onSkip }) => {
  const [nome, setNome]       = useState("");
  const [email, setEmail]     = useState("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [erro, setErro]       = useState("");

  async function salvar() {
    setErro("");
    if (!nome.trim())                          return setErro("Informe seu nome.");
    if (!email.trim() || !email.includes("@")) return setErro("Informe um e-mail válido.");
    if (!consent)                              return setErro("Aceite receber propostas para continuar.");

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          openToPropose: consent,
          presentAmount:     pendingResult.saldoAtual,
          monthlyInvestment: pendingResult.aporteMensal,
          monthlyRate:       pendingResult.taxa,
          goals: pendingResult.goalResults.map((g) => ({
            type:         g.id === "carro" ? "car" : g.id === "casa" ? "house" : "other",
            label:        g.label,
            targetValue:  g.alvo,
            targetMonths: g.meses,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao salvar.");
      }

      setSaved(true);
      setTimeout(() => onSuccess(), 2000);
    } catch (e) {
      setErro(e.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {saved ? (
          <div className="modal-success">
            <div className="modal-success-icon">✅</div>
            <div className="modal-success-title">Dados salvos!</div>
            <div className="modal-success-sub">Abrindo seu resultado...</div>
          </div>
        ) : (
          <>
            <div className="modal-icon">📬</div>
            <div className="modal-title">Seu resultado está pronto</div>
            <div className="modal-sub">
              Deixe seu contato para receber propostas personalizadas de crédito e seguros
              — sem spam, só o que for relevante para você.
            </div>

            <div className="modal-field">
              <label>Seu nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como podemos te chamar?"
              />
            </div>

            <div className="modal-field">
              <label>E-mail</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div className="modal-consent" onClick={() => setConsent((v) => !v)}>
              <div className={`modal-consent-box${consent ? " on" : ""}`}>
                {consent ? "✓" : ""}
              </div>
              <div className="modal-consent-text">
                Aceito receber propostas de <span>seguros e crédito</span> baseadas
                nos meus objetivos financeiros.
              </div>
            </div>

            {erro && (
              <div className="error-box" style={{ marginBottom: 14 }}>⚠ {erro}</div>
            )}

            <button
              className="calc-btn blue-btn"
              onClick={salvar}
              disabled={saving}
            >
              {saving ? "SALVANDO..." : "VER MEU RESULTADO →"}
            </button>

            <button className="modal-skip" onClick={onSkip}>
              pular e ver resultado sem salvar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalLead;
