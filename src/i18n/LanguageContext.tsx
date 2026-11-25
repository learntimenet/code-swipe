import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { strings, type Lang, type Strings } from './strings';

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Strings;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** French if the device is set to French, English otherwise. */
function detectDeviceLang(): Lang {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    return locale.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  } catch {
    return 'fr';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectDeviceLang);
  const value = useMemo(() => ({ lang, setLang, t: strings[lang] }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
