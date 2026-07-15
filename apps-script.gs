/**
 * ========================================================
 *  VIDI CEO — Cúpula CEO 2026
 *  Google Apps Script — Recebe dados do formulário
 *  e salva na planilha do Google Sheets.
 *
 *  INSTRUÇÃO DE IMPLANTAÇÃO:
 *  1. Abra a planilha: https://docs.google.com/spreadsheets/d/1nmsBojofevsIFhS0OienuAZDo89IpjU3MqzW94K9uHM/edit
 *  2. Clique em "Extensões" → "Apps Script"
 *  3. Cole TODO este código substituindo o conteúdo existente
 *  4. Salve (Ctrl+S)
 *  5. Clique em "Implantar" → "Nova implantação"
 *  6. Tipo: "App da Web" | Executar como: "Eu" | Acesso: "Qualquer pessoa"
 *  7. Copie a URL gerada e cole em script.js no campo APPS_SCRIPT_URL
 * ========================================================
 */

const SPREADSHEET_ID = '1nmsBojofevsIFhS0OienuAZDo89IpjU3MqzW94K9uHM';
const SHEET_NAME     = 'Respostas';
const NOTIFY_EMAIL   = 'contato@vidiceo.com.br';

const HEADERS = [
  'Timestamp',
  // Seção 1 — Identificação
  'Nome (como anunciado)',
  'Cargo / Função',
  'Empresa / Organização',
  'E-mail',
  'Telefone / WhatsApp',
  'LinkedIn',
  'Instagram',
  'YouTube',
  'Site Profissional',
  // Seção 2 — Termo
  'Tipo de Pessoa',
  'Nome Completo (Termo)',
  'CPF',
  'RG',
  'Endereço',
  'Razão Social',
  'CNPJ',
  'Representante Legal',
  'CPF do Representante',
  // Seção 3 — Conteúdo
  'Título da Palestra',
  'Resumo / Sinopse',
  'Mini-biografia (100 palavras)',
  'Case de Sucesso / Marco',
  'Contato no Evento',
  'Cidade de Origem',
  'Necessidades / Recursos Técnicos',
  // Seção 4 — Materiais
  'Link Fotos Oficiais',
  'Observações sobre Fotos',
  'Link Vídeo de Chamada',
  // Aceites
  'Aceita Termo de Participação',
  'Aceita LGPD',
  'Aceita Autorização de Imagem',
];

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'ViDi Cúpula CEO 2026 — API online ✅' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);
    const sheet = getOrCreateSheet();

    const row = [
      data.timestamp            || new Date().toLocaleString('pt-BR'),
      // Seção 1
      data.nomeAnuncio          || '',
      data.cargo                || '',
      data.empresa              || '',
      data.emailPF              || '',
      data.telefonePF           || '',
      data.linkedin             || '',
      data.instagram            || '',
      data.youtube              || '',
      data.siteProfissional     || '',
      // Seção 2
      data.tipoPessoa           || '',
      data.nomeCompleto         || '',
      data.cpf                  || '',
      data.rg                   || '',
      data.enderecoPF           || '',
      data.razaoSocial          || '',
      data.cnpj                 || '',
      data.representante        || '',
      data.cpfRepresentante     || '',
      // Seção 3
      data.temaPainel           || '',
      data.sinopse              || '',
      data.miniBio              || '',
      data.caseSucesso          || '',
      data.contatoEvento        || '',
      data.cidadeOrigem         || '',
      data.necessidades         || '',
      // Seção 4
      data.linkMateriais        || '',
      data.obsPhotos            || '',
      data.linkVideo            || '',
      // Aceites
      data.aceitaTermos         || '',
      data.aceitaLGPD           || '',
      data.aceitaImagem         || '',
    ];

    sheet.appendRow(row);
    formatLastRow(sheet);
    sendNotificationEmail(data);

    return buildResponse({ status: 'success', message: 'Dados salvos com sucesso!' });
  } catch (err) {
    console.error('Erro:', err);
    return buildResponse({ status: 'error', message: err.toString() });
  }
}

function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet   = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    formatHeader(sheet);
  }
  return sheet;
}

function formatHeader(sheet) {
  const range = sheet.getRange(1, 1, 1, HEADERS.length);
  range.setBackground('#1a1040');
  range.setFontColor('#ffffff');
  range.setFontWeight('bold');
  range.setFontSize(10);
  range.setWrap(true);
  sheet.setFrozenRows(1);
  for (let i = 1; i <= HEADERS.length; i++) sheet.setColumnWidth(i, 200);
  // Colunas de texto longo mais largas
  [20, 21, 22, 23].forEach(col => sheet.setColumnWidth(col, 350));
}

function formatLastRow(sheet) {
  const lastRow = sheet.getLastRow();
  const range   = sheet.getRange(lastRow, 1, 1, HEADERS.length);
  range.setBackground(lastRow % 2 === 0 ? '#f3f0ff' : '#fafafa');
  range.setBorder(false, false, true, false, false, false, '#e0d5ff', SpreadsheetApp.BorderStyle.SOLID);
}

function sendNotificationEmail(data) {
  try {
    const nome   = data.nomeAnuncio || 'Palestrante';
    const empresa = data.empresa    || '—';
    const cargo  = data.cargo       || '—';
    const tema   = data.temaPainel  || 'Não informado';

    const subject = `🎤 Nova resposta — Cúpula CEO 2026: ${nome}`;
    const body = `
Olá, equipe ViDi!

Nova resposta recebida pelo formulário de palestrantes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 IDENTIFICAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: ${nome}
Cargo: ${cargo}
Empresa: ${empresa}
E-mail: ${data.emailPF || '—'}
Telefone: ${data.telefonePF || '—'}
LinkedIn: ${data.linkedin || '—'}
Instagram: ${data.instagram || '—'}
Cidade de origem: ${data.cidadeOrigem || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎤 CONTEÚDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Título: ${tema}
Sinopse: ${data.sinopse ? data.sinopse.substring(0, 300) + '...' : '—'}
Case de sucesso: ${data.caseSucesso ? data.caseSucesso.substring(0, 200) + '...' : '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 MATERIAIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Link Fotos: ${data.linkMateriais || 'Não informado'}
Link Vídeo: ${data.linkVideo || 'Não informado'}
Obs. Fotos: ${data.obsPhotos || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: ${data.timestamp}

Acesse a planilha: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

— ViDi CEO · Sistema Automatizado de Formulários
    `.trim();

    GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
  } catch (err) {
    console.warn('E-mail não enviado:', err);
  }
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
