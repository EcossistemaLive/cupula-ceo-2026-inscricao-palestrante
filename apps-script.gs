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
 *  6. Tipo: "App da Web"
 *     - Executar como: "Eu"
 *     - Acesso: "Qualquer pessoa"
 *  7. Clique em "Implantar" e autorize as permissões
 *  8. COPIE a URL gerada e cole em script.js no campo APPS_SCRIPT_URL
 * ========================================================
 */

// ID da planilha do Google Sheets
const SPREADSHEET_ID = '1nmsBojofevsIFhS0OienuAZDo89IpjU3MqzW94K9uHM';

// Nome da aba onde os dados serão salvos
const SHEET_NAME = 'Respostas';

// E-mail para notificação a cada nova resposta (opcional)
const NOTIFY_EMAIL = 'contato@vidiceo.com.br';

// Cabeçalhos da planilha (na ordem que os dados chegam)
const HEADERS = [
  'Timestamp',
  'Tipo de Pessoa',
  // PF
  'Nome Completo (PF)',
  'CPF',
  'RG',
  'Endereço (PF)',
  'E-mail (PF)',
  'Telefone / WhatsApp',
  // PJ
  'Razão Social',
  'CNPJ',
  'Representante Legal',
  'CPF do Representante',
  'E-mail (PJ)',
  // Palestra
  'Tema / Painel',
  'Formato',
  'Duração (min)',
  'Horário Previsto',
  'Contato no Evento',
  'Cidade de Origem',
  'Necessidades Especiais',
  // Recursos
  'Recursos Solicitados',
  // Materiais
  'Link dos Materiais',
  'Mini-Bio',
  // Aceites
  'Aceita Termos',
  'Aceita LGPD',
  'Aceita Autorização de Imagem',
];

/**
 * Responde a requisições GET (teste via browser)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'ViDi Cúpula CEO 2026 — API online ✅' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Responde a requisições POST vindas do formulário HTML
 */
function doPost(e) {
  try {
    // Parse do corpo JSON
    const raw = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    // Garante que a planilha existe e tem o cabeçalho
    const sheet = getOrCreateSheet();

    // Monta a linha de dados na ordem dos cabeçalhos
    const row = [
      data.timestamp            || new Date().toLocaleString('pt-BR'),
      data.tipoPessoa           || '',
      data.nomeCompleto         || '',
      data.cpf                  || '',
      data.rg                   || '',
      data.enderecoPF           || '',
      data.emailPF              || '',
      data.telefonePF           || '',
      data.razaoSocial          || '',
      data.cnpj                 || '',
      data.representante        || '',
      data.cpfRepresentante     || '',
      data.emailPJ              || '',
      data.temaPainel           || '',
      data.formato              || '',
      data.duracao              || '',
      data.horarioPrevisto      || '',
      data.contatoEvento        || '',
      data.cidadeOrigem         || '',
      data.necessidades         || '',
      data.recursos             || '',
      data.linkMateriais        || '',
      data.miniBio              || '',
      data.aceitaTermos         || '',
      data.aceitaLGPD           || '',
      data.aceitaImagem         || '',
    ];

    // Adiciona a linha na planilha
    sheet.appendRow(row);

    // Formata a última linha inserida
    formatLastRow(sheet);

    // Envia e-mail de notificação
    sendNotificationEmail(data);

    // Retorna sucesso com CORS habilitado
    return buildResponse({ status: 'success', message: 'Dados salvos com sucesso!' });

  } catch (err) {
    console.error('Erro ao salvar dados:', err);
    return buildResponse({ status: 'error', message: err.toString() }, 500);
  }
}

/**
 * Obtém ou cria a aba "Respostas" com cabeçalho formatado
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Verifica se o cabeçalho já existe
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    formatHeader(sheet);
  }

  return sheet;
}

/**
 * Formata a linha de cabeçalho com estilo premium
 */
function formatHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground('#1a1040');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  sheet.setFrozenRows(1);

  // Auto-resize colunas
  for (let i = 1; i <= HEADERS.length; i++) {
    sheet.setColumnWidth(i, 180);
  }

  // Coluna de mini-bio mais larga
  sheet.setColumnWidth(HEADERS.indexOf('Mini-Bio') + 1, 320);
}

/**
 * Formata a última linha inserida (zebra + bordas)
 */
function formatLastRow(sheet) {
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(lastRow, 1, 1, HEADERS.length);
  const bg = lastRow % 2 === 0 ? '#f3f0ff' : '#fafafa';
  range.setBackground(bg);
  range.setBorder(false, false, true, false, false, false, '#e0d5ff', SpreadsheetApp.BorderStyle.SOLID);
}

/**
 * Envia e-mail de notificação para a organização
 */
function sendNotificationEmail(data) {
  try {
    const nome = data.nomeCompleto || data.representante || 'Palestrante';
    const email = data.emailPF || data.emailPJ || '';
    const tema = data.temaPainel || 'Não informado';
    const tipo = data.tipoPessoa || '';

    const subject = `🎤 Nova inscrição — Cúpula CEO 2026: ${nome}`;
    const body = `
Olá, equipe ViDi!

Uma nova inscrição foi recebida pelo formulário de palestrantes da Cúpula CEO 2026.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 DADOS DO PALESTRANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: ${nome}
Tipo: ${tipo}
E-mail: ${email}
Telefone: ${data.telefonePF || '—'}
CPF: ${data.cpf || data.cpfRepresentante || '—'}
${data.cnpj ? 'CNPJ: ' + data.cnpj : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎤 DADOS DA APRESENTAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tema / Painel: ${tema}
Formato: ${data.formato || '—'}
Duração: ${data.duracao || '—'} min
Horário previsto: ${data.horarioPrevisto || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RECURSOS SOLICITADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.recursos || 'Nenhum informado'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 MATERIAIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Link: ${data.linkMateriais || 'Não informado'}
Mini-bio: ${data.miniBio ? data.miniBio.substring(0, 200) + '...' : 'Não informada'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: ${data.timestamp}

Acesse a planilha para ver todos os dados:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit

—
ViDi CEO · Sistema Automatizado de Inscrições
    `.trim();

    GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
  } catch (err) {
    // Não bloqueia o fluxo se o e-mail falhar
    console.warn('Aviso: não foi possível enviar e-mail de notificação.', err);
  }
}

/**
 * Constrói a resposta HTTP com CORS habilitado
 */
function buildResponse(data, statusCode) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
