// ============================================================
// CLÍNICA SEMEAR — cs-actions.js
// ============================================================

window.CS_Actions = {

    coletarDados() {
        const g = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
        return {
            // Responsável
            respNome:         g('cs-resp-nome'),
            respCPF:          g('cs-resp-cpf'),
            respRG:           g('cs-resp-rg'),
            respNacionalidade:g('cs-resp-nacionalidade'),
            respEstadoCivil:  g('cs-resp-estado-civil'),
            respProfissao:    g('cs-resp-profissao'),
            respCEP:          g('cs-resp-cep'),
            respEndereco:     g('cs-resp-endereco'),
            respCidade:       g('cs-resp-cidade'),
            respRelacao:      g('cs-resp-relacao'),
            // Menor
            menorNome:        g('cs-menor-nome'),
            menorDatNasc:     g('cs-menor-nasc'),
            // Assinatura
            localAssinatura:  g('cs-local'),
            dataAssinatura:   g('cs-data'),
        };
    },

    salvar() {
        const ok = window.CS_Data.salvar(this.coletarDados());
        window.CS_UI?.notif(ok ? 'Rascunho salvo!' : 'Erro ao salvar.', ok ? 'success' : 'error');
    },

    novo() {
        if (!confirm('Descartar o rascunho atual e iniciar nova autorização?')) return;
        window.CS_Data.apagar();
        window.CS_UI?.renderizar(true);
        window.CS_UI?.notif('Nova autorização iniciada.', 'success');
    },

    imprimir() {
        const dados  = this.coletarDados();
        const html   = this._gerarHTML(dados);
        const janela = window.open('', '_blank');
        if (!janela) { window.CS_UI?.notif('Permita pop-ups para gerar o documento.', 'warning'); return; }
        janela.document.write(html);
        janela.document.close();
        janela.onload = () => {
            setTimeout(() => {
                janela.focus();
                janela.print();
            }, 500);
        };
    },

    // ─────────────────────────────────────────────────────────
    // GERAR HTML DO DOCUMENTO
    // ─────────────────────────────────────────────────────────
    _gerarHTML(d) {
        const esc    = (s) => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const blank  = (s, fallback) => s ? esc(s) : `<span class="blank">${fallback || '_______________________'}</span>`;
        const fmtDt  = (s) => s ? window.CS_Data.formatarDataContrato(s) : null;
        const cl     = window.CS_Data.CLINICA;

        const dataAssina = fmtDt(d.dataAssinatura)
            ? fmtDt(d.dataAssinatura)
            : `<span class="blank">___ / ___ / ______</span>`;

        const local = d.localAssinatura || cl.foro;

        // Endereço completo do responsável
        const endResp = [d.respEndereco, d.respCidade, d.respCEP ? `CEP ${d.respCEP}` : '']
            .filter(Boolean).join(', ');

        // Menor — idade aproximada
        let menorIdade = '';
        if (d.menorDatNasc) {
            try {
                const nasc = new Date(d.menorDatNasc + 'T12:00:00');
                const hoje = new Date();
                let idade  = hoje.getFullYear() - nasc.getFullYear();
                const m    = hoje.getMonth() - nasc.getMonth();
                if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
                menorIdade = `${idade} anos`;
            } catch (_) {}
        }

        // Cláusulas
        const clausulasHTML = window.CS_Data.CLAUSULAS.map((c) => {
            const ordinal = ['1ª','2ª','3ª','4ª','5ª','6ª','7ª','8ª','9ª','10ª','11ª','12ª'][c.num - 1] || `${c.num}ª`;
            const texto   = esc(c.texto).replace('__FORO__', esc(d.localAssinatura || cl.foro));
            return `
            <div class="clausula">
                <div class="clausula-num">Cláusula ${ordinal} — ${esc(c.titulo)}</div>
                <p class="clausula-corpo">${texto}</p>
            </div>`;
        }).join('');

        const dataGer = new Date().toLocaleString('pt-BR', {
            day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
        });

        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Autorização de Uso de Imagem — Clínica Semear</title>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
    --blue:   #1A5EA8;
    --text:   #1c1c1c;
    --text-2: #444;
    --text-3: #888;
    --border: #d8d8d8;
}

html { height: 100%; }

body {
    font-family: 'EB Garamond', Georgia, serif;
    font-size: 10.5pt;
    line-height: 1.7;
    color: var(--text);
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    height: 100%;
}

.doc-table {
    width: 210mm;
    border-collapse: collapse;
    background: #fff;
    height: 100%;
}
.doc-table thead { display: table-header-group; }
.doc-table tfoot { display: table-footer-group; }
.doc-table tbody { display: table-row-group; height: 100%; }
.doc-table td    { padding: 0; }
.doc-table tbody td { height: 100%; vertical-align: top; }

/* ── CABEÇALHO — fundo branco ── */
.cab-fixo {
    width: 210mm;
    height: 20mm;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18mm;
    border-bottom: 2px solid var(--blue);
}

.cab-logo-img {
    height: 38px;
    width: auto;
    display: block;
}
.cab-brand-fallback {
    display: none;
    flex-direction: column;
    line-height: 1.2;
}
.cab-brand-nome {
    font-family: 'DM Sans', sans-serif;
    font-size: 11pt; font-weight: 600;
    color: var(--blue);
}
.cab-brand-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 6pt; color: var(--text-3);
    letter-spacing: 0.1em; text-transform: uppercase;
}
.cab-meta { text-align: right; }
.cab-meta-tipo {
    font-family: 'DM Sans', sans-serif;
    font-size: 7pt; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--blue);
}
.cab-meta-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 6pt; color: var(--text-3);
    margin-top: 1mm;
}

/* ── RODAPÉ ── */
.rodape-fixo {
    width: 210mm;
    height: 10mm;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18mm;
    font-family: 'DM Sans', sans-serif;
    font-size: 6pt;
    color: var(--text-3);
}

/* ── Página ── */
.pagina {
    width: 210mm;
    background: #fff;
    padding: 7mm 18mm 10mm;
    display: flex;
    flex-direction: column;
    min-height: calc(297mm - 20mm - 10mm);
}

/* ── TÍTULO ── */
.titulo {
    margin-bottom: 4mm;
    padding-bottom: 4mm;
    border-bottom: 1px solid var(--border);
}
.titulo h1 {
    font-family: 'EB Garamond', serif;
    font-size: 13pt; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--text);
}

/* ── Partes em linha corrida (compacto) ── */
.partes-bloco {
    margin-bottom: 4mm;
    font-size: 10pt;
    line-height: 1.65;
    color: var(--text-2);
    text-align: justify;
    hyphens: auto;
}
.partes-bloco strong { color: var(--text); font-weight: 600; }

.partes-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 6.5pt; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--blue); display: block;
    margin-bottom: 1mm; margin-top: 3mm;
}

.fecho {
    font-style: italic;
    color: var(--text-3);
    font-size: 9.5pt;
    margin: 3mm 0 3mm;
}

hr.divisor {
    border: none;
    border-top: 1px solid var(--border);
    margin: 3mm 0;
}

/* ── Cláusulas compactas em 2 colunas ── */
.clausulas-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 6mm;
}

.clausula {
    padding: 2.5mm 0;
    border-bottom: 1px solid #ebebeb;
    break-inside: avoid;
    page-break-inside: avoid;
}
.clausula:last-child { border-bottom: none; }

.clausula-num {
    font-family: 'DM Sans', sans-serif;
    font-size: 6pt; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--blue); margin-bottom: 0.5mm;
}
.clausula-corpo {
    text-align: justify;
    hyphens: auto;
    -webkit-hyphens: auto;
    line-height: 1.6;
    color: var(--text-2);
    font-size: 9.5pt;
}

/* ── Espaço em branco ── */
.blank {
    display: inline-block;
    min-width: 140px;
    border-bottom: 1.5px solid #888; padding-bottom: 1px;
    color: transparent;
    user-select: none;
}

/* ── Assinaturas ── */
.ass-section {
    margin-top: auto;
    padding-top: 5mm;
    page-break-inside: avoid;
    break-inside: avoid;
}
.ass-local {
    text-align: right;
    font-style: italic;
    color: var(--text-3);
    font-size: 9.5pt;
    margin-bottom: 7mm;
}
.ass-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12mm;
}
.ass-bloco { text-align: center; }
.ass-linha {
    border-top: 1px solid var(--text);
    margin: 12mm 8mm 3mm;
}
.ass-nome {
    font-family: 'EB Garamond', serif;
    font-size: 10pt; font-weight: 600;
    color: var(--text); line-height: 1.3;
}
.ass-qualif {
    font-family: 'DM Sans', sans-serif;
    font-size: 7pt; color: var(--text-3);
    margin-top: 1mm;
}
.ass-tipo {
    font-family: 'DM Sans', sans-serif;
    font-size: 6pt; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--blue); margin-top: 1.5mm;
}

@page { size: A4; margin: 0; }
@media print {
    body { background: #fff; }
    .clausula    { break-inside: avoid; page-break-inside: avoid; }
    .ass-section { break-inside: avoid; page-break-inside: avoid; }
}
@media screen {
    body { background: #c8cdd6; padding: 10mm 0; }
    .doc-table { margin: 0 auto; box-shadow: 0 6px 48px rgba(0,0,0,.18); margin-bottom: 10mm; }
}
</style>
</head>
<body>

<table class="doc-table" cellspacing="0" cellpadding="0">

  <!-- CABEÇALHO -->
  <thead><tr><td>
    <div class="cab-fixo">
      <div>
        <img class="cab-logo-img" src="logo.svg" alt="Clínica Semear"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="cab-brand-fallback">
          <span class="cab-brand-nome">Clínica Semear</span>
          <span class="cab-brand-sub">Desenvolvimento Neuropsicomotor</span>
        </div>
      </div>
      <div class="cab-meta">
        <div class="cab-meta-tipo">Autorização de Uso de Imagem</div>
        <div class="cab-meta-sub">Documento gerado em ${dataGer}</div>
      </div>
    </div>
  </td></tr></thead>

  <!-- RODAPÉ -->
  <tfoot><tr><td>
    <div class="rodape-fixo">
      <div>Clínica Semear &nbsp;·&nbsp; CNPJ ${esc(cl.cnpj)} &nbsp;·&nbsp; Desenvolvimento Neuropsicomotor e Integração Sensorial</div>
      <div>${dataGer}</div>
    </div>
  </td></tr></tfoot>

  <!-- CONTEÚDO -->
  <tbody><tr><td>
    <div class="pagina">

      <div class="titulo">
        <h1>Autorização de Uso de Imagem, Voz e Nome</h1>
      </div>

      <div class="partes-bloco">
        <span class="partes-label">Autorizante — Responsável Legal</span>
        <strong>${blank(d.respNome, 'Nome completo do responsável')}</strong>${d.respRelacao ? `, ${esc(d.respRelacao)} do(a) menor,` : ','} nacionalidade ${blank(d.respNacionalidade, 'nacionalidade')}, estado civil ${blank(d.respEstadoCivil, 'estado civil')}, profissão ${blank(d.respProfissao, 'profissão')}, CPF nº <strong>${blank(d.respCPF, '___.___.___ - __')}</strong>${d.respRG ? `, RG nº <strong>${esc(d.respRG)}</strong>` : ''}${endResp ? `, residente em <strong>${esc(endResp)}</strong>` : `, residente em ${blank('', 'endereço')}`};

        <span class="partes-label">Menor Autorizado(a)</span>
        <strong>${blank(d.menorNome, 'Nome completo do menor')}</strong>${menorIdade ? `, ${menorIdade}` : ''}${d.menorDatNasc ? `, nascido(a) em <strong>${fmtDt(d.menorDatNasc)}</strong>` : ''};

        <span class="partes-label">Autorizada</span>
        <strong>${esc(cl.fantasia)}</strong> (${esc(cl.razao)}), pessoa jurídica de direito privado, inscrita no CNPJ sob nº <strong>${esc(cl.cnpj)}</strong>, com sede na ${esc(cl.endereco)}, ${esc(cl.cidade)}, CEP ${esc(cl.cep)}, doravante denominada <strong>AUTORIZADA</strong>;
      </div>

      <p class="fecho">têm entre si justo e acordado o seguinte:</p>
      <hr class="divisor">

      <div class="clausulas-wrap">${clausulasHTML}</div>

      <div class="ass-section">
        <p class="ass-local">${esc(local)}, ${dataAssina}</p>
        <div class="ass-grid">
          <div class="ass-bloco">
            <div class="ass-linha"></div>
            <div class="ass-nome">${d.respNome ? esc(d.respNome) : blank('', 'Nome')}</div>
            ${d.respRelacao ? `<div class="ass-qualif">${esc(d.respRelacao)} do(a) menor</div>` : ''}
            ${d.respCPF ? `<div class="ass-qualif">CPF ${esc(d.respCPF)}</div>` : ''}
            <div class="ass-tipo">Autorizante — Responsável Legal</div>
          </div>
          <div class="ass-bloco">
            <div class="ass-linha"></div>
            <div class="ass-nome">${esc(cl.fantasia)}</div>
            <div class="ass-qualif">CNPJ ${esc(cl.cnpj)}</div>
            <div class="ass-tipo">Autorizada</div>
          </div>
        </div>
      </div>

    </div>
  </td></tr></tbody>

</table>
</body>
</html>`;
    }
};