import { defineConfig } from '@playwright/test';
const chromiumOptions={launchOptions:process.platform==='win32'?{channel:'chrome'}:{}};
export default defineConfig({
  testDir:'./e2e',
  timeout:60000,
  fullyParallel:false,
  workers:1,
  reporter:'list',
  use:{baseURL:'http://127.0.0.1:5173',locale:'it-IT',screenshot:'only-on-failure'},
  webServer:{command:'npm run dev -- --port 5173 --strictPort',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI},
  projects:[
    {name:'desktop',use:{...chromiumOptions,viewport:{width:1440,height:900}}},
    {name:'mobile',use:{...chromiumOptions,viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
    {name:'small-mobile',use:{...chromiumOptions,viewport:{width:320,height:568},isMobile:true,hasTouch:true}},
    {name:'mobile-webkit',use:{browserName:'webkit',viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
  ],
});
