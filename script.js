/* ========================================
   VIDI CEO — Formulário Cúpula CEO 2026
   JavaScript
   ======================================== */

// ===== CONFIG =====
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyDCNaRJ_LK-kDF_EHTThKm5auPMfNkzhnZFnglDIjDeb5Le031-rFxPCaSXgR_EIUfzQ/exec';

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

  document.getElementById('tipoPF').checked = true;
  document.getElementById('tipoPF').dispatchEvent(new Event('change'));
}

function setRequired(sectionSelector, required) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;
  section.querySelectorAll('.field-input').forEach(el => {
    if (required) {
      el.setAttribute('required', '');
    } else {
      el.removeAttribute('required');
    }
  });
}

// ===== MASKS =====
function maskCPF(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, '$1.$2');
    input.value = v;
  });
}

function maskCNPJ(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').substring(0, 14);
    if (v.length > 12) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    else if (v.length > 8) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
    else if (v.length > 5) v = v.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '$1.$2');
    input.value = v;
  });
}

function maskPhone(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '($1) $2');
    input.value = v;
  });
}

// ===== BIO COUNTER (100 palavras) =====
function setupBioCounter() {
  const bio = document.getElementById('miniBio');
  const counter = document.getElementById('bioCount');
  if (!bio || !counter) return;
  bio.addEventListener('input', () => {
    const words = bio.value.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    counter.textContent = `${count} / 100 palavras`;
    counter.style.color = count > 100 ? '#e74c3c' : 'var(--text-muted)';
  });
}

// ===== COLLECT FORM DATA =====
function collectData() {
  const form = document.getElementById('speakerForm');
  const tipo = document.querySelector('[name="tipoPessoa"]:checked')?.value || '';

  const data = {
    timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),

    // Seção 1 — Identificação
    nomeAnuncio:       document.getElementById('nomeAnuncio').value,
    cargo:             document.getElementById('cargo').value,
    empresa:           document.getElementById('empresa').value,
    emailPF:           document.getElementById('emailPF').value,
    telefonePF:        document.getElementById('telefonePF').value,
    linkedin:          document.getElementById('linkedin').value,
    instagram:         document.getElementById('instagram').value,
    youtube:           document.getElementById('youtube').value,
    siteProfissional:  document.getElementById('siteProfissional').value,

    // Seção 2 — Termo
    tipoPessoa:        tipo,
    nomeCompleto:      document.getElementById('nomeCompleto').value,
    cpf:               document.getElementById('cpf').value,
    rg:                document.getElementById('rg').value,
    enderecoPF:        document.getElementById('enderecoPF').value,
    razaoSocial:       document.getElementById('razaoSocial').value,
    cnpj:              document.getElementById('cnpj').value,
    representante:     document.getElementById('representante').value,
    cpfRepresentante:  document.getElementById('cpfRepresentante').value,

    // Seção 3 — Conteúdo
    temaPainel:        document.getElementById('temaPainel').value,
    sinopse:           document.getElementById('sinopse').value,
    miniBio:           document.getElementById('miniBio').value,
    caseSucesso:       document.getElementById('caseSucesso').value,
    contatoEvento:     document.getElementById('contatoEvento').value,
    cidadeOrigem:      document.getElementById('cidadeOrigem').value,
    necessidades:      document.getElementById('necessidades').value,

    // Seção 4 — Materiais
    linkMateriais:     document.getElementById('linkMateriais').value,
    obsPhotos:         document.getElementById('obsPhotos').value,
    linkVideo:         document.getElementById('linkVideo').value,

    // Aceites
    aceitaTermos:      document.getElementById('aceitaTermos').checked ? 'Sim' : 'Não',
    aceitaLGPD:        document.getElementById('aceitaLGPD').checked ? 'Sim' : 'Não',
    aceitaImagem:      document.getElementById('aceitaImagem').checked ? 'Sim' : 'Não',
  };

  return data;
}

// ===== VALIDATE =====
function validateForm() {
  const form = document.getElementById('speakerForm');
  let valid = true;

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
        valid = false;
        if (!field.closest('.terms-check').querySelector('.error-msg')) {
          const err = document.createElement('p');
          err.className = 'error-msg';
          err.textContent = 'Você precisa aceitar para continuar.';
          field.closest('.terms-check').after(err);
        }
      }
    } else if (field.closest('.hidden')) {
      // skip hidden fields
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
  const formData = new URLSearchParams();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
    document.getElementById('speakerForm').classList.add('hidden');
    document.getElementById('successScreen').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Erro ao enviar:', err);
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnIcon.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    alert('Erro ao enviar. Por favor, tente novamente ou entre em contato: contato@vidiceo.com.br');
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

  const allInputs = document.querySelectorAll('.field-input, [name="tipoPessoa"], [name="aceitaTermos"], [name="aceitaLGPD"], [name="aceitaImagem"]');
  allInputs.forEach(el => el.addEventListener('input', updateProgress));
  allInputs.forEach(el => el.addEventListener('change', updateProgress));

  document.getElementById('speakerForm').addEventListener('submit', handleSubmit);
});
