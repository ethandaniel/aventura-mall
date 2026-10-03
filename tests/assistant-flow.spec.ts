import { test, expect } from '@playwright/test';

async function openAssistant(page: import('@playwright/test').Page) {
  await page.goto('./');
  await page.locator('.assistant-launcher').click();
  const dialog = page.getByRole('dialog', { name: 'Ask Aventura', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Responses are scripted, not live AI');
  return dialog;
}

test('approved visitor questions return grounded suggestions and limits', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const dialog = await openAssistant(page);
  await dialog.getByRole('button', { name: 'Anniversary jewelry', exact: true }).click();
  await expect(dialog.locator('.assistant-turn').last()).toContainText('Mayors');
  await expect(dialog.locator('.assistant-turn').last()).toContainText('Cartier');
  await expect(dialog.locator('.assistant-turn').last()).toContainText('cannot check inventory');
  await dialog.getByRole('button', { name: 'Mexican food', exact: true }).click();
  const food = dialog.locator('.assistant-turn').last();
  await expect(food).toContainText('Jacinta');
  await expect(food).toContainText('Tacology Express');
  await expect(food).toContainText('Chipotle Mexican Grill');
  await expect(food.locator('.assistant-result a')).toHaveCount(3);
  await dialog.getByRole('button', { name: 'A weekend with the kids', exact: true }).click();
  const family = dialog.locator('.assistant-turn').last();
  await expect(family).toContainText('Rainbow Valley Playground');
  await expect(family).toContainText('Rooftop Games');
  await expect(family).toContainText('The Aventura Market');
  await expect(family).toContainText('cannot verify events for this weekend');
  await expect(family).toContainText('October 3, 2026');
  await page.screenshot({ path: info.outputPath('assistant-family.png'), fullPage: false });
  expect(errors).toEqual([]);
});

test('free text, repeated questions, unsafe requests and reset work', async ({ page }) => {
  const dialog = await openAssistant(page);
  const input = dialog.getByRole('textbox', { name: 'Ask about your visit' });
  const ask = dialog.getByRole('button', { name: 'Ask', exact: true });
  await ask.click();
  await expect(dialog.getByRole('status')).toHaveText('Please enter a question or choose one above.');
  for (const question of ['Where can I get tacos?', 'Where can I get tacos?']) {
    await input.fill(question); await ask.click();
    await expect(dialog.locator('.assistant-turn').last()).toContainText('Three ways to enjoy Mexican food');
  }
  await expect(dialog.locator('.assistant-turn')).toHaveCount(2);
  for (const question of ['What is the weather in Paris?', 'Does Cartier have this necklace in stock?', 'Book Jacinta for 7pm', 'Is Chipotle safe for my peanut allergy?', '<img src=x onerror=alert(1)>']) {
    await input.fill(question); await ask.click();
    await expect(dialog.locator('.assistant-turn').last()).toContainText('don’t have a verified answer');
  }
  await expect(dialog.locator('.assistant-turn img')).toHaveCount(0);
  for (let i = 0; i < 4; i++) { await input.fill('Mexican food'); await ask.click(); }
  await expect(dialog.locator('.assistant-turn')).toHaveCount(8);
  await dialog.getByRole('button', { name: 'Start over' }).click();
  await expect(dialog.locator('.assistant-turn')).toHaveCount(0);
  await expect(input).toBeFocused();
  await expect(dialog.locator('.assistant-followups')).toBeHidden();
});

test('close, reopen, keyboard focus and local navigation work', async ({ page }) => {
  const dialog = await openAssistant(page);
  const close = dialog.getByRole('button', { name: 'Close visitor assistant' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Start over' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await dialog.getByRole('button', { name: 'Mexican food', exact: true }).click();
  await close.click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.assistant-launcher')).toBeFocused();
  await page.locator('.assistant-launcher').click();
  await expect(dialog.locator('.assistant-turn')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.assistant-launcher')).toBeFocused();
  await page.locator('#assistant [data-ai-open]').click();
  const input = dialog.getByRole('textbox', { name: 'Ask about your visit' });
  await input.fill('Show the directory');
  await dialog.getByRole('button', { name: 'Ask', exact: true }).click();
  await dialog.getByRole('link', { name: 'Browse sample directory', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('#directory')).toBeInViewport();
  await page.getByRole('searchbox').fill('Apple');
  await expect(page.locator('#directory .tenant:visible')).toHaveCount(1);
});

test('responsive assistant fits narrow and enlarged text viewports', async ({ page }, info) => {
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 740 });
    const dialog = await openAssistant(page);
    await dialog.getByRole('button', { name: 'Mexican food', exact: true }).click();
    const geometry = await page.evaluate(() => {
      const d = document.querySelector<HTMLDialogElement>('#visitor-assistant')!;
      const f = document.querySelector('.assistant-form')!.getBoundingClientRect();
      return { pageFits: document.documentElement.scrollWidth <= innerWidth + 1, dialogFits: d.scrollWidth <= d.clientWidth + 1, inputVisible: f.bottom <= innerHeight + 1 && f.top >= 0 };
    });
    expect(geometry).toEqual({ pageFits: true, dialogFits: true, inputVisible: true });
    if (width === 320) await page.screenshot({ path: info.outputPath('assistant-320.png') });
    await dialog.getByRole('button', { name: 'Close visitor assistant' }).click();
  }
  await page.setViewportSize({ width: 640, height: 740 });
  await page.goto('./');
  await page.addStyleTag({ content: 'html { font-size: 200% }' });
  await page.locator('.assistant-launcher').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Mexican food', exact: true }).click();
  expect(await dialog.evaluate(d => d.scrollWidth <= d.clientWidth + 1)).toBe(true);
  await expect(dialog.getByRole('button', { name: 'Ask', exact: true })).toBeVisible();
});

test('local anchors, source URLs and privacy boundary stay valid', async ({ page }) => {
  const dialog = await openAssistant(page);
  const questionRequests: string[] = [];
  page.on('request', request => { if (['fetch', 'xhr'].includes(request.resourceType())) questionRequests.push(request.url()); });
  const input = dialog.getByRole('textbox', { name: 'Ask about your visit' });
  for (const question of ['jewelry', 'Mexican food', 'kids', 'hours', 'parking', 'art', 'directory', 'unsupported']) {
    await input.fill(question); await dialog.getByRole('button', { name: 'Ask', exact: true }).click();
  }
  const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')!));
  const anchors = links.filter(href => href.startsWith('#'));
  for (const href of new Set(anchors)) expect(await page.locator(href).count()).toBe(1);
  const external = [...new Set(links.filter(href => href.startsWith('https://aventuramall.com/')))];
  expect(external).toContain('https://aventuramall.com/dining/jacinta/');
  expect(external).toContain('https://aventuramall.com/experiences/');
  for (const url of external) expect(new URL(url).hostname).toBe('aventuramall.com');
  expect(questionRequests).toEqual([]);
  const storage = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }));
  expect(storage).toEqual({ local: 0, session: 0 });
  await page.reload();
  await page.locator('.assistant-launcher').click();
  await expect(page.locator('.assistant-turn')).toHaveCount(0);
});


test('mobile menu launches the assistant and returns focus on Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile menu entry');
  await page.goto('./');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const launch = page.locator('#main-nav [data-ai-open]');
  await launch.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(launch).toBeFocused();
  await page.getByRole('link', { name: 'Store directory', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).not.toBeVisible();
  await expect(page.locator('#directory')).toBeInViewport();
});
