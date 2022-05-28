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
            sample_sentences: "Example Sentences:",
            no_sentences: {
              info: "Sorry, we don't have an example sentence yet for this word.",
              contribute: "Your contribution will be highly appreciated",
              action: "Submit a sentence",
              sentence: "Example sentence in Japanese",
              sentence_en: "Optional English translation",
              submit: "Submit",
              cancel: "Cancel",
              submit_for: "Write a sentence for: ",
              another: "Add another sentence"
            },
            not_found: {
              title: "Sorry, your input is not found in our database (｡╯︵╰｡)",
              command:
                "Please try again with a different word or submit to our database.",
            },
            plain: {
              title: "Plain Form",
              description: "Plain description",
            },
            honorific: {
              title: "Honorific Form",
              description:
                "It is a special form or alternative word used when talking about superiors and customers. It is not used to talk about oneself. ",
            },
            humble: {
              title: "Humble Form",
              description:
                "It is used when describing one's actions or the actions of a person in one's in-group to others such as customers in business. Humble language tends to imply that one's actions are taking place in order to assist the other person.",
            },
            polite: {
              title: "Polite Form",
              description:
                "Polite language can be used to refer to one's own actions or those of other people.",
            },
            bikago: {
              title: "Bikago",
              description:
                "Embellishment of words. Bika means beautification. Bikago, at its basic understanding, is making one's speech sound more refined. Bikago elevates one's speech to a well-mannered style.",
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
            no_sentences: {
              info: "申し訳ありませんが、この単語の例文はまだありません。",
              contribute: "",
              action: "例文を提出",
              sentence: "例文",
              submit: "提出",
              cancel: "キャンセル",
              submit_for: "この単語: ",
              another: "例文を追加"
            },
            not_found: {
              title:
                "申し訳ありませんが、入力はデータベースに見つかりません (｡╯︵╰｡)",
              command:
                "別の言葉でもう一度試すか、データベースに送信してください。",
            },
            plain: {
              title: "普通",
              description: "普通 description",
            },
            honorific: {
              title: "尊敬語",
              description:
                "目上の人を敬う気持ちを表す表現の敬語です。謙譲語が相手に対して自分がへりくだる表現であるのに対し、尊敬語は相手を持ち上げることで、敬う気持ちを示します。",
            },
            humble: {
              title: "謙譲語",
              description:
                "目上の人を敬う気持ちを表す表現の敬語です。尊敬語が相手を持ち上げる表現であるのに対し、謙譲語は、自分がへりくだることで、敬う気持ちを示します。",
            },
            polite: {
              title: "丁寧語",
              description:
                "相手に対する言い回しを丁寧にすることで、敬意を表す言葉です。尊敬語や謙譲語のように相手を立てたり、自分を下げたりすることはしません。",
            },
            bikago: {
              title: "美化後",
              description:
                "上品で美しい言葉遣いをするために使う表現のことです。ときにはその表現をやらわげるといった役割も果たします。人への敬意を表す表現ではありませんが、日本語では敬語に準ずるとしています。",
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
