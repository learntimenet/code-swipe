import type { Lang } from '../i18n/strings';

export type CodeLang = 'Python' | 'JavaScript';

export type Card = {
  id: string;
  lang: CodeLang;
  /** true if the code runs without error */
  valid: boolean;
  code: string;
  explanation: Record<Lang, string>;
};

export const CARDS: Card[] = [
  {
    id: 'py-len',
    lang: 'Python',
    valid: true,
    code: 'nums = [1, 2, 3]\nprint(len(nums))',
    explanation: {
      fr: 'len() renvoie la taille de la liste : le programme affiche 3.',
      en: 'len() returns the list size: the program prints 3.',
    },
  },
  {
    id: 'py-paren',
    lang: 'Python',
    valid: false,
    code: 'name = "Léa"\nprint("Hi " + name',
    explanation: {
      fr: 'Il manque la parenthèse fermante de print( → SyntaxError.',
      en: 'The closing parenthesis of print( is missing → SyntaxError.',
    },
  },
  {
    id: 'js-const',
    lang: 'JavaScript',
    valid: false,
    code: 'const x = 5;\nx = 10;\nconsole.log(x);',
    explanation: {
      fr: 'Une constante (const) ne peut pas être réassignée → TypeError.',
      en: 'A const cannot be reassigned → TypeError.',
    },
  },
  {
    id: 'js-loop',
    lang: 'JavaScript',
    valid: true,
    code: 'let total = 0;\nfor (let i = 0; i < 3; i++) {\n  total += i;\n}\nconsole.log(total);',
    explanation: {
      fr: 'La boucle additionne 0 + 1 + 2 : affiche 3.',
      en: 'The loop adds 0 + 1 + 2: prints 3.',
    },
  },
  {
    id: 'py-colon',
    lang: 'Python',
    valid: false,
    code: 'age = 18\nif age >= 18\n    print("OK")',
    explanation: {
      fr: 'Il manque les deux-points « : » après la condition du if.',
      en: 'The colon ":" after the if condition is missing.',
    },
  },
  {
    id: 'py-index',
    lang: 'Python',
    valid: false,
    code: 'items = ["a", "b"]\nprint(items[2])',
    explanation: {
      fr: 'La liste a 2 éléments (index 0 et 1) : items[2] → IndexError.',
      en: 'The list has 2 items (index 0 and 1): items[2] → IndexError.',
    },
  },
];
