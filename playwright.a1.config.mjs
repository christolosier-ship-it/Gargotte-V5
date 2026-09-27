import { defineConfig } from "@playwright/test";
export default defineConfig({
 testDir:"./tests/v6-map",testMatch:"a1.spec.mjs",timeout:45_000,
 expect:{timeout:8_000},fullyParallel:false,forbidOnly:true,retries:0,workers:1,
 reporter:[["list"],["junit",{outputFile:"test-results/v6map-a1-junit.xml"}]],
 use:{baseURL:"http://127.0.0.1:4173",trace:"retain-on-failure",screenshot:"only-on-failure",video:"off",serviceWorkers:"allow"},
 webServer:{command:"python3 -m http.server 4173 --bind 127.0.0.1",url:"http://127.0.0.1:4173/poc/v6-map-a1/index.html",reuseExistingServer:false,timeout:20_000},
 projects:[{name:"chromium-a1",use:{browserName:"chromium",viewport:{width:1280,height:860}}}]
});
