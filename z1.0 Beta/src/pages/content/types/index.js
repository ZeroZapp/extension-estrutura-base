/**
 * @typedef {Object} Message
 * @property {Object} id - Chave identificadora da mensagem.
 * @property {string} id.id - ID da mensagem.
 * @property {boolean} id.fromMe - Indica se a mensagem foi enviada por mim.
 * @property {string} id.remote - Chave do remetente remoto.
 * @property {string} id._serialized - Chave serializada da mensagem.
 */

/**
 * @typedef {Object} Model
 * @property {() => string} title - Função que retorna o título do chat.
 * @property {string} formattedTitle - Título formatado do chat.
 * @property {boolean} active - Indica se o chat está ativo.
 * @property {Object} msgs - Mensagens do chat.
 * @property {Array<Message>} msgs._models - Array de mensagens.
 * @property {Object} lastReceivedKey - Informações da última mensagem recebida.
 * @property {string} lastReceivedKey.id - ID da última mensagem.
 * @property {boolean} lastReceivedKey.fromMe - Indica se foi enviada por mim.
 * @property {string} lastReceivedKey.remote - Chave do remetente remoto.
 * @property {string} lastReceivedKey._serialized - Chave serializada.
 * @property {Object} [groupMetadata] - Metadados do grupo (se aplicável).
 * @property {string} [groupMetadata.title] - Título do grupo.
 * @property {boolean} archive - Indica se o chat está arquivado.
 * @property {number} unreadCount - Número de mensagens não lidas.
 * @property {Object} id - Identificador do chat.
 * @property {string} id.user - ID do usuário.
 * @property {string} id._serialized - ID serializado do usuário.
 */

/**
 * @typedef {Object} ReactProps
 * @property {Object} children - Elementos filhos.
 * @property {Object} children.props - Propriedades dos elementos filhos.
 * @property {Object} children.props.children - Elementos filhos aninhados.
 * @property {Object} children.props.children.props - Propriedades dos elementos filhos aninhados.
 * @property {Model} children.props.children.props.model - Modelo do chat.
 */

// ✅ NÃO É necessário declarar ou atribuir os tipos no globalThis.
// Eles já serão reconhecidos pelo seu editor e ferramentas de lint/IDE ao usar JSDoc.

// Exporta os tipos para uso em outros arquivos
export {};
