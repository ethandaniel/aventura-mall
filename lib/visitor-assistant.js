// A deterministic concept demo. No model, remote requests, storage or tracking.
const checked = 'Information snapshot checked October 3, 2026. Confirm with the mall before visiting.';
const source = (title, url) => ({ title, url });
const visit = source('Official visitor information', 'https://aventuramall.com/visit/');
const experiences = source('Official experiences', 'https://aventuramall.com/experiences/');
const shops = source('Official shopping directory', 'https://aventuramall.com/shops/');
const dining = source('Official dining directory', 'https://aventuramall.com/dining/');
const card = (title, text, link) => ({ title, text, link });
const answers = {
  jewelry: {
    heading: 'A thoughtful anniversary gift',
    text: 'Mayors is a starting point for fine jewelry. Cartier is also named in the mall’s shopping directory. These are suggestions to explore, not a complete list or a guarantee of stock or price.',
    cards: [card('Mayors', 'Explore fine jewelry and timepieces, then ask the store about pieces that fit your occasion and budget.', source('View Mayors on the official site', 'https://aventuramall.com/shops/mayors/')), card('Explore more jewelry', 'Use the full shopping directory to compare jewelers, including Cartier. Confirm availability directly with the retailer.', shops)],
    note: 'This demo cannot check inventory, pricing, engraving or store appointments.'
  },
  mexican: {
    heading: 'Three ways to enjoy Mexican food',
    text: 'For a meal together, explore Jacinta. For a casual food hall stop, compare Tacology Express and Chipotle Mexican Grill. The official directory lists all three.',
    cards: [card('Jacinta', 'Mexican cuisine with a contemporary dining approach.', source('View Jacinta on the official site', 'https://aventuramall.com/dining/jacinta/')), card('Tacology Express', 'Tacos and other Mexican dishes in Treats Food Hall.', source('View Tacology Express on the official site', 'https://aventuramall.com/dining/tacology/')), card('Chipotle Mexican Grill', 'Customizable burritos, bowls and tacos in Treats Food Hall.', source('View Chipotle on the official site', 'https://aventuramall.com/dining/chipotlemexicangrill/'))],
    note: 'Check menus and restaurant hours before you go. This demo cannot confirm wait times, reservations, prices or dietary safety.'
  },
  family: {
    heading: 'A little play, a little discovery',
    text: 'Start with Rainbow Valley Playground, then explore the Rooftop Games or The Aventura Market. This is a suggested day plan based on published experiences, not a confirmed schedule for your weekend.',
    cards: [card('Rainbow Valley Playground', 'An indoor play experience designed by FriendsWithYou. Check suitability, rules and operating details with the mall.', experiences), card('Rooftop Games', 'The rooftop outside Treats Food Hall has games including giant chess, checkers and ping pong.', experiences), card('The Aventura Market', 'Explore food and local makers. Confirm the market’s upcoming schedule on the official site.', experiences)],
    note: 'I cannot verify events for this weekend or cancellations. Confirm upcoming activities with the mall before you travel.'
  },
  hours: {
    heading: 'Check the hours for your visit',
    text: 'Opening hours and holiday exceptions can change. Individual stores, restaurants and attractions may follow different schedules, so I won’t claim they are open now.',
    cards: [card('Plan your visit', 'Use the official hours and contact information for the day you plan to visit.', visit)],
    note: 'This is a dated snapshot, not a live opening status service.'
  },
  access: {
    heading: 'Make your arrival easier',
    text: 'The mall’s visitor page brings together parking, valet, transportation and concierge information. Check with concierge for accessibility needs and suitable routes.',
    cards: [card('Parking & visitor services', 'Review the official visitor information before setting out. I cannot provide a verified indoor route or live parking availability.', visit)],
    note: 'For assistance during your visit, use the mall’s official concierge information. This demo does not contact staff.'
  },
  art: {
    heading: 'Leave room for a little art',
    text: 'Explore the mall’s published experiences, including the LOVE sculpture, Walking Figure and the koi pond. Choose a few stops to make your own art stroll.',
    cards: [card('Art & experiences', 'Read the official descriptions and check access details before your visit.', experiences)],
    note: 'Attraction access and schedules may change. This demo does not verify today’s conditions.'
  },
  directory: {
    heading: 'Find your next stop',
    text: 'Browse the sample directory here for shopping and dining inspiration, or use the official directories for the full listings.',
    cards: [card('Explore this demo’s directory', 'Six illustrative listings with search and category filters.', source('Browse sample directory', '#directory')), card('Full shopping directory', 'Confirm the retailer you’re looking for on the official mall website.', shops), card('Full dining directory', 'Explore the mall’s published dining options.', dining)],
    note: 'The six records on this concept page are sample content, separate from the assistant’s checked source snapshot.'
  },
  fallback: {
    heading: 'Let’s find a reliable next step',
    text: 'I don’t have a verified answer to that in this small demo. Try anniversary jewelry, Mexican food, kids’ activities, art, hours or parking. For anything else, check the official directory or concierge information.',
    cards: [card('Official mall information', 'Use the mall website for current information and concierge contact details.', visit)],
    note: 'I cannot check live inventory or events, make bookings, handle payments, or answer personal, medical or safety questions.'
  }
};

export function resolveVisitorQuestion(question) {
  const q = question.normalize('NFKD').toLowerCase().replace(/[’']/g, '');
  // Unsupported requests take precedence even if a supported topic is named.
  if (/\b(stock|inventory|available now|availability|price|cost|cheapest|wait time|book|reserve|reservation|payment|buy for me|allerg|safe to eat|medical|emergency|credit card|password|ignore|system prompt|translate|flight|weather)\b/.test(q) || /allerg|in stock|real.?time|live events/.test(q)) return [answers.fallback];
  const result = [];
  if (/\b(jewelry|jewellery|jeweler|jeweller|anniversary|mayors|cartier|necklace|earrings|bracelet)\b/.test(q)) result.push(answers.jewelry);
  if (/\b(mexican|taco|tacos|burrito|burritos|jacinta|tacology|chipotle)\b/.test(q)) result.push(answers.mexican);
  if (/\b(kids|kid|children|child|family|weekend|events|event|playground|rainbow|market)\b/.test(q)) result.push(answers.family);
  if (/\b(hours|hour|open|opening|close|closing|holiday)\b/.test(q)) result.push(answers.hours);
  if (/\b(parking|park|valet|wheelchair|accessibility|accessible|concierge|directions|transportation)\b/.test(q)) result.push(answers.access);
  if (/\b(art|artwork|sculpture|culture|koi)\b/.test(q)) result.push(answers.art);
  if (!result.length && /\b(shop|shopping|store|stores|directory|dining|food|restaurant|restaurants|apple|nordstrom|bloomingdales|serafina|peruvian|tap 42)\b/.test(q)) result.push(answers.directory);
  return result.length ? result : [answers.fallback];
}

export function mountVisitorAssistant(root) {
  const dialog = root.querySelector('#visitor-assistant');
  const input = root.querySelector('#assistant-question');
  const log = root.querySelector('.assistant-log');
  const scroller = root.querySelector('.assistant-scroll');
  const followups = root.querySelector('.assistant-followups');
  const validation = root.querySelector('#assistant-validation');
  const listeners = [];
  let opener;
  let oldOverflow;
  const on = (el, name, fn) => { el.addEventListener(name, fn); listeners.push(() => el.removeEventListener(name, fn)); };
  const element = (tag, className, text) => { const el = document.createElement(tag); el.className = className; if (text) el.textContent = text; return el; };
  const open = event => {
    if (dialog.open) return;
    opener = event.currentTarget;
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('[data-ai-close]').focus({ preventScroll: true });
  };
  const close = () => dialog.close();
  on(dialog, 'close', () => { document.body.style.overflow = oldOverflow ?? ''; opener?.focus({ preventScroll: true }); });
  on(dialog, 'click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } });
  root.querySelectorAll('[data-ai-open]').forEach(button => on(button, 'click', open));
  on(dialog.querySelector('[data-ai-close]'), 'click', close);
  on(dialog, 'keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button, input, a[href]')].filter(el => !el.disabled && el.getClientRects().length);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const ask = question => {
    const text = question.trim().slice(0, 300);
    if (!text) { validation.textContent = 'Please enter a question or choose one above.'; input.focus(); return; }
    validation.textContent = '';
    const turn = element('article', 'assistant-turn');
    const user = element('p', 'assistant-user', text);
    user.setAttribute('aria-label', 'Your question: ' + text);
    turn.append(user);
    resolveVisitorQuestion(text).forEach(answer => {
      const response = element('div', 'assistant-answer');
      response.append(element('span', 'assistant-answer-label', 'AVENTURA · DEMO RESPONSE'), element('h3', '', answer.heading), element('p', '', answer.text));
      const cards = element('div', 'assistant-results');
      answer.cards.forEach(item => {
        const result = element('div', 'assistant-result');
        result.append(element('h4', '', item.title), element('p', '', item.text));
        const link = element('a', '', item.link.title);
        link.href = item.link.url;
        if (item.link.url.startsWith('#')) on(link, 'click', () => { close(); root.querySelector(item.link.url)?.scrollIntoView(); });
        else { link.target = '_blank'; link.rel = 'noopener noreferrer'; link.append(element('span', 'sr-only', ', opens in a new tab')); }
        result.append(link); cards.append(result);
      });
      response.append(cards, element('p', 'assistant-note', answer.note), element('p', 'assistant-freshness', checked));
      turn.append(response);
    });
    log.append(turn);
    // Bound the temporary transcript without collecting or persisting it.
    while (log.children.length > 8) log.firstElementChild.remove();
    followups.hidden = false;
    input.value = '';
    requestAnimationFrame(() => { scroller.scrollTop = user.offsetTop - scroller.offsetTop - 12; });
  };
  on(root.querySelector('.assistant-form'), 'submit', event => { event.preventDefault(); ask(input.value); });
  root.querySelectorAll('[data-ai-question]').forEach(button => on(button, 'click', () => ask(button.dataset.aiQuestion)));
  on(root.querySelector('[data-ai-reset]'), 'click', () => { log.replaceChildren(); followups.hidden = true; validation.textContent = ''; input.value = ''; scroller.scrollTop = 0; input.focus(); });
  return () => { if (dialog.open) dialog.close(); document.body.style.overflow = oldOverflow ?? document.body.style.overflow; listeners.forEach(remove => remove()); };
}
