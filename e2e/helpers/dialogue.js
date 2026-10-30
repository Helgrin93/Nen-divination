import {expect} from '@playwright/test';

// Short reactions cannot be skipped. Important explanations wait for the player.
export async function finishDialogue(page){
  if(await page.locator('[data-dialogue=short]').count())await expect(page.locator('[data-dialogue=short]')).toHaveCount(0,{timeout:5000});
  if(await page.locator('[data-dialogue=important]').count())await page.locator('[data-action=resume]').click();
}
export async function finishRevelation(page){
  await page.locator('[data-dialogue=important][data-kind=revealed]').waitFor({timeout:12000});
  await page.locator('[data-action=resume]').click();
}
