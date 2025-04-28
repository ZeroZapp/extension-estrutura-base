// src/pages/libs/moduleraid.js
const moduleRaid = function () {
    moduleRaid.mID = Math.random().toString(36).substring(7);
    moduleRaid.mObj = {};
  
    const isComet = parseInt(window.Debug?.VERSION?.split('.')?.[1]) >= 3000;
    console.log(`[moduleRaid] Detected Comet version: ${isComet} (WVERSION: ${window.Debug?.VERSION})`);
    
    console.log('[moduleRaid] WhatsApp Environment:', {
      'window.Debug': typeof window.Debug,
      'window.Debug?.VERSION': window.Debug?.VERSION,
      'window.webpackChunk_web': typeof window.webpackChunk_web,
      'window.webpackChunkwhatsapp': typeof window.webpackChunkwhatsapp,
      'require function': typeof window.require
    });
  
    function fillModuleArray() {
      console.log('[moduleRaid] Starting fillModuleArray...');
      if (isComet) {
        console.log('[moduleRaid] Using Comet strategy.');
        try {
          if (typeof window.require !== 'function') {
            console.error('[moduleRaid] Error: window.require is not a function:', window.require);
            return;
          }
          
          let debugModule;
          try {
            debugModule = window.require('__debug');
            console.log('[moduleRaid] require("__debug") object:', debugModule);
          } catch (requireError) {
            console.error('[moduleRaid] Error requiring __debug module:', requireError);
            
            const alternativeModules = ['__d', 'debug', 'Debug', 'webpackJsonp'];
            let foundAlternative = false;
            
            for (const modName of alternativeModules) {
              try {
                const altModule = window.require(modName);
                if (altModule) {
                  console.log(`[moduleRaid] Found alternative module "${modName}":`, altModule);
                  debugModule = altModule;
                  foundAlternative = true;
                  break;
                }
              } catch (e) {
                console.warn(`[moduleRaid] Alternative module "${modName}" not found`);
              }
            }
            
            if (!foundAlternative) {
              console.error('[moduleRaid] Could not find any debug module alternatives');
              return;
            }
          }
          
          if (!debugModule || !debugModule.modulesMap) {
            console.error('[moduleRaid] Error: __debug or __debug.modulesMap is not available.');
            return;
          }
          const moduleKeys = Object.keys(debugModule.modulesMap);
          console.log(`[moduleRaid] Found ${moduleKeys.length} module keys in modulesMap.`);
          let successCount = 0;
          let failCount = 0;
          for (const moduleKey of moduleKeys) {
            try {
              const module = require(moduleKey);
              if (module) {
                moduleRaid.mObj[moduleKey] = module;
                successCount++;
              } else {
                failCount++;
              }
            } catch (e) {
              failCount++;
              console.warn(`[moduleRaid] Failed to get module ${moduleKey}: ${e}`);
            }
          }
          console.log(`[moduleRaid] Comet strategy finished. Success: ${successCount}, Failed/Skipped: ${failCount}`);
          console.log('[moduleRaid] Checking for specific module errors...');
        } catch (error) {
          console.error('[moduleRaid] Error in Comet strategy:', error);
        }
      }
    }
  
    fillModuleArray();
  
    return moduleRaid;
  };
  
  window.mR = moduleRaid();
  window.WVERSION = parseInt(window.Debug?.VERSION?.split('.')?.[1]);
  console.log(`[moduleRaid] WVERSION set to: ${window.WVERSION}`);
  
  // Exportar módulo
  export default moduleRaid;