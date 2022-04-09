import logo from "./logo.png";
import "./App.css";
import React from "react";
import Typewriter from "typewriter-effect";
import { useTranslation, withTranslation } from "react-i18next";

const lngs = {
  en: { nativeName: "English" },
  ja: { nativeName: "Japanese" },
};

function App() {
  const { t, i18n } = useTranslation();
  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-group">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="title">{t("title")}</p>
        </div>
        <div className="switch">
          <input
            id="language-toggle"
            className="check-toggle check-toggle-round-flat"
            type="checkbox"
            onClick={() => {
              i18n.changeLanguage(
                i18n.resolvedLanguage === Object.keys(lngs)[0]
                  ? Object.keys(lngs)[1]
                  : Object.keys(lngs)[0]
              );
            }}
            defaultChecked={i18n.resolvedLanguage === Object.keys(lngs)[0]}
          />
          <label htmlFor="language-toggle"></label>
          <span className="on">{t("lang.ja")}</span>
          <span className="off">{t("lang.en")}</span>
        </div>
      </header>
      <KeigoConverterT class="keigo-converter" />
    </div>
  );
}

class KeigoConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isShowResult: false, userInput: "", apiResponse: [] };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      userInput: event.target.value,
    });
  }

  handleSubmit(event) {
    console.log("A word was submitted: " + this.state.userInput);
    event.preventDefault();
    this.setState((prevState) => ({
      isShowResult: !prevState.isShowResult,
      // apiResponse: [],
      // apiResponse: notFound,
      // apiResponse: exactVerb,
      apiResponse: exactBikago,
    }));
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            className="input"
            type="text"
            name="word"
            placeholder={t("input")}
            onChange={this.handleChange}
          />
          <input
            className="input-button"
            type="submit"
            value={t("result.show")}
          />
        </form>
        {/* <LoadingT /> */}
        <div className="results">
          <ResultT
            isShowResult={this.state.isShowResult}
            data={this.state.apiResponse}
          />
        </div>
      </div>
    );
  }
}

class Result extends React.Component {
  constructor(props) {
    super(props);
  }

  buildSentenceDOM(word_sentence, language) {
    var sentenceDOM = [];
    const className = word_sentence.form + "-sentence word-sentence-sentence";
    for (const [index, sentence] of word_sentence.sentences.entries()) {
      if (language === "en") {
        sentenceDOM.push(
          <li key={index} className={className}>
            <div>{sentence.sentence_ja}</div>
            <div>{sentence.sentence_en}</div>
          </li>
        );
      } else {
        sentenceDOM.push(
          <li key={index} className={className}>
            <div>{sentence.sentence_ja}</div>
          </li>
        );
      }
    }
    return sentenceDOM;
  }

  render() {
    const { t } = this.props;

    if (!this.props.isShowResult) return null;

    if (this.props.data) {
      let ret = [];
      for (const data of this.props.data) {
        if (data.word_type === "not_found") {
          ret = (
            <div className="not-found">
              {t("result.not_found.title")}
              <br></br>
              {t("result.not_found.command")}
            </div>
          );
        }

        if (data.word_type === "exact_verb") {
          const plain = data.word_sentences.find((plain) => {
            return plain.form === "plain";
          });
          const polite = data.word_sentences.find((polite) => {
            return polite.form === "polite";
          });
          const honorific = data.word_sentences.find((honorific) => {
            return honorific.form === "honorific";
          });
          const humble = data.word_sentences.find((humble) => {
            return humble.form === "humble";
          });

          var plain_sentences = this.buildSentenceDOM(
            plain,
            this.props.i18n.language
          );
          var humble_sentences = this.buildSentenceDOM(
            humble,
            this.props.i18n.language
          );
          var honorific_sentences = this.buildSentenceDOM(
            honorific,
            this.props.i18n.language
          );
          var polite_sentences = this.buildSentenceDOM(
            polite,
            this.props.i18n.language
          );

          ret.push(
            <div className="result">
              <div className="word-sentence">
                <div className="word-sentence-title">
                  {t("result.plain.title")}
                  <span className="word-sentence-description">
                    {t("result.plain.description")}
                  </span>
                </div>
                <div className="word-sentence-word">{plain.word}</div>
                <div className="sentences-label">
                  {t("result.sample_sentences")}
                </div>
                <ol className="word-sentence-sentences">{plain_sentences}</ol>
              </div>
              <div className="word-sentence">
                <div className="word-sentence-title">
                  {t("result.sonkeigo.title")}
                  <span className="word-sentence-description">
                    {t("result.sonkeigo.description")}
                  </span>
                </div>
                <div className="word-sentence-word">{honorific.word}</div>
                <div className="sentences-label">
                  {t("result.sample_sentences")}
                </div>
                <ol className="word-sentence-sentences">
                  {honorific_sentences}
                </ol>
              </div>
              <div className="word-sentence">
                <div className="word-sentence-title">
                  {t("result.kenjougo.title")}
                  <span className="word-sentence-description">
                    {t("result.kenjougo.description")}
                  </span>
                </div>
                <div className="word-sentence-word">{humble.word}</div>
                <div className="sentences-label">
                  {t("result.sample_sentences")}
                </div>
                <ol className="word-sentence-sentences">{humble_sentences}</ol>
              </div>
              <div className="word-sentence">
                <div className="word-sentence-title">
                  {t("result.teineigo.title")}
                  <span className="word-sentence-description">
                    {t("result.teineigo.description")}
                  </span>
                </div>
                <div className="word-sentence-word">{polite.word}</div>
                <div className="sentences-label">
                  {t("result.sample_sentences")}
                </div>
                <ol className="word-sentence-sentences">{polite_sentences}</ol>
              </div>
            </div>
          );
        }

        if (data.word_type === "exact_bikago") {
          const polite = data.word_sentences.find((polite) => {
            return polite.form === "polite";
          });

          ret.push(
            <div className="result">
              <div className="word-sentence">
                <div className="word-sentence-title">
                  {t("result.bikago.title")}
                  <span className="word-sentence-description">
                    {t("result.bikago.description")}
                  </span>
                </div>
                <div className="word-sentence-word">{polite.word}</div>
              </div>
            </div>
          );
        }
      }

      return ret;
    }

    return (
      <div className="not-found">
        {t("result.not_found.title")}
        <br></br>
        {t("result.not_found.command")}
      </div>
    );
  }
}

const exactVerb = [
  {
    word_type: "exact_verb",
    meaning: "",
    word_sentences: [
      {
        form: "plain",
        word: "する",
        sentences: [
          {
            sentence_ja: "するsentence_ja",
            sentence_en: "するsentence_en",
          },
        ],
      },
      {
        form: "polite",
        word: "いたす",
        sentences: [
          {
            sentence_ja: "明日、お電話いたします",
            sentence_en: "I'll call you tomorrow",
          },
          {
            sentence_ja: "明日、お電話いたします2",
            sentence_en: "I'll call you tomorrow2",
          },
        ],
      },
      {
        form: "honorific",
        word: "なさる",
        sentences: [
          {
            sentence_ja:
              "明日より熊本に出張なさるとのことで、お気をつけて行ってらっしゃいませ",
            sentence_en:
              "I heard that you will be on a business trip to Kumamoto from tomorrow, so please be careful.",
          },
        ],
      },
      {
        form: "humble",
        word: "なさる",
        sentences: [
          {
            sentence_ja: "体調不良の方が多いため、本日の会議はリスケします",
            sentence_en:
              "Today's meeting will be rescheduled because there are many people who are not feeling well.",
          },
        ],
      },
    ],
  },
  {
    word_type: "exact_verb",
    meaning: "",
    word_sentences: [
      {
        form: "plain",
        word: "する",
        sentences: [
          {
            sentence_ja: "するsentence_ja",
            sentence_en: "するsentence_en",
          },
        ],
      },
      {
        form: "polite",
        word: "いたす",
        sentences: [
          {
            sentence_ja: "明日、お電話いたします",
            sentence_en: "I'll call you tomorrow",
          },
          {
            sentence_ja: "明日、お電話いたします2",
            sentence_en: "I'll call you tomorrow2",
          },
        ],
      },
      {
        form: "honorific",
        word: "なさる",
        sentences: [
          {
            sentence_ja:
              "明日より熊本に出張なさるとのことで、お気をつけて行ってらっしゃいませ",
            sentence_en:
              "I heard that you will be on a business trip to Kumamoto from tomorrow, so please be careful.",
          },
        ],
      },
      {
        form: "humble",
        word: "なさる",
        sentences: [
          {
            sentence_ja: "体調不良の方が多いため、本日の会議はリスケします",
            sentence_en:
              "Today's meeting will be rescheduled because there are many people who are not feeling well.",
          },
        ],
      },
    ],
  },
];

const exactBikago = [
  {
    word_type: "exact_bikago",
    meaning: "",
    word_sentences: [
      {
        form: "plain",
        word: "家族",
      },
      {
        form: "polite",
        word: "ご家族",
      },
    ],
  },
];

const notFound = [
  {
    word_type: "not_found",
    meaning: "",
    word_sentences: [],
  },
];

class Loading extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div className="loading">
        <div>(:3 っ)っ</div>
        <Typewriter
          options={{
            cursor: "",
            wrapperClassName: "loading-text",
            cursorClassName: "loading-cursor",
            loop: true,
            delay: 80,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString(t("loading.normal"))
              .pauseFor(500)
              .deleteAll()
              .typeString(t("loading.polite"))
              .pauseFor(500)
              .deleteAll()
              .start();
          }}
        />
      </div>
    );
  }
}

export default App;
const KeigoConverterT = withTranslation()(KeigoConverter);
const ResultT = withTranslation()(Result);
const LoadingT = withTranslation()(Loading);
