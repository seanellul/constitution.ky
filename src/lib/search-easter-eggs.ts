export interface EasterEgg {
  message: string;
  linkTo?: string;
  linkLabel?: string;
}

interface EasterEggRule {
  triggers: RegExp;
  egg: EasterEgg;
}

const rules: EasterEggRule[] = [
  {
    triggers: /\b(lord|mckeeva|lord mckeeva bush|mckeeva bush)\b/i,
    egg: {
      message:
        "No constitutional office of 'Lord' is established under the Cayman Islands Constitution. You may be interested in:",
      linkTo: '/constitution/chapter/1/article/19',
      linkLabel: 'Section 19 — Right to participate in government',
    },
  },
  {
    triggers: /\b(who wrote this|who made this|who built this)\b/i,
    egg: {
      message: 'This platform was built by citizens, for citizens.',
      linkTo: '/about',
      linkLabel: 'About this project',
    },
  },
  {
    triggers: /\b(meaning of life)\b|^42$/i,
    egg: {
      message:
        'The answer you seek may not be in the Constitution — but Section 9 (Right to life) is a good start.',
      linkTo: '/constitution/chapter/1/article/9',
      linkLabel: 'Section 9 — Right to life',
    },
  },
  {
    triggers: /\b(how to become premier|how to be premier)\b/i,
    egg: {
      message: 'The path to becoming Premier is outlined in:',
      linkTo: '/constitution/chapter/5/article/49',
      linkLabel: 'Section 49 — Appointment of Premier',
    },
  },
];

function getLateNightEgg(): EasterEgg | null {
  if (typeof window === 'undefined') return null;
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) {
    return {
      message: 'Late-night constitutional research. The Founders would be proud.',
    };
  }
  return null;
}

export function matchEasterEgg(query: string): EasterEgg | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  for (const rule of rules) {
    if (rule.triggers.test(trimmed)) {
      return rule.egg;
    }
  }

  return getLateNightEgg();
}
