// File: /app/lib/inspire.ts
// Delightful "Surprise me" theme inspirations + a tiny event bus that lets the
// empty-state card drop a fun idea into the generator's theme field without
// prop-drilling through the page layout.

export const INSPIRE_EVENT = 'coloring:inspire';

// Curated, whimsical theme prompts. They act as creative seeds for the AI
// regardless of the UI language, so a single list is intentional and acceptable.
const THEME_IDEAS = [
  'A cat astronaut baking cookies on the moon',
  'Dinosaurs throwing a birthday party',
  'A friendly robot learning to paint',
  'Unicorns running a lemonade stand',
  'A brave little snail exploring a giant garden',
  'Pirate penguins searching for hidden treasure',
  'A sleepy dragon who loves reading books',
  'Kittens building a treehouse in the clouds',
  'A wizard cat mixing colorful potions',
  'Race cars made of vegetables at the zoo',
];

let lastIndex = -1;

export function getRandomTheme(): string {
  let i = Math.floor(Math.random() * THEME_IDEAS.length);
  // Avoid repeating the immediately previous idea for a fresher feel.
  if (i === lastIndex && THEME_IDEAS.length > 1) {
    i = (i + 1) % THEME_IDEAS.length;
  }
  lastIndex = i;
  return THEME_IDEAS[i];
}

export function requestInspiration(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(INSPIRE_EVENT));
  }
}
