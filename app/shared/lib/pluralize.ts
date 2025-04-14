const pluralRules = new Intl.PluralRules("ru-RU");

type PluralRule = "one" | "few" | "many" | "other";

interface WordForms {
  one: string;
  few: string;
  many: string;
  other?: string;
}

export function pluralize(number: number, forms: WordForms): string;
export function pluralize(
  number: number,
  forms: [string, string, string],
): string;

export function pluralize(
  number: number,
  forms: WordForms | [string, string, string],
): string {
  const category = pluralRules.select(number) as PluralRule;

  if (Array.isArray(forms)) {
    const [one, few, many] = forms;
    const wordForms: WordForms = { one, few, many };
    return `${number} ${wordForms[category] || wordForms.many}`;
  }

  return `${number} ${forms[category] || forms.many}`;
}
