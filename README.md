# Cúpula CEO 2026 — Formulário de Inscrição de Palestrantes

Formulário oficial de coleta de dados para palestrantes do evento **Cúpula CEO 2026**, organizado pela **ViDi CEO / Catalyst Educação Ltda**.

## 🔗 Acesso

👉 **[Acessar o formulário](https://ecossistemaLive.github.io/cupula-ceo-2026-inscricao-palestrante/)**

---

## 📋 Dados do Evento

| Campo | Informação |
|---|---|
| **Nome do evento** | Cúpula CEO 2026 |
| **Data** | 17 de Setembro de 2026 (quinta-feira) |
| **Jantar (opcional)** | 16 de Setembro de 2026 |
| **Local** | Hotel Royal Tulip, Brasília – DF |
| **Formato** | Imersão presencial de 1 dia — C-Level |
| **Público** | 250 a 300 participantes |

---

## 🛠️ Configuração do Google Apps Script

Para conectar o formulário à planilha do Google Sheets:

1. Abra a planilha: [Planilha de Respostas](https://docs.google.com/spreadsheets/d/1nmsBojofevsIFhS0OienuAZDo89IpjU3MqzW94K9uHM/edit)
2. Clique em **Extensões → Apps Script**
3. Cole o conteúdo de `apps-script.gs` substituindo o código existente
4. Salve e clique em **Implantar → Nova implantação**
5. Configure:
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Acesso: **Qualquer pessoa**
6. Copie a **URL do Web App** gerada
7. Cole a URL no arquivo `script.js`, na variável `APPS_SCRIPT_URL`
8. Faça um novo commit e push

---

## 📁 Estrutura

```
cupula-ceo-form/
├── index.html          # Formulário principal
├── style.css           # Estilos com identidade visual ViDi
├── script.js           # Lógica do formulário + integração Apps Script
├── apps-script.gs      # Código do Google Apps Script (Sheets)
├── vidi-logo.png       # Logo da ViDi CEO
└── README.md
```

---

## 📊 Campos Coletados

- Tipo de pessoa (Física ou Jurídica)
- Dados de identificação (CPF/CNPJ, RG, Endereço)
- E-mail e telefone de contato
- Tema / Painel da apresentação
- Formato (Palestra solo, Painel, Mesa redonda)
- Duração e horário previsto
- Recursos solicitados (Projetor, Microfone, Mesa, Flipchart)
- Link dos materiais de divulgação
- Mini-bio (até 150 palavras)
- Aceite dos Termos, LGPD e Autorização de Imagem

---

## 🏢 Organização

**Catalyst Educação Ltda** · CNPJ 64.465.973/0001-89  
Av. PL3, nº 960, Quadra H4, Sala 2508, Lozandes, Goiânia – GO  
📧 contato@vidiceo.com.br · 📞 (62) 98400-2840
