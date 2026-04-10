// ============================================================
// CLÍNICA SEMEAR — cs-ui.js
// ============================================================

window.CS_UI = {

    renderizar(forcarNovo = false) {
        const root = document.getElementById('cs-root');
        if (!root) return;

        const cache = forcarNovo ? null : window.CS_Data.carregar();
        const hoje  = new Date().toISOString().slice(0, 10);
        const cl    = window.CS_Data.CLINICA;

        root.innerHTML = `
<div class="cs-module">

    <!-- TOPBAR -->
    <div class="cs-topbar">
        <div class="cs-topbar-brand">
            <img src="logo.svg" class="cs-topbar-logo" alt="Clínica Semear"
                 onerror="this.style.display='none'">
            <div class="cs-topbar-divider"></div>
            <span class="cs-topbar-label">Autorização de Uso de Imagem</span>
        </div>
        <div class="cs-topbar-actions">
            <button id="cs-btn-salvar" class="cs-btn cs-btn-outline">
                <i class="ph ph-floppy-disk"></i><span>Salvar</span>
            </button>
            <button id="cs-btn-imprimir" class="cs-btn cs-btn-primary">
                <i class="ph ph-printer"></i><span>Imprimir / PDF</span>
            </button>
            <button id="cs-btn-novo" class="cs-btn cs-btn-ghost">
                <i class="ph ph-trash"></i><span>Novo</span>
            </button>
        </div>
    </div>

    <div class="cs-layout">

        ${cache ? `<div class="cs-cache-banner"><i class="ph ph-clock-clockwise"></i>&nbsp; Rascunho de ${window.CS_Data.formatarDataSalvo(cache._salvoEm)} recuperado automaticamente.</div>` : ''}

        <!-- 1. RESPONSÁVEL LEGAL -->
        <div class="cs-card">
            <div class="cs-card-header">
                <div class="cs-card-header-left">
                    <i class="ph ph-user"></i>
                    <h2>Dados do Responsável Legal</h2>
                </div>
            </div>
            <div class="cs-card-body">
                <div class="cs-info-box">
                    <i class="ph ph-info"></i>
                    <span>Preencha o CEP para preenchimento automático do endereço. Campos em branco serão deixados como linha para preenchimento manual no documento.</span>
                </div>

                <div class="cs-grid cs-grid-2">
                    <div class="cs-field cs-span-2">
                        <label class="cs-label">Nome Completo</label>
                        <input type="text" id="cs-resp-nome" class="cs-input"
                            placeholder="Nome completo do responsável legal"
                            value="${this._esc(cache?.respNome || '')}">
                    </div>
                </div>

                <div class="cs-grid cs-grid-3">
                    <div class="cs-field">
                        <label class="cs-label">CPF</label>
                        <input type="text" id="cs-resp-cpf" class="cs-input"
                            placeholder="000.000.000-00"
                            value="${this._esc(cache?.respCPF || '')}" maxlength="14" inputmode="numeric">
                    </div>
                    <div class="cs-field">
                        <label class="cs-label">RG <span class="cs-label-opt">(opcional)</span></label>
                        <input type="text" id="cs-resp-rg" class="cs-input"
                            placeholder="00.000.000-0"
                            value="${this._esc(cache?.respRG || '')}">
                    </div>
                    <div class="cs-field">
                        <label class="cs-label">Relação com o Menor</label>
                        <select id="cs-resp-relacao" class="cs-select">
                            <option value="">Selecione...</option>
                            <option value="Pai" ${cache?.respRelacao==='Pai'?'selected':''}>Pai</option>
                            <option value="Mãe" ${cache?.respRelacao==='Mãe'?'selected':''}>Mãe</option>
                            <option value="Responsável legal" ${cache?.respRelacao==='Responsável legal'?'selected':''}>Responsável legal</option>
                            <option value="Tutor(a)" ${cache?.respRelacao==='Tutor(a)'?'selected':''}>Tutor(a)</option>
                            <option value="Guardião(ã)" ${cache?.respRelacao==='Guardião(ã)'?'selected':''}>Guardião(ã)</option>
                        </select>
                    </div>
                </div>

                <div class="cs-grid cs-grid-3">
                    <div class="cs-field">
                        <label class="cs-label">Nacionalidade <span class="cs-label-opt">(opcional)</span></label>
                        <input type="text" id="cs-resp-nacionalidade" class="cs-input"
                            placeholder="Ex: brasileira"
                            value="${this._esc(cache?.respNacionalidade || 'brasileira')}">
                    </div>
                    <div class="cs-field">
                        <label class="cs-label">Estado Civil <span class="cs-label-opt">(opcional)</span></label>
                        <select id="cs-resp-estado-civil" class="cs-select">
                            <option value="">Selecione...</option>
                            <option value="solteiro(a)" ${cache?.respEstadoCivil==='solteiro(a)'?'selected':''}>Solteiro(a)</option>
                            <option value="casado(a)" ${cache?.respEstadoCivil==='casado(a)'?'selected':''}>Casado(a)</option>
                            <option value="divorciado(a)" ${cache?.respEstadoCivil==='divorciado(a)'?'selected':''}>Divorciado(a)</option>
                            <option value="viúvo(a)" ${cache?.respEstadoCivil==='viúvo(a)'?'selected':''}>Viúvo(a)</option>
                            <option value="união estável" ${cache?.respEstadoCivil==='união estável'?'selected':''}>União Estável</option>
                        </select>
                    </div>
                    <div class="cs-field">
                        <label class="cs-label">Profissão <span class="cs-label-opt">(opcional)</span></label>
                        <input type="text" id="cs-resp-profissao" class="cs-input"
                            placeholder="Ex: professora"
                            value="${this._esc(cache?.respProfissao || '')}">
                    </div>
                </div>

                <div class="cs-grid cs-grid-3">
                    <div class="cs-field">
                        <label class="cs-label">CEP</label>
                        <div class="cs-input-addon">
                            <input type="text" id="cs-resp-cep" class="cs-input"
                                placeholder="00000-000"
                                value="${this._esc(cache?.respCEP || '')}" maxlength="9" inputmode="numeric">
                            <button class="cs-addon-btn" id="cs-btn-cep">
                                <span id="cs-cep-spin" class="cs-spinner hidden"></span>
                                <i id="cs-cep-icon" class="ph ph-map-pin"></i>
                            </button>
                        </div>
                    </div>
                    <div class="cs-field cs-span-2">
                        <label class="cs-label">Endereço</label>
                        <input type="text" id="cs-resp-endereco" class="cs-input"
                            placeholder="Rua, número, complemento, bairro"
                            value="${this._esc(cache?.respEndereco || '')}">
                    </div>
                </div>

                <div class="cs-grid cs-grid-3">
                    <div class="cs-field cs-span-2">
                        <label class="cs-label">Cidade / UF</label>
                        <input type="text" id="cs-resp-cidade" class="cs-input"
                            placeholder="Ex: Feira de Santana - BA"
                            value="${this._esc(cache?.respCidade || '')}">
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. MENOR -->
        <div class="cs-card">
            <div class="cs-card-header">
                <div class="cs-card-header-left">
                    <i class="ph ph-baby"></i>
                    <h2>Dados do Menor</h2>
                </div>
            </div>
            <div class="cs-card-body">
                <div class="cs-grid cs-grid-2">
                    <div class="cs-field cs-span-2">
                        <label class="cs-label">Nome Completo do Menor</label>
                        <input type="text" id="cs-menor-nome" class="cs-input"
                            placeholder="Nome completo da criança / adolescente"
                            value="${this._esc(cache?.menorNome || '')}">
                    </div>
                </div>
                <div class="cs-grid cs-grid-3">
                    <div class="cs-field">
                        <label class="cs-label">Data de Nascimento <span class="cs-label-opt">(opcional)</span></label>
                        <input type="date" id="cs-menor-nasc" class="cs-input"
                            value="${this._esc(cache?.menorDatNasc || '')}">
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. CLÁUSULAS (somente visualização) -->
        <div class="cs-card">
            <div class="cs-card-header">
                <div class="cs-card-header-left">
                    <i class="ph ph-article"></i>
                    <h2>Cláusulas Contratuais</h2>
                </div>
            </div>
            <div class="cs-card-body">
                <div class="cs-info-box">
                    <i class="ph ph-lock-simple"></i>
                    <span>As cláusulas são fixas e aplicadas automaticamente ao documento.</span>
                </div>
                <div class="cs-clausulas-preview">
                    ${window.CS_Data.CLAUSULAS.map(c => `
                        <div class="cs-clausula-tag">
                            <i class="ph ph-check-circle"></i>
                            Cláusula ${c.num} — ${this._esc(c.titulo)}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- 4. ASSINATURA -->
        <div class="cs-card">
            <div class="cs-card-header">
                <div class="cs-card-header-left">
                    <i class="ph ph-pen-nib"></i>
                    <h2>Local e Data</h2>
                </div>
            </div>
            <div class="cs-card-body">
                <div class="cs-grid cs-grid-2">
                    <div class="cs-field">
                        <label class="cs-label">Local de Assinatura</label>
                        <input type="text" id="cs-local" class="cs-input"
                            placeholder="Ex: Feira de Santana"
                            value="${this._esc(cache?.localAssinatura || window.CS_Data.CLINICA.foro)}">
                    </div>
                    <div class="cs-field">
                        <label class="cs-label">Data de Assinatura</label>
                        <input type="date" id="cs-data" class="cs-input"
                            value="${this._esc(cache?.dataAssinatura || hoje)}">
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<div id="cs-notif" class="cs-notif">
    <i id="cs-notif-icon" class="ph ph-check-circle"></i>
    <span id="cs-notif-txt"></span>
</div>`;

        this._bindEventos();
    },

    // ── Busca CEP ─────────────────────────────────────────────
    async _buscarCEP() {
        const spin = document.getElementById('cs-cep-spin');
        const icon = document.getElementById('cs-cep-icon');
        if (spin) spin.classList.remove('hidden');
        if (icon) icon.style.display = 'none';
        try {
            this.notif('Consultando CEP...', 'info');
            const cep   = document.getElementById('cs-resp-cep')?.value || '';
            const dados = await window.CS_Data.buscarCEP(cep);
            const endEl = document.getElementById('cs-resp-endereco');
            if (dados.logradouro && endEl && !endEl.value.trim()) {
                endEl.value = [dados.logradouro, dados.bairro].filter(Boolean).join(', ');
            }
            this._setVal('cs-resp-cidade', dados.cidade);
            this._setVal('cs-resp-cep',    window.CS_Data.formatarCEP(dados.cep));
            this.notif('CEP localizado!', 'success');
        } catch (e) {
            this.notif(e.message || 'Erro ao consultar CEP', 'error');
        } finally {
            if (spin) spin.classList.add('hidden');
            if (icon) icon.style.display = '';
        }
    },

    // ── Máscaras ─────────────────────────────────────────────
    _bindMascaraCPF(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', (e) => {
            e.target.value = window.CS_Data.formatarCPF(e.target.value);
        });
    },

    _bindMascaraCEP(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g,'').slice(0,8);
            v = v.replace(/(\d{5})(\d)/,'$1-$2');
            e.target.value = v;
        });
    },

    // ── Notificação ───────────────────────────────────────────
    notif(txt, tipo = 'success') {
        const el   = document.getElementById('cs-notif');
        const icon = document.getElementById('cs-notif-icon');
        const span = document.getElementById('cs-notif-txt');
        if (!el || !span) return;
        const icons = { success:'ph-check-circle', error:'ph-x-circle', warning:'ph-warning', info:'ph-info' };
        if (icon) icon.className = `ph ${icons[tipo] || 'ph-info'}`;
        el.className = `cs-notif ${tipo}`;
        span.textContent = txt;
        el.classList.add('visible');
        clearTimeout(this._notifTimer);
        this._notifTimer = setTimeout(() => el.classList.remove('visible'), 3500);
    },

    // ── Bind de eventos ───────────────────────────────────────
    _bindEventos() {
        document.getElementById('cs-btn-salvar')?.addEventListener('click',   () => window.CS_Actions.salvar());
        document.getElementById('cs-btn-imprimir')?.addEventListener('click', () => window.CS_Actions.imprimir());
        document.getElementById('cs-btn-novo')?.addEventListener('click',     () => window.CS_Actions.novo());

        this._bindMascaraCPF('cs-resp-cpf');
        this._bindMascaraCEP('cs-resp-cep');

        document.getElementById('cs-btn-cep')?.addEventListener('click', () => this._buscarCEP());
        document.getElementById('cs-resp-cep')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); this._buscarCEP(); }
        });
    },

    // ── Helpers ───────────────────────────────────────────────
    _setVal(id, val) { const el = document.getElementById(id); if (el && val) el.value = val; },
    _esc(s) {
        if (!s) return '';
        return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
};