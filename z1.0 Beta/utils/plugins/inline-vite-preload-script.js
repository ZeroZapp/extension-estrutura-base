import MagicString from 'magic-string';

/**
 * Solução para múltiplos content scripts
 * Baseado em: https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/177#issuecomment-1784112536
 */
export default function inlineVitePreloadScript() {
  let __vitePreload = '';
  
  return {
    name: 'replace-vite-preload-script-plugin',
    async renderChunk(code, chunk, options, meta) {
      // Aplica apenas para arquivos de content script
      if (!/content/.test(chunk.fileName)) {
        return null;
      }
      
      // Carrega o script de pré-carregamento do Vite apenas uma vez
      if (!__vitePreload) {
        const chunkName = Object.keys(meta.chunks).find(key => /preload/.test(key));
        const modules = meta.chunks?.[chunkName]?.modules;
        __vitePreload = modules?.[Object.keys(modules)?.[0]]?.code;
        
        // Substitui 'const' por 'var' para compatibilidade
        __vitePreload = __vitePreload?.replaceAll('const ', 'var ');
        
        if (!__vitePreload) {
          return null;
        }
      }
      
      // Remove a primeira linha do código original (que contém o import do preload)
      const codeWithoutPreload = code.split('\n').slice(1).join('\n');
      
      // Retorna o código com o preload inline
      return {
        code: __vitePreload + codeWithoutPreload,
        map: new MagicString(code).generateMap({ hires: true }),
      };
    },
  };
}
