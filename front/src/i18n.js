import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          title: "Keigo Converter",
          lang: {
            ja: "JA",
            en: "EN",
          },
          input: "Type your word here",
          result: {
            show: "Convert to Keigo",
            sample_sentences: "Sample Sentences:",
            not_found: {
              title: "Sorry, your input is not found in our database (｡╯︵╰｡)",
              command:
                "Please try again with a different word or submit to our database.",
            },
            plain: {
              title: "Plain Form",
            },
            sonkeigo: {
              title: "Honorific Form",
            },
            kenjougo: {
              title: "Humble Form",
            },
            teineigo: {
              title: "Polite Form",
            },
          },
          loading: {
            normal: "Loading...",
            polite: "今しばらくお待ちください。",
          },
        },
      },
      ja: {
        translation: {
          title: "敬語コンバーター",
          lang: {
            ja: "JA",
            en: "EN",
          },
          input: "言葉を入力してください",
          result: {
            show: "切り替える",
            sample_sentences: "例文",
            not_found: {
              title:
                "申し訳ありませんが、入力はデータベースに見つかりません (｡╯︵╰｡)",
              command:
                "別の言葉でもう一度試すか、データベースに送信してください。",
            },
            plain: {
              title: "普通",
            },
            sonkeigo: {
              title: "尊敬語",
            },
            kenjougo: {
              title: "謙譲語",
            },
            teineigo: {
              title: "丁寧語",
            },
          },
          loading: {
            normal: "ちょっと待って！",
            polite: "今しばらくお待ちください。",
          },
        },
      },
    },
  });

export default i18n;
