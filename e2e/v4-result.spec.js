import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const order=['enhancement','transmutation','conjuration','specialization','manipulation','emission'];

test('canonical radar stays legible and collision-free at all seven widths; characters expand without changing the initial three',async({browser},info)=>{
  test.skip(info.project.name!=='desktop','Explicit mobile contexts and all widths are exercised once.');
  await mkdir('.verification/v4/phase-b',{recursive:true});
  for(const width of [320,375,390,430,768,1280,1440]){
    const page=await browser.newPage({viewport:{width,height:width<701?844:1000},isMobile:width<701,hasTouch:width<701,reducedMotion:'reduce'});
    for(const type of ['conjuration','specialization']){
      await page.goto('/review/results.html?type='+type);await page.waitForFunction(()=>window.resultsReview);
      for(const lang of ['it','en']){
        await page.locator(`[data-lang=${lang}]`).click();
        const axes=await page.locator('.radar-axis').evaluateAll(nodes=>nodes.map(el=>el.dataset.nen));expect(axes).toEqual(order);
        await expect(page.locator('.radar-explanation')).toHaveCount(0);
        const problems=await page.locator('.nen-radar').evaluate(svg=>{
          const box=svg.getBoundingClientRect(),labels=[...svg.querySelectorAll('.radar-name,.radar-value')].map(e=>({name:e.textContent,...e.getBoundingClientRect().toJSON()})),issues=[];
          for(const r of labels){
            if(r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1)issues.push('clipped '+r.name);
            if(r.height<11)issues.push('small '+r.name);
          }
          for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
            const a=labels[i],b=labels[j];if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)issues.push('overlap '+a.name+' / '+b.name);
          }
          return issues;
        });expect(problems,`${width}/${type}/${lang}`).toEqual([]);
      }
      const initial=await page.locator('.character-card:visible').evaluateAll(nodes=>nodes.map(el=>el.dataset.character));expect(initial).toHaveLength(3);
      await page.locator('[data-action=characters]').click();await expect(page.locator('.character-card:visible')).toHaveCount(5);
      expect((await page.locator('.character-card:visible').evaluateAll(nodes=>nodes.map(el=>el.dataset.character))).slice(0,3)).toEqual(initial);
      await expect(page.locator('[data-action=characters]')).toBeFocused();
      await expect(page.locator('[data-action=characters]')).toHaveAttribute('aria-expanded','true');
      await page.locator('[data-action=characters]').click();await expect(page.locator('.character-card:visible')).toHaveCount(3);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`.verification/v4/phase-b/${width}-${type}.png`,fullPage:true});
    }
    await page.close();
  }
});
