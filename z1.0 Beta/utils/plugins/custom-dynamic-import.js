export default function customDynamicImport() {
  return {
    name: 'custom-dynamic-import',
    renderDynamicImport({ moduleId }) {
      // Verifica se não é um módulo de node_modules e se é para Firefox
      if (!moduleId.includes('node_modules') && process.env.__FIREFOX__) {
        return {
          left: `
          {
            const dynamicImport = (path) => import(path);
            dynamicImport(browser.runtime.getURL('./') + `,
          right: ".split('../').join(''))}"
        };
      }
      
      // Comportamento padrão para Chrome e outros navegadores
      return {
        left: 'import(',
        right: ')'
      };
    }
  };
}
