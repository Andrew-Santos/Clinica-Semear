// ============================================================
// CLÍNICA SEMEAR — cs-data.js
// ============================================================

window.CS_Data = {

    CACHE_KEY: 'cs_autorizacao_rascunho',

    CLINICA: {
        nome:     'Clínica Semear',
        razao:    'CLINICA SEMEAR - DESENVOLVIMENTO NEUROPSICOMOTOR E INTEGRACAO SENSORIAL LTDA',
        fantasia: 'Clínica Semear',
        cnpj:     '49.957.694/0001-49',
        endereco: 'Alameda Ipê Branco, 121, Loja 1 e Loja 2, Santo Antônio dos Prazeres',
        cidade:   'Feira de Santana - BA',
        cep:      '44072-110',
        foro:     'Feira de Santana'
    },

    CLAUSULAS: [
        { num:1, titulo:'DO OBJETO', texto:'O(a) RESPONSÁVEL LEGAL autoriza a utilização da imagem, voz, nome e/ou depoimento do(a) menor sob sua responsabilidade, captados em fotos, vídeos, áudios ou qualquer outro meio, pela AUTORIZADA — Clínica Semear.' },
        { num:2, titulo:'DA FINALIDADE', texto:'A presente autorização tem como finalidade a utilização do material para fins institucionais, informativos, educativos e publicitários, sem qualquer fins lucrativos, podendo ser utilizado para divulgação de serviços da clínica, campanhas de conscientização, conteúdo educativo e informativo, materiais institucionais e redes sociais.' },
        { num:3, titulo:'DOS MEIOS DE VEICULAÇÃO', texto:'A utilização poderá ocorrer em quaisquer meios de comunicação, existentes ou que venham a ser criados, incluindo redes sociais (Instagram, Facebook, TikTok, YouTube, entre outros), site institucional, materiais impressos (folders, banners, cartazes), vídeos institucionais e apresentações em eventos.' },
        { num:4, titulo:'DO ÂMBITO TERRITORIAL', texto:'A presente autorização é válida em todo o território nacional e internacional.' },
        { num:5, titulo:'DO PRAZO', texto:'A autorização é concedida por prazo indeterminado.' },
        { num:6, titulo:'DA GRATUIDADE', texto:'A presente autorização é concedida de forma gratuita, não sendo devida qualquer remuneração, indenização ou compensação ao(à) RESPONSÁVEL LEGAL ou ao(à) menor.' },
        { num:7, titulo:'DA CESSÃO DE DIREITOS', texto:'O(a) RESPONSÁVEL LEGAL declara estar ciente de que a AUTORIZADA poderá editar, reproduzir e adaptar o material, utilizá-lo total ou parcialmente e integrá-lo a outras peças de comunicação, sempre respeitando a integridade, honra e dignidade do(a) menor.' },
        { num:8, titulo:'DA RESPONSABILIDADE', texto:'A AUTORIZADA compromete-se a utilizar o material de forma ética, respeitosa e dentro dos limites legais, não expondo o(a) menor a situações vexatórias, constrangedoras ou ilícitas.' },
        { num:9, titulo:'DA REVOGAÇÃO', texto:'O(a) RESPONSÁVEL LEGAL poderá revogar esta autorização mediante solicitação formal por escrito. A revogação não terá efeitos retroativos, permanecendo válidas as utilizações já realizadas e os materiais já produzidos ou publicados.' },
        { num:10, titulo:'DA PROTEÇÃO DE DADOS (LGPD)', texto:'As partes declaram estar cientes da aplicação da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD), comprometendo-se a tratar os dados pessoais de acordo com a legislação vigente.' },
        { num:11, titulo:'DISPOSIÇÕES GERAIS', texto:'Este instrumento não gera vínculo empregatício entre as partes, obriga as partes e seus sucessores e é celebrado em caráter irrevogável e irretratável, salvo nos termos da Cláusula 9.' },
        { num:12, titulo:'DO FORO', texto:'Fica eleito o foro da comarca de __FORO__, com renúncia de qualquer outro, por mais privilegiado que seja, para dirimir eventuais dúvidas oriundas deste contrato.' }
    ],

    async buscarCEP(cep) {
        const limpo = cep.replace(/\D/g, '');
        if (limpo.length !== 8) throw new Error('CEP deve ter 8 dígitos');
        const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
        if (!res.ok) throw new Error('Erro ao consultar CEP');
        const d = await res.json();
        if (d.erro) throw new Error('CEP não encontrado');
        return { logradouro: d.logradouro||'', bairro: d.bairro||'', cidade: d.localidade?`${d.localidade} - ${d.uf}`:'', cep: d.cep||'' };
    },

    formatarCEP(v) { return v.replace(/\D/g,'').replace(/(\d{5})(\d{3})/,'$1-$2'); },

    formatarCPF(v) {
        const l = v.replace(/\D/g,'').slice(0,11);
        return l.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d)/,'.$1-$2');
    },

    salvar(dados) {
        try { localStorage.setItem(this.CACHE_KEY, JSON.stringify({...dados, _salvoEm: new Date().toISOString()})); return true; }
        catch(e) { return false; }
    },

    carregar() {
        try { const r = localStorage.getItem(this.CACHE_KEY); return r ? JSON.parse(r) : null; }
        catch(e) { return null; }
    },

    apagar() { try { localStorage.removeItem(this.CACHE_KEY); return true; } catch(e) { return false; } },

    formatarDataContrato(iso) {
        if (!iso) return '';
        try {
            const d = new Date(iso+'T12:00:00');
            const m = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
            return `${d.getDate()} de ${m[d.getMonth()]} de ${d.getFullYear()}`;
        } catch(_) { return iso; }
    },

    formatarDataSalvo(iso) {
        if (!iso) return '';
        try { return new Date(iso).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
        catch(_) { return ''; }
    }
};