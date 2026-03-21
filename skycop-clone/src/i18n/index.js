import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import bg from './locales/bg.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import da from './locales/da.json'
import sv from './locales/sv.json'
import no from './locales/no.json'
import fi from './locales/fi.json'
import is from './locales/is.json'
import it from './locales/it.json'
import pt from './locales/pt.json'
import ptBR from './locales/pt-BR.json'
import ca from './locales/ca.json'
import ro from './locales/ro.json'
import pl from './locales/pl.json'
import cs from './locales/cs.json'
import hu from './locales/hu.json'
import hr from './locales/hr.json'
import nl from './locales/nl.json'
import sl from './locales/sl.json'
import bs from './locales/bs.json'
import et from './locales/et.json'
import lv from './locales/lv.json'
import lt from './locales/lt.json'
import ru from './locales/ru.json'
import uk from './locales/uk.json'
import sr from './locales/sr.json'
import mk from './locales/mk.json'
import el from './locales/el.json'
import tr from './locales/tr.json'
import sq from './locales/sq.json'
import hy from './locales/hy.json'
import ka from './locales/ka.json'
import he from './locales/he.json'
import ar from './locales/ar.json'
import zh from './locales/zh.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bg: { translation: bg },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
      da: { translation: da },
      sv: { translation: sv },
      no: { translation: no },
      fi: { translation: fi },
      is: { translation: is },
      it: { translation: it },
      pt: { translation: pt },
      'pt-BR': { translation: ptBR },
      ca: { translation: ca },
      ro: { translation: ro },
      pl: { translation: pl },
      cs: { translation: cs },
      hu: { translation: hu },
      hr: { translation: hr },
      nl: { translation: nl },
      sl: { translation: sl },
      bs: { translation: bs },
      et: { translation: et },
      lv: { translation: lv },
      lt: { translation: lt },
      ru: { translation: ru },
      uk: { translation: uk },
      sr: { translation: sr },
      mk: { translation: mk },
      el: { translation: el },
      tr: { translation: tr },
      sq: { translation: sq },
      hy: { translation: hy },
      ka: { translation: ka },
      he: { translation: he },
      ar: { translation: ar },
      zh: { translation: zh },
    },
    fallbackLng: 'en',
    supportedLngs: [
      'en', 'bg', 'de', 'fr', 'es',
      'da', 'sv', 'no', 'fi', 'is',
      'it', 'pt', 'pt-BR', 'ca', 'ro',
      'pl', 'cs', 'hu', 'hr', 'nl',
      'sl', 'bs', 'et', 'lv', 'lt',
      'ru', 'uk', 'sr', 'mk', 'el',
      'tr', 'sq', 'hy', 'ka', 'he',
      'ar', 'zh',
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
