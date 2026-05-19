import { useState } from "react";
import Field from "./shared/Field";
import ResultRow from "./shared/ResultRow";
import ModalLead from "./ModalLead";

const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const fmtPctSimple = (v) => `${Number(v || 0).toFixed(2)}%`;

const PRESETS = [
  { label: "Poupança",  value: 0.5 },
  { label: "Selic/CDI", value: 0.9 },
  { label: "CDI+",      value: 1.1 },
];

export const GOALS_CONFIG = [
  { id: "carro",  label: "CARRO",  icon: "🚗", placeholder: "Valor do carro (R$)" },
  { id: "casa",   label: "CASA",   icon: "🏠", placeholder: "Valor do imóvel (R$)" },
  { id: "outros", label: "OUTROS", icon: "🎯", placeholder: "Valor do bem (R$)" },
];

const TelaInvestimentos = () => {
  const [saldoAtual,    setSaldoAtual]    = useState("");
  const [aporteMensal,  setAporteMensal]  = useState("");
  const [taxa,          setTaxa]          = useState(0.9);
  const [goals,         setGoals]         = useState({ carro: false, casa: false, outros: false });
  const [goalValues,    setGoalValues]    = useState({ carro: "", casa: "", outros: "" });
  const [resultado,     setResultado]     = useState(null);
  const [erro,          setErro]          = useState("");
  const [showModal,     setShowModal]     = useState(false);
  const [pendingResult, setPendingResult] = useState(null);

  const toggleGoal    = (id) => setGoals((g) => ({ ...g, [id]: !g[id] }));
  const setGoalValue  = (id, val) => setGoalValues((g) => ({ ...g, [id]: val }));

  function calcular() {
    setErro("");
    const s = parseFloat(saldoAtual) || 0;
    const a = parseFloat(aporteMensal);
    const t = taxa / 100;

    if (!a || a <= 0) return setErro("Informe o valor do aporte mensal.");

    const activeGoals = GOALS_CONFIG.filter((g) => goals[g.id]);
    if (activeGoals.length === 0) return setErro("Selecione ao menos um objetivo.");

    for (const g of activeGoals) {
      if (!goalValues[g.id] || parseFloat(goalValues[g.id]) <= 0)
        return setErro(`Informe o valor para o objetivo "${g.label}".`);
    }

    const goalResults = activeGoals.map((g) => {
      const alvo = parseFloat(goalValues[g.id]);
      let meses = 0, saldo = s;
      const MAX = 600;
      while (saldo < alvo && meses < MAX) { saldo = saldo * (1 + t) + a; meses++; }

      const atingido   = meses < MAX;
      const anos       = Math.floor(meses / 12);
      const mesesResto = meses % 12;
      const totalInvest = s + a * meses;
      const rendimento  = saldo - totalInvest;
      const pctProg     = Math.min(100, (s / alvo) * 100);

      return { ...g, alvo, meses, anos, mesesResto, atingido, saldoFinal: saldo, totalInvest, rendimento, pctProg };
    });

    const projecoes = [12, 24, 60, 120].map((n) => ({
      label: `${n / 12}a`,
      meses: n,
      valor: s * Math.pow(1 + t, n) + a * (Math.pow(1 + t, n) - 1) / t,
    }));

    setPendingResult({ goalResults, projecoes, aporteMensal: a, saldoAtual: s, taxa });
    setShowModal(true);
  }

  return (
    <>
      <div className="header">
        <div className="badge blue">PLANEJAMENTO FINANCEIRO</div>
        <h1 className="title">Simulador de <span className="blue">Investimentos</span></h1>
        <p className="subtitle">// projeção patrimonial por objetivos</p>
      </div>

      {/* Posição atual */}
      <div className="card blue-accent">
        <div className="card-title">01 — posição atual</div>
        <div className="field-grid">
<Field label="Saldo atual (R$)" tooltip="Quanto você já tem investido hoje" hint="Ex: poupança, CDB, Tesouro Direto" value={saldoAtual} onChange={setSaldoAtual} placeholder="ex: 10000.00" min="0" step="0.01" />          
<Field label="Aporte mensal (R$)" tooltip="Valor que você pretende investir todo mês" hint="Seja consistente para resultados precisos" value={aporteMensal} onChange={setAporteMensal} placeholder="ex: 500.00" min="0" step="0.01" />        </div>
        <div className="field" style={{ marginBottom: 12 }}>
          <label>Taxa de rendimento mensal</label>
          <div className="rate-presets">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                className={`rate-btn${taxa === p.value ? " active" : ""}`}
                onClick={() => setTaxa(p.value)}
              >
                {p.label}<strong>{p.value}% a.m.</strong>
              </button>
            ))}
          </div>
        </div>
        <Field label="Taxa mensal personalizada (%)" value={taxa} onChange={setTaxa} placeholder="0.90" min="0" step="0.01" />
      </div>

      {/* Objetivos */}
      <div className="card blue-accent">
        <div className="card-title">02 — objetivos de investimento</div>
        <div className="goals-grid">
          {GOALS_CONFIG.map((g) => (
            <div key={g.id} className={`goal-item${goals[g.id] ? " checked" : ""}`}>
              <div className="goal-header" onClick={() => toggleGoal(g.id)}>
                <div className="goal-checkbox">{goals[g.id] ? "✓" : ""}</div>
                <span className="goal-icon">{g.icon}</span>
                <span className="goal-label">{g.label}</span>
              </div>
              {goals[g.id] && (
                <div className="goal-input-area">
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Valor do objetivo</label>
                    <input
                      type="number"
                      value={goalValues[g.id]}
                      onChange={(e) => setGoalValue(g.id, e.target.value)}
                      placeholder={g.placeholder}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {erro && <div className="error-box">⚠ {erro}</div>}

      <button className="calc-btn blue-btn" onClick={calcular}>PROJETAR PATRIMÔNIO →</button>

      {/* Modal de captura de lead */}
      {showModal && pendingResult && (
        <ModalLead
          pendingResult={pendingResult}
          onSuccess={() => { setShowModal(false); setResultado(pendingResult); }}
          onSkip={() => { setShowModal(false); setResultado(pendingResult); }}
        />
      )}

      {/* Resultado */}
      {resultado && (
        <div style={{ marginTop: 24 }}>
          <div className="card blue-accent" style={{ marginTop: 0 }}>
            <div className="card-title">prazo por objetivo</div>
            {resultado.goalResults.map((g) => (
              <div key={g.id} className="goal-result-card">
                <div className="goal-result-header">
                  <div className="goal-result-name">
                    <span>{g.icon}</span>
                    <span>{g.label} — {fmt(g.alvo)}</span>
                  </div>
                  <div className={`goal-result-status ${g.atingido ? "reached" : "pending"}`}>
                    {g.atingido ? "ATINGÍVEL" : "+50 ANOS"}
                  </div>
                </div>

                {g.atingido && (
                  <>
                    <div className="goal-result-row">
                      <span>Prazo estimado</span>
                      <span>
                        {g.anos > 0 ? `${g.anos} ano${g.anos > 1 ? "s" : ""} ` : ""}
                        {g.mesesResto > 0 ? `${g.mesesResto} mês${g.mesesResto > 1 ? "es" : ""}` : ""}
                        {g.anos === 0 && g.mesesResto === 0 ? "< 1 mês" : ""}
                        {` (${g.meses} meses)`}
                      </span>
                    </div>
                    <div className="goal-result-row">
                      <span>Total investido</span>
                      <span>{fmt(g.totalInvest)}</span>
                    </div>
                    <div className="goal-result-row">
                      <span>Rendimento acumulado</span>
                      <span style={{ color: "#00d46e" }}>{fmt(g.rendimento)}</span>
                    </div>
                  </>
                )}

                <div className="progress-wrap">
                  <div className="progress-label">
                    <span>Saldo atual vs. objetivo</span>
                    <span style={{ color: "#60a5fa" }}>{fmtPctSimple(g.pctProg)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{
                      width: `${g.pctProg}%`,
                      background: g.pctProg >= 100 ? "#00d46e" : "linear-gradient(90deg, #3b82f6, #60a5fa)",
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card blue-accent">
            <div className="card-title">projeção patrimonial</div>
            <ResultRow label="Saldo atual"   value={fmt(resultado.saldoAtual)} />
            <ResultRow label="Aporte mensal" value={fmt(resultado.aporteMensal)} color="blue" />
            <ResultRow label="Taxa aplicada" value={`${resultado.taxa}% a.m.`} />
            <div className="section-divider">evolução estimada</div>
            {resultado.projecoes.map((p) => (
              <ResultRow key={p.meses} label={`Em ${p.label}`} value={fmt(p.valor)} color="green" large={p.meses === 120} />
            ))}
          </div>

          <button className="reset-btn" onClick={() => setResultado(null)}>↩ NOVA SIMULAÇÃO</button>
        </div>
      )}
    </>
  );
};

export default TelaInvestimentos;
