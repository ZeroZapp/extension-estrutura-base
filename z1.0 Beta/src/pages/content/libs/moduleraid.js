// src/pages/content/libs/moduleraid.js
const moduleRaid = function () {
    moduleRaid.mID = Math.random().toString(36).substring(7);
    moduleRaid.mObj = {};
  
    const isComet = parseInt(window.Debug?.VERSION?.split('.')?.[1]) >= 3000;
    console.log(`[moduleRaid] Detected Comet version: ${isComet} (WVERSION: ${window.Debug?.VERSION})`);
    
    // Log WhatsApp environment details
    console.log('[moduleRaid] WhatsApp Environment:', {
      'window.Debug': typeof window.Debug,
      'window.Debug?.VERSION': window.Debug?.VERSION,
      'window.webpackChunk_web': typeof window.webpackChunk_web,
      'window.webpackChunkwhatsapp': typeof window.webpackChunkwhatsapp,
      'require function': typeof window.require
    });
  
    fillModuleArray = function () {
      console.log('[moduleRaid] Starting fillModuleArray...');
      if (isComet) {
        console.log('[moduleRaid] Using Comet strategy.');
        try {
          // Try to safely access require function
          if (typeof window.require !== 'function') {
            console.error('[moduleRaid] Error: window.require is not a function:', window.require);
            return;
          }
          
          // Try to get the debug module
          let debugModule;
          try {
            debugModule = window.require('__debug');
            console.log('[moduleRaid] require("__debug") object:', debugModule);
          } catch (requireError) {
            console.error('[moduleRaid] Error requiring __debug module:', requireError);
            
            // Try alternative module names that might exist in newer WhatsApp versions
            const alternativeModules = ['__d', 'debug', 'Debug', 'webpackJsonp'];
            let foundAlternative = false;
            
            for (const modName of alternativeModules) {
              try {
                const altModule = window.require(modName);
                debugModule = altModule;
                foundAlternative = true;
                console.log(`[moduleRaid] Found alternative module: ${modName}`);
                break;
              } catch (altError) {
                console.log(`[moduleRaid] Failed to get module ${modName}:`, altError);
              }
            }
            
            if (!foundAlternative) {
              console.error('[moduleRaid] Could not find any alternative module');
              return;
            }
          }
          
          // Initialize Store
          try {
            window.Store = debugModule.Store;
            console.log('[moduleRaid] Store initialized successfully');
          } catch (storeError) {
            console.error('[moduleRaid] Error initializing Store:', storeError);
          }
        } catch (error) {
          console.error('[moduleRaid] Error in Comet strategy:', error);
        }
      } else {
        console.log('[moduleRaid] Using non-Comet strategy');
        // Implement non-Comet strategy
      }
    };
  
    // Start module loading
    fillModuleArray();
  };
  
  // Initialize moduleRaid
  window.mR = moduleRaid();
  
  // Set WhatsApp version
  window.WVERSION = parseInt(window.Debug?.VERSION?.split('.')?.[1]);
  console.log(`[moduleRaid] WVERSION set to: ${window.WVERSION}`);