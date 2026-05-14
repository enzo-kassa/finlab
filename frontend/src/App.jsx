import { useState } from "react";
import TelaComparativo   from "./components/TelaComparativo";
import TelaInvestimentos from "./components/TelaInvestimentos";
import "./styles/global.css";

export default function App() {
  const [tela, setTela] = useState("comparativo");

  return (
    <div className="calc-root">
      <div className="grid-bg" />

      <nav className="nav">
        <div className="nav-brand">FINLAB</div>
        <div className="nav-tabs">
          <button
            className={`nav-tab${tela === "comparativo" ? " active" : ""}`}
            onClick={() => setTela("comparativo")}
          >
            À VISTA / PARCELADO
          </button>
          <button
            className={`nav-tab${tela === "investimentos" ? " active" : ""}`}
            onClick={() => setTela("investimentos")}
          >
            SIMULADOR DE INVESTIMENTOS
          </button>
        </div>
      </nav>

      <div className="container">
        {tela === "comparativo"   && <TelaComparativo />}
        {tela === "investimentos" && <TelaInvestimentos />}

        <p className="footer-note">
          PROJETO ACADÊMICO · FINS EDUCACIONAIS · NÃO CONSTITUI RECOMENDAÇÃO DE INVESTIMENTO
        </p>
      </div>
    </div>
  );
}
