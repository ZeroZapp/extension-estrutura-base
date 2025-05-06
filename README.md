Extensão Estrutura Base – Projeto ZeroZap
Extensão para Google Chrome desenvolvida com o objetivo de facilitar o gerenciamento e visualização de conversas do WhatsApp Web, utilizando uma arquitetura moderna e altamente reutilizável.

Este projeto também serve como estrutura base para outras extensões, com foco em desempenho, escalabilidade e manutenibilidade.

📄 Funcionalidades
🔍 Busca em tempo real de conversas

📂 Filtros por status, dados e tipo

💾 Armazenamento local persistente com PouchDB

🌙 Suporte a tema escuro adaptativo

🔄 Recarregamento e sincronização automática

📡 Integração com Socket.io para comunicação em tempo real

⚛️ Componentização com React e NextUI

🧩 Arquitetura organizada e escalável

🛠️ Tecnologias Utilizadas
React

Vite

Tailwind CSS

NextUI

PouchDB

Socket.io Client

Moment.js

Lucide React

ESLint

📦 Instalação
Pré-requisitos: Node.js, npm ou yarn

Clone o repositório:

bash
Copiar
Editar
git clone https://github.com/seu-usuario/extensao-estrutura-base.git
Instale as dependências:

bash
Copiar
Editar
npm install
# ou
yarn
Rode o projeto em modo desenvolvimento:

bash
Copiar
Editar
npm run dev
Para gerar o build da extensão:

bash
Copiar
Editar
npm run build
Vá até chrome://extensions/ no navegador, ative o modo de desenvolvedor e carregue a pasta dist/ como extensão não empacotada.

⚙️ Build e Cache
Build
O processo de build utiliza o Vite para empacotar os arquivos da extensão. Certifique-se de que todas as dependências estejam corretamente instaladas e que o ambiente esteja configurado adequadamente antes de gerar o build.

Cache
Para otimizar o desempenho e garantir que os usuários tenham acesso às versões mais recentes da extensão, considere as seguintes práticas de cache:

Versão dos Arquivos: Inclua hashes nos nomes dos arquivos estáticos (por exemplo, main.abc123.js) para garantir que o navegador carregue a versão mais recente após atualizações.

Cabeçalhos de Cache: Configure os cabeçalhos HTTP adequados, como Cache-Control: max-age=31536000, immutable, para recursos que não mudam frequentemente. Isso permite que o navegador armazene em cache esses recursos por um longo período, melhorando o desempenho.

Armazenamento Local: Utilize chrome.storage.local para armazenar dados que precisam persistir entre as sessões do usuário. Este armazenamento oferece até 5 MB de espaço por perfil e é adequado para armazenar configurações e dados do usuário.

Evitar Recompilações Desnecessárias: O Chrome agora suporta cache de compilação V8 para extensões, o que significa que scripts grandes não serão recompilados a cada carregamento, melhorando o desempenho.

📁 Documentação
A documentação técnica completa está disponível em:

📄 Documentação Completa para Criar uma Estrutura Básica de Extensão do Chrome com React

🤝 Contribuindo
Contribuições são bem-vindas! Para contribuir:

Faça um fork deste repositório.

Crie uma branch com sua feature:

bash
Copiar
Editar
git checkout -b minha-feature
Commit suas mudanças:

bash
Copiar
Editar
git commit -m 'Adiciona nova feature'
Envie para a branch:

bash
Copiar
Editar
git push origin minha-feature
Abra um Pull Request.

📜 Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

👨‍💻 Autor
Seu Nome

