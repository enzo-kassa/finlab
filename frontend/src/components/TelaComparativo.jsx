import { useState } from "react";
import Field from "./shared/Field";
import ResultRow from "./shared/ResultRow";

const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const fmtPct = (v) => `${Number(v || 0).toFixed(4)}%`;

const PRESETS = [
  { label: "Poupança",  value: 0.5 },
  { label: "Selic/CDI", value: 0.9 },
  { label: "CDI+",      value: 1.1 },
];

const TelaComparativo = () => {
  const [precoVista,    setPrecoVista]    = useState("");
  const [parcelas,      setParcelas]      = useState("");
  const [valorParcela,  setValorParcela]  = useState("");
  const [investir,      setInvestir]      = useState(true);
  const [taxa,          setTaxa]          = useState(0.9);
  const [diaCompra,     setDiaCompra]     = useState("");
  const [diaFechamento, setDiaFechamento] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [resultado,     setResultado]     = useState(null);
  const [erro,          setErro]          = useState("");

  function calcularCarencia() {
    if (!diaCompra || !diaFechamento || !diaVencimento) return 0;
    const dc = parseInt(diaCompra), df = parseInt(diaFechamento), dv = parseInt(diaVencimento);
    const dias = dc <= df ? (dv > df ? dv - dc : 30 - dc + dv) : dv + (30 - dc);
    return Math.max(0, dias);
  }

  function calcular() {
    setErro("");
    const pv = parseFloat(precoVista);
    const n  = parseInt(parcelas);
    const vp = parseFloat(valorParcela);
    const t  = taxa / 100;

    if (!pv || pv <= 0)         return setErro("Informe o preço à vista.");
    if (!n || n < 1 || n > 360) return setErro("Número de parcelas deve ser entre 1 e 360.");
    if (!vp || vp <= 0)         return setErro("Informe o valor de cada parcela.");

    const totalParcelado = n * vp;
    const desconto       = totalParcelado - pv;

    // Taxa de juros implícita (busca binária)
    let taxaImplicita = 0;
    if (totalParcelado > pv) {
      let lo = 0, hi = 1;
      for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        let soma = 0;
        for (let k = 1; k <= n; k++) soma += vp / Math.pow(1 + mid, k);
        soma > pv ? (lo = mid) : (hi = mid);
      }
      taxaImplicita = (lo + hi) / 2;
    }

    const carenciaDias  = calcularCarencia();
    const carenciaMeses = carenciaDias / 30;
    let rendimentoCarencia = 0, saldoFinal = 0;

    if (investir) {
      rendimentoCarencia = pv * (Math.pow(1 + t, carenciaMeses) - 1);
      let saldo = pv + rendimentoCarencia;
      for (let k = 1; k <= n; k++) saldo = saldo * (1 + t) - vp;
      saldoFinal = saldo;
    }

    const rendimentoTotal = investir ? saldoFinal + totalParcelado - pv : 0;
    const comparativo     = investir ? rendimentoTotal - desconto : -desconto;

    setResultado({
      totalParcelado, desconto,
      taxaImplicita: taxaImplicita * 100,
      taxaImplicitaAnual: (Math.pow(1 + taxaImplicita, 12) - 1) * 100,
      carenciaDias, rendimentoCarencia, rendimentoTotal, saldoFinal, comparativo,
      temJuros: totalParcelado > pv,
      saldoInsuficiente: investir && saldoFinal < 0,
    });
  }

  const bullish = resultado?.comparativo > 0;

  return (
    <>
      <div className="header">
        <div className="badge">SIMULADOR FINANCEIRO</div>
        <h1 className="title">À Vista ou <span className="green">Parcelado?</span></h1>
        <p className="subtitle">// análise comparativa de fluxo de caixa</p>
      </div>

      {/* Dados da compra */}
      <div className="card">
        <div className="card-title">01 — dados da compra</div>
        <div className="field-grid">
<Field label="Preço à Vista (R$)" tooltip="Valor total pago à vista, via Pix ou débito" value={precoVista} onChange={setPrecoVista} placeholder="ex: 1200.00" min="0" step="0.01" />
<Field label="Nº de Parcelas" tooltip="Suporta de 1 a 360 parcelas (até 30 anos)" value={parcelas} onChange={setParcelas} placeholder="ex: 12" min="1" max="360" step="1" />
        </div>
        <div className="field-full">
<Field label="Valor de cada Parcela (R$)" tooltip="Valor de uma única parcela do parcelamento" value={valorParcela} onChange={setValorParcela} placeholder="ex: 110.00" min="0" step="0.01" />        </div>
      </div>

      {/* Estratégia de capital */}
      <div className="card">
        <div className="card-title">02 — estratégia de capital</div>

        <div className="field" style={{ marginBottom: 16 }}>
          <label>Vai investir o valor à vista?</label>
          <div className="toggle-group">
            {[true, false].map((opt) => (
              <button
                key={String(opt)}
                className={`toggle-btn${investir === opt ? " active" : ""}`}
                onClick={() => setInvestir(opt)}
              >
                {opt ? "▲  SIM, VOU INVESTIR" : "▼  NÃO VOU INVESTIR"}
              </button>
            ))}
          </div>
        </div>

        {investir && (
          <>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Benchmark de rendimento</label>
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
          </>
        )}

        <details>
          <summary>▸ CICLO DO CARTÃO (OPCIONAL)</summary>
          <div className="field-grid-3">
            <Field label="Dia da Compra" value={diaCompra}      onChange={setDiaCompra}      placeholder="1-31" min="1" max="31" step="1" />
            <Field label="Fechamento"    value={diaFechamento}  onChange={setDiaFechamento}  placeholder="1-31" min="1" max="31" step="1" />
            <Field label="Vencimento"    value={diaVencimento}  onChange={setDiaVencimento}  placeholder="1-31" min="1" max="31" step="1" />
          </div>
        </details>
      </div>

      {erro && <div className="error-box">⚠ {erro}</div>}

      <button className="calc-btn" onClick={calcular}>EXECUTAR ANÁLISE →</button>

      {/* Resultado */}
      {resultado && (
        <div style={{ marginTop: 24 }}>
          <div className={`verdict ${bullish ? "bullish" : "bearish"}`}>
            <div className="verdict-icon">{bullish ? "📈" : "🏦"}</div>
            <div>
              <div className="verdict-label">resultado da análise</div>
              <div className="verdict-title">
                {bullish ? "Parcelado é mais vantajoso" : "À vista é mais vantajoso"}
              </div>
              <div className="verdict-sub">
                {bullish
                  ? `ganho líquido de ${fmt(Math.abs(resultado.comparativo))} investindo o capital`
                  : `economia de ${fmt(Math.abs(resultado.desconto))} no pagamento imediato`}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">resumo operacional</div>
            <ResultRow label="Preço à vista"                      value={fmt(parseFloat(precoVista))} />
            <ResultRow label="Total parcelado"                    value={fmt(resultado.totalParcelado)} />
            <ResultRow label="Diferença bruta (desconto à vista)" value={fmt(resultado.desconto)} color={resultado.desconto > 0 ? "green" : "red"} />

            {investir && (
              <>
                <ResultRow label="Carência (dias até 1ª parcela)" value={`${resultado.carenciaDias} dias`} />
                <ResultRow label="Rendimento na carência"         value={fmt(resultado.rendimentoCarencia)} color="green" />
                <ResultRow label="Rendimento total no período"    value={fmt(resultado.rendimentoTotal)} color={resultado.rendimentoTotal >= 0 ? "green" : "red"} large />
                {resultado.saldoInsuficiente && (
                  <div className="warn-box">
                    ⚠ O rendimento não cobre todas as parcelas — será necessário aportar capital adicional.
                  </div>
                )}
              </>
            )}

            <div className="section-divider">análise avançada</div>

            <ResultRow label="Juros no parcelamento?" value={resultado.temJuros ? "SIM" : "NÃO"} color={resultado.temJuros ? "red" : "green"} />
            {resultado.temJuros && (
              <>
                <ResultRow label="Taxa implícita (a.m.)" value={fmtPct(resultado.taxaImplicita)}      color="red" />
                <ResultRow label="Taxa implícita (a.a.)" value={fmtPct(resultado.taxaImplicitaAnual)} color="red" />
              </>
            )}
            {investir && (
              <ResultRow
                label="Saldo após quitação das parcelas"
                value={fmt(resultado.saldoFinal)}
                color={resultado.saldoFinal > 0 ? "green" : "red"}
              />
            )}
            <ResultRow
              label="Comparativo final"
              value={fmt(resultado.comparativo)}
              color={resultado.comparativo > 0 ? "green" : "blue"}
              large
            />

            <button className="reset-btn" onClick={() => setResultado(null)}>↩ NOVA SIMULAÇÃO</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TelaComparativo;
