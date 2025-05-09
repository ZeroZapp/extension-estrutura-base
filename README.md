
#  Extensão Estrutura Base – Projeto ZeroZap

Extensão para Google Chrome desenvolvida com o objetivo de facilitar o **gerenciamento e visualização de conversas do WhatsApp Web**, usando uma arquitetura moderna e altamente reutilizável.

Este projeto também serve como **estrutura base** para outras extensões, com foco em performance, escalabilidade e manutenibilidade.

---

## 📄 Funcionalidades

- 🔍 **Busca em tempo real** de conversas
- 📂 **Filtros por status, data e tipo**
- 💾 **Armazenamento local persistente** com PouchDB
- 🌙 **Suporte a tema escuro adaptativo**
- 🔄 **Recarregamento e sincronização automática**
- 📡 **Integração com Socket.io para comunicação em tempo real**
- ⚛️ **Componentização com React e NextUI**
- 🧩 **Arquitetura organizada e escalável**

---

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextUI](https://nextui.org/)
- [PouchDB](https://pouchdb.com/)
- [Socket.io Client](https://socket.io/)
- [Moment.js](https://momentjs.com/)
- [Lucide React](https://lucide.dev/)
- [ESLint](https://eslint.org/)

---

## 📦 Instalação

> Pré-requisitos: Node.js, npm ou yarn

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/extensao-estrutura-base.git
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Rode o projeto em modo desenvolvimento:
```bash
npm run dev
```

4. Para gerar o build da extensão:
```bash
npm run build
```

5. Vá até o `chrome://extensions/` no navegador, ative o modo de desenvolvedor e carregue a pasta `dist/` como extensão não empacotada.

---

## 📁 Documentação

A documentação técnica completa está disponível em:

📄 https://carmonaventures.notion.site/Documeta-o-Completo-para-Criar-uma-Estrutura-B-sica-de-Extens-o-do-Chrome-com-React-1df15041ac0881088a47e0bde3dd0fe6?pvs=4

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork deste repositório.
2. Crie uma branch com sua feature: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request.

---

## 📜 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido por [ZeroZap](https://github.com/ZeroZapp)
