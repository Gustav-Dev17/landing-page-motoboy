// Script de build - gera .env a partir do .env.example e injeta variáveis no HTML
// Este script roda durante o build no Netlify ou localmente

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const envExamplePath = path.join(rootDir, '.env.example');
const envPath = path.join(rootDir, '.env');
const indexPath = path.join(rootDir, 'index.html');

// 1. Gerar .env a partir do .env.example se .env não existir
if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log('📝 Gerando .env a partir do .env.example...');
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envExampleContent, 'utf8');
    console.log('✅ .env criado com sucesso!');
}

// Garantir que o .env existe antes de carregar
if (!fs.existsSync(envPath)) {
    console.warn('⚠️ Arquivo .env não encontrado. Criando a partir do .env.example...');
    if (fs.existsSync(envExamplePath)) {
        const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
        fs.writeFileSync(envPath, envExampleContent, 'utf8');
    }
}

// 2. Carregar variáveis de ambiente do arquivo .env (apenas se não estiver no Netlify)
// No Netlify, as variáveis vêm de process.env automaticamente
// Só carregar .env se estivermos em ambiente local (sem variáveis do Netlify)
const isNetlify = process.env.NETLIFY === 'true' || process.env.CI === 'true';
const hasNetlifyVars = process.env.CONFIG_WHATSAPP || process.env.CONFIG_EMAIL;

if (!isNetlify && !hasNetlifyVars && fs.existsSync(envPath)) {
    console.log('📝 Ambiente local detectado. Carregando .env...');
    try {
        // Usar dotenv com encoding UTF-8
        const dotenv = require('dotenv');
        const result = dotenv.config({ 
            path: envPath,
            encoding: 'utf8',
            override: false // Não sobrescrever variáveis já existentes
        });
        
        if (result.error) {
            console.warn('⚠️ Erro ao carregar .env com dotenv, usando leitura manual...');
            // Fallback: leitura manual
            let envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
            
            // Remover BOM se existir
            if (envContent.charCodeAt(0) === 0xFEFF) {
                envContent = envContent.slice(1);
            }
            
            const envLines = envContent.split(/\r?\n/);
            envLines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const equalIndex = trimmedLine.indexOf('=');
                    if (equalIndex > 0) {
                        const key = trimmedLine.substring(0, equalIndex).trim();
                        let value = trimmedLine.substring(equalIndex + 1).trim();
                        
                        // Remover aspas se existirem
                        if ((value.startsWith('"') && value.endsWith('"')) || 
                            (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.slice(1, -1);
                        }
                        
                        // Só definir se não existir (priorizar variáveis de ambiente)
                        if (!process.env[key]) {
                            process.env[key] = value;
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.warn('⚠️ Erro ao processar .env:', error.message);
    }
} else if (isNetlify || hasNetlifyVars) {
    console.log('🌐 Ambiente Netlify detectado. Usando variáveis de ambiente do Netlify.');
}

// 3. Ler variáveis de ambiente do Netlify/process.env ou usar valores padrão
const CONFIG = {
    whatsapp: process.env.CONFIG_WHATSAPP || '5500000000000',
    email: process.env.CONFIG_EMAIL || 'contato@email.com',
    atendimento: {
        horario: process.env.CONFIG_HORARIO || 'Segunda à Sábado das 08:00 às 18:00',
        exclusivo: process.env.CONFIG_EXCLUSIVO || 'Atendimento exclusivo por WhatsApp para agendamentos!'
    },
    whatsappButtonText: process.env.CONFIG_BUTTON_TEXT || 'Solicite o motoboy',
    regiao: process.env.CONFIG_REGIAO || 'todas as regiões de Manaus',
    servicos: process.env.CONFIG_SERVICOS 
        ? (() => {
            try {
                // Garantir que o JSON seja parseado corretamente com UTF-8
                const servicosStr = process.env.CONFIG_SERVICOS;
                
                // Debug: verificar se há caracteres corrompidos
                if (servicosStr.includes('Ã')) {
                    console.warn('⚠️ Detectado problema de encoding no CONFIG_SERVICOS');
                    console.warn('   Tentando corrigir...');
                    
                    // Tentar corrigir encoding: se foi lido como Latin1 mas é UTF-8
                    // Converter de Latin1 para UTF-8
                    const buffer = Buffer.from(servicosStr, 'latin1');
                    const corrected = buffer.toString('utf8');
                    const servicos = JSON.parse(corrected);
                    console.log('✅ Encoding corrigido!');
                    return servicos;
                }
                
                const servicos = JSON.parse(servicosStr);
                return servicos;
            } catch (e) {
                console.warn('⚠️ Erro ao parsear CONFIG_SERVICOS:', e.message);
                return [
                    'Coletas e Entregas - Pessoal e Comercial',
                    'Envio e recebimento de documentos',
                    'Despacho em agências dos Correios',
                    'Serviços de cartório: entrega de certidões, reconhecimento de firma e protocolo de documentos em fóruns',
                    'Serviços de despachante: entrega de ATPV-e, documentos veiculares e placas',
                    'Entrega de convites para aniversários, casamentos e demais eventos'
                ];
            }
        })()
        : [
            'Coletas e Entregas - Pessoal e Comercial',
            'Envio e recebimento de documentos',
            'Despacho em agências dos Correios',
            'Serviços de cartório: entrega de certidões, reconhecimento de firma e protocolo de documentos em fóruns',
            'Serviços de despachante: entrega de ATPV-e, documentos veiculares e placas',
            'Entrega de convites para aniversários, casamentos e demais eventos'
        ]
};

// 4. Injetar CONFIG diretamente no HTML como script inline
if (fs.existsSync(indexPath)) {
    // Ler HTML com UTF-8 explicitamente
    let htmlContent = fs.readFileSync(indexPath, { encoding: 'utf8' });
    
    // Remover script CONFIG antigo se existir (para evitar duplicação)
    htmlContent = htmlContent.replace(/<script>\s*\/\/\s*Configurações injetadas durante o build[\s\S]*?<\/script>/g, '');

    // Criar script inline com as configurações
    // Usar JSON.stringify com replacer para garantir UTF-8
    const configScript = `
    <script>
        // Configurações injetadas durante o build
        const CONFIG = ${JSON.stringify(CONFIG, null, 8).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')};
    </script>`;

    // Inserir antes do script.js (no final do body)
    if (htmlContent.includes('<script src="js/script.js"></script>')) {
        htmlContent = htmlContent.replace(
            '<script src="js/script.js"></script>',
            `${configScript}\n    <script src="js/script.js"></script>`
        );
    } else if (htmlContent.includes('</body>')) {
        // Fallback: inserir antes do fechamento do body
        htmlContent = htmlContent.replace('</body>', `${configScript}\n    </body>`);
    }

    // Garantir que o HTML seja salvo com UTF-8 (com BOM se necessário para Windows)
    // Adicionar meta charset UTF-8 se não existir
    if (!htmlContent.includes('<meta charset="UTF-8"')) {
        htmlContent = htmlContent.replace('<head>', '<head>\n    <meta charset="UTF-8">');
    }
    
    // Salvar com UTF-8 (sem BOM para compatibilidade)
    const BOM = '\uFEFF';
    // Remover BOM se existir antes de salvar
    if (htmlContent.charCodeAt(0) === 0xFEFF) {
        htmlContent = htmlContent.slice(1);
    }
    fs.writeFileSync(indexPath, htmlContent, { encoding: 'utf8', flag: 'w' });
    console.log('✅ Configurações injetadas no index.html!');
} else {
    console.warn('⚠️ index.html não encontrado!');
}

console.log('✅ Build concluído com sucesso!');
console.log('📝 Configurações aplicadas:');
console.log(`   - WhatsApp: ${CONFIG.whatsapp}`);
console.log(`   - Email: ${CONFIG.email}`);
console.log(`   - Região: ${CONFIG.regiao}`);
console.log(`   - Serviços: ${CONFIG.servicos ? CONFIG.servicos.length : 0} itens`);

// Debug: mostrar de onde vieram as variáveis
if (process.env.CONFIG_WHATSAPP) {
    console.log('✅ Variáveis de ambiente detectadas (Netlify ou sistema)');
} else {
    console.log('⚠️ Usando valores padrão - verifique se as variáveis estão configuradas');
}

