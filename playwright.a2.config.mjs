import { defineConfig } from "@playwright/test";
export default defineConfig({
 testDir:"./tests/v6-map",testMatch:"a2.spec.mjs",timeout:90_000,expect:{timeout:12_000},
 fullyParallel:false,forbidOnly:true,retries:0,workers:1,
 reporter:[["list"],["junit",{outputFile:"test-results/v6map-a2-junit.xml"}]],
 use:{baseURL:"http://127.0.0.1:4173",trace:"retain-on-failure",screenshot:"only-on-failure",video:"off",serviceWorkers:"allow"},
 webServer:{command:"python3 -m http.server 4173 --bind 127.0.0.1",url:"http://127.0.0.1:4173/poc/v6-map-a1/a2-validation.html",reuseExistingServer:false,timeout:20000},
 projects:[
 {name:"webkit-ipad-portrait-a2",use:{browserName:"webkit",viewport:{width:834,height:1112},hasTouch:true,isMobile:true}},
 {name:"webkit-ipad-landscape-a2",use:{browserName:"webkit",viewport:{width:1112,height:834},hasTouch:true,isMobile:true}}
 ]
});
