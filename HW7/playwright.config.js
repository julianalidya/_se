import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'e2e.spec.js',workers:1,use:{baseURL:'http://127.0.0.1:3000',headless:true,screenshot:'only-on-failure',trace:'retain-on-failure'},reporter:[['list'],['html',{open:'never'}]],webServer:{command:'npm start',url:'http://127.0.0.1:3000',reuseExistingServer:false}});
