# Pantoja Entregas Rápidas - Landing Page

Landing page moderna e responsiva para serviços de entrega em Manaus.

## 📋 Configuração

### Arquivo de Configuração (`config.js`)

⚠️ **IMPORTANTE**: O arquivo `config.js` contém informações sensíveis e **NÃO deve ser enviado para o GitHub**. Ele está no `.gitignore` para sua segurança.

### Como Configurar

1. **Copie o arquivo de exemplo:**

   ```bash
   cp config.example.js config.js
   ```

   Ou copie manualmente o arquivo `config.example.js` e renomeie para `config.js`

2. **Edite o arquivo `config.js`** com suas informações reais:

```javascript
const CONFIG = {
  whatsapp: "5592999999999", // Seu número de WhatsApp (apenas números)
  email: "seu@email.com", // Seu email de contato
  atendimento: {
    horario: "Segunda à Sábado das 08:00 às 18:00",
    exclusivo: "Atendimento exclusivo por WhatsApp para agendamentos!",
  },
  whatsappButtonText: "Solicite o motoboy",
  regiao: "todas as regiões de Manaus",
  servicos: [
    // Lista de serviços oferecidos
  ],
};
```

### Formato do Número WhatsApp

O número deve estar no formato: **código do país + DDD + número** (sem caracteres especiais)

**Exemplos:**

- Manaus (92): `5592999999999` (55 + 92 + 999999999)
- São Paulo (11): `5511999999999` (55 + 11 + 999999999)

### Variáveis Disponíveis

| Variável                | Tipo   | Descrição                                                |
| ----------------------- | ------ | -------------------------------------------------------- |
| `whatsapp`              | String | Número de WhatsApp (formato: código país + DDD + número) |
| `email`                 | String | Email de contato                                         |
| `atendimento.horario`   | String | Texto do horário de atendimento                          |
| `atendimento.exclusivo` | String | Texto sobre atendimento exclusivo                        |
| `whatsappButtonText`    | String | Texto do botão WhatsApp                                  |
| `regiao`                | String | Região de cobertura                                      |
| `servicos`              | Array  | Lista de serviços oferecidos                             |

## 🔒 Segurança

⚠️ **IMPORTANTE**:

- O arquivo `config.js` está no `.gitignore` e **NÃO será enviado para o GitHub**
- Use o arquivo `config.example.js` como template (este sim pode ir para o GitHub)
- **Nunca** faça commit do `config.js` com dados reais

## 🚀 Como Usar

1. Clone ou baixe o repositório
2. **Copie `config.example.js` para `config.js`**:
   ```bash
   cp config.example.js config.js
   ```
3. Edite o arquivo `config.js` na raiz com suas informações reais
4. Abra `index.html` no navegador ou faça o deploy

## 📁 Estrutura de Arquivos

```
pantoja-entregas/
├── index.html          # Página principal
├── config.js           # Arquivo de configuração (EDITAR ESTE - na raiz para fácil acesso)
├── css/
│   └── style.css       # Estilos CSS
├── js/
│   └── script.js       # JavaScript principal
├── README.md           # Documentação
└── .gitignore          # Arquivos ignorados pelo Git
```

## 📤 Como Publicar

### Opção 1: Hospedagem Estática (Recomendado)

**Plataformas que funcionam perfeitamente:**

- **Netlify**: Arraste a pasta do projeto ou conecte ao GitHub
- **Vercel**: Conecte o repositório GitHub
- **GitHub Pages**: Ative nas configurações do repositório
- **Cloudflare Pages**: Conecte ao repositório

**Passos gerais:**

1. Faça upload de TODA a pasta do projeto (mantendo a estrutura de pastas)
2. Certifique-se de que `index.html` está na raiz
3. Pronto! O site estará no ar

### Opção 2: Servidor Web Tradicional

1. Faça upload de todos os arquivos mantendo a estrutura de pastas
2. Coloque na pasta `public_html` ou `www` do seu servidor
3. A estrutura de pastas (`css/`, `js/`) será mantida

### ⚠️ Importante

- **Mantenha a estrutura de pastas**: `css/` e `js/` devem estar na mesma pasta que `index.html`
- **Não altere os caminhos**: Os arquivos já estão configurados corretamente
- **Edite apenas `config.js`** (na raiz): Para personalizar informações de contato - está na raiz para facilitar o acesso na plataforma de hospedagem

## 🎨 Características

- ✅ Design moderno e responsivo
- ✅ Cores branco e azul
- ✅ Animações suaves
- ✅ Botões WhatsApp com efeito piscando
- ✅ Configuração centralizada
- ✅ Fácil personalização

## 📝 Notas

- O arquivo `config.example.js` serve como exemplo/template
- Todas as alterações de contato devem ser feitas em `config.js`
- O site atualiza automaticamente os links e textos baseados nas configurações
