import {test,expect} from '@playwright/test';
import {finishDialogue,finishRevelation} from './helpers/dialogue.js';

test('short comments are separate, last three seconds and preserve decoded Wing; important dialogue waits',async({page})=>{
  await page.goto('/');await page.locator('.wing-sprite[data-ready=true]').first().waitFor();
  await page.locator('[data-action=begin]').click();
  const seen=[];
  for(let n=0;n<4;n++){
    await finishDialogue(page);
    await expect(page.locator('.wing-reaction,.bonus-dialogue')).toHaveCount(0);
    await page.locator('.answer').first().click();await page.locator('[data-action=next]').click();
    if(n===1||n===3){
      const interlude=page.locator('[data-dialogue=short]');await expect(interlude).toBeVisible();
      await expect(interlude.locator('button')).toHaveCount(0);await expect(page.locator('.question-title,.answer')).toHaveCount(0);
      seen.push(await interlude.getAttribute('data-reaction'));
      await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-ready','true');
      await page.waitForTimeout(1800);await expect(interlude).toBeVisible();
      await page.getByRole('button',{name:'English',exact:true}).click();
      await expect(interlude).toHaveCount(0,{timeout:2200});
      await page.getByRole('button',{name:'Italiano',exact:true}).click();
    }
  }
  expect(seen[0]).not.toBe(seen[1]);
  for(let n=4;n<9;n++){
    await finishDialogue(page);if(await page.locator('.hold-button').count())break;
    await page.locator('.answer').first().click();await page.locator('[data-action=next]').click();
    if(await page.locator('[data-dialogue=important]').count()){
      const kind=await page.locator('.interlude').getAttribute('data-kind');
      await page.waitForTimeout(3200);await expect(page.locator('.interlude')).toHaveAttribute('data-kind',kind);
    }
  }
  await finishDialogue(page);await expect(page.locator('.hold-button')).toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-action=reveal]').click();
  await finishRevelation(page);await expect(page.locator('.nen-title')).toBeVisible();
});
