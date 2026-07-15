/* ========================================
   VIDI CEO — Formulário Cúpula CEO 2026
   JavaScript
   ======================================== */

// ===== CONFIG =====
// Este endpoint é gerado pelo Google Apps Script.
// Após publicar o script, cole a URL do Web App aqui:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxASD_PLACEHOLDER_SUBSTITUA_PELA_URL_REAL/exec';

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['rgba(206,167,54,', 'rgba(219,185,74,', 'rgba(168,133,32,'];
  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 20;
    const opacity = Math.random() * 0.5 + 0.1;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${left}%;
      background: ${color}${opacity});
      box-shadow: 0 0 ${size * 2}px ${color}0.4);
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(p);
  }
}

// ===== PROGRESS =====
function updateProgress() {
  const form = document.getElementById('speakerForm');
  const required = form.querySelectorAll('[required]');
  const filled = [...required].filter(el => {
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'radio') return form.querySelector(`[name="${el.name}"]:checked`);
    return el.value.trim() !== '';
  });
  const pct = Math.round((filled.length / required.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% concluído';
}

// ===== TIPO PESSOA TOGGLE =====
function setupTipoPessoa() {
  const radios = document.querySelectorAll('[name="tipoPessoa"]');
  const secaoPF = document.getElementById('secaoPF');
  const secaoPJ = document.getElementById('secaoPJ');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'Pessoa Física') {
        secaoPF.classList.remove('hidden');
        secaoPJ.classList.add('hidden');
        // Required on PF fields
        setRequired('#secaoPF', true);
        setRequired('#secaoPJ', false);
      } else {
        secaoPJ.classList.remove('hidden');
        secaoPF.classList.add('hidden');
        setRequired('#secaoPJ', true);
        setRequired('#secaoPF', false);
      }
      updateProgress();
    });
  });

  // Default: show PF
  document.getElementById('tipoPF').checked = true;
  document.getElementById('tipoPF').dispatchEvent(new Event('change'));
}

function setRequired(sectionSelector, required) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;
  section.querySelectorAll('.field-input').forEach(el => {
    if (required) {
      if (el.dataset.wasRequired !== 'false') el.setAttribute('required', '');
    } else {
      el.removeAttribute('required');
    }
  });
}

// ===== CPF MASK =====
function maskCPF(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '');
    v = v.substring(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, '$1.$2');
    input.value = v;
  });
}

// ===== CNPJ MASK =====
function maskCNPJ(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '');
    v = v.substring(0, 14);
    if (v.length > 12) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    else if (v.length > 8) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
    else if (v.length > 5) v = v.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '$1.$2');
    input.value = v;
  });
}

// ===== PHONE MASK =====
function maskPhone(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '');
    v = v.substring(0, 11);
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '($1) $2');
    input.value = v;
  });
}

// ===== BIO COUNTER =====
function setupBioCounter() {
  const bio = document.getElementById('miniBio');
  const counter = document.getElementById('bioCount');
  bio.addEventListener('input', () => {
    const words = bio.value.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    counter.textContent = `${count} / 150 palavras`;
    counter.style.color = count > 150 ? '#f87171' : 'var(--text-muted)';
  });
}

// ===== COLLECT FORM DATA =====
function collectData() {
  const form = document.getElementById('speakerForm');
  const tipo = document.querySelector('[name="tipoPessoa"]:checked')?.value || '';
  const recursos = [...form.querySelectorAll('[name="recursos"]:checked')].map(c => c.value);
  const recursosOutros = document.getElementById('recursosOutros').value;
  const todosRecursos = recursosOutros ? [...recursos, 'Outros: ' + recursosOutros] : recursos;

  const data = {
    timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    tipoPessoa: tipo,
    // PF
    nomeCompleto: document.getElementById('nomeCompleto').value,
    cpf: document.getElementById('cpf').value,
    rg: document.getElementById('rg').value,
    enderecoPF: document.getElementById('enderecoPF').value,
    emailPF: document.getElementById('emailPF').value,
    telefonePF: document.getElementById('telefonePF').value,
    // PJ
    razaoSocial: document.getElementById('razaoSocial').value,
    cnpj: document.getElementById('cnpj').value,
    representante: document.getElementById('representante').value,
    cpfRepresentante: document.getElementById('cpfRepresentante').value,
    emailPJ: document.getElementById('emailPJ').value,
    // Participação
    temaPainel: document.getElementById('temaPainel').value,
    formato: document.getElementById('formato').value,
    duracao: document.getElementById('duracao').value,
    horarioPrevisto: document.getElementById('horarioPrevisto').value,
    contatoEvento: document.getElementById('contatoEvento').value,
    cidadeOrigem: document.getElementById('cidadeOrigem').value,
    necessidades: document.getElementById('necessidades').value,
    // Recursos
    recursos: todosRecursos.join(', '),
    // Materiais
    linkMateriais: document.getElementById('linkMateriais').value,
    miniBio: document.getElementById('miniBio').value,
    // Aceites
    aceitaTermos: document.getElementById('aceitaTermos').checked ? 'Sim' : 'Não',
    aceitaLGPD: document.getElementById('aceitaLGPD').checked ? 'Sim' : 'Não',
    aceitaImagem: document.getElementById('aceitaImagem').checked ? 'Sim' : 'Não',
  };

  return data;
}

// ===== VALIDATE =====
function validateForm() {
  const form = document.getElementById('speakerForm');
  let valid = true;

  // Remove previous errors
  form.querySelectorAll('.error-msg').forEach(e => e.remove());
  form.querySelectorAll('.error').forEach(e => e.classList.remove('error'));

  const tipoPessoa = document.querySelector('[name="tipoPessoa"]:checked');
  if (!tipoPessoa) {
    const radioCards = document.querySelector('.radio-cards');
    const err = document.createElement('p');
    err.className = 'error-msg';
    err.textContent = 'Por favor, selecione o tipo de participação.';
    radioCards.after(err);
    valid = false;
  }

  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (field.type === 'checkbox') {
      if (!field.checked) {
        field.closest('.terms-check')?.classList.add('error');
        valid = false;
        if (!field.closest('.terms-check').querySelector('.error-msg')) {
          const err = document.createElement('p');
          err.className = 'error-msg';
          err.textContent = 'Você precisa aceitar para continuar.';
          field.closest('.terms-check').after(err);
        }
      }
    } else if (field.closest('.form-section')?.classList.contains('hidden')) {
      // skip hidden sections
    } else if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
      if (!field.nextElementSibling?.classList.contains('error-msg')) {
        const err = document.createElement('p');
        err.className = 'error-msg';
        err.textContent = 'Este campo é obrigatório.';
        field.after(err);
      }
    }
  });

  return valid;
}

// ===== SUBMIT =====
async function handleSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    // Scroll to first error
    const firstError = document.querySelector('.error, .error-msg');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const btn = document.getElementById('submitBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnIcon = btn.querySelector('.btn-icon');
  const btnLoading = document.getElementById('btnLoading');

  btn.disabled = true;
  btnText.classList.add('hidden');
  btnIcon.classList.add('hidden');
  btnLoading.classList.remove('hidden');

  const data = collectData();

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // no-cors means we can't read response, assume success
    document.getElementById('speakerForm').classList.add('hidden');
    document.getElementById('successScreen').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Erro ao enviar:', err);
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnIcon.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    alert('Erro ao enviar. Por favor, tente novamente ou entre em contato com contato@vidiceo.com.br');
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setupTipoPessoa();
  maskCPF(document.getElementById('cpf'));
  maskCPF(document.getElementById('cpfRepresentante'));
  maskCNPJ(document.getElementById('cnpj'));
  maskPhone(document.getElementById('telefonePF'));
  maskPhone(document.getElementById('contatoEvento'));
  setupBioCounter();

  // Progress tracking
  const allInputs = document.querySelectorAll('.field-input, [name="tipoPessoa"], [name="aceitaTermos"], [name="aceitaLGPD"], [name="aceitaImagem"]');
  allInputs.forEach(el => el.addEventListener('input', updateProgress));
  allInputs.forEach(el => el.addEventListener('change', updateProgress));

  document.getElementById('speakerForm').addEventListener('submit', handleSubmit);
});
