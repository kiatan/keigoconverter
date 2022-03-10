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
              console.log(i18n.resolvedLanguage);
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
      // apiResponse: [], // getKeigoDictionaries()
      apiResponse: notFound, // getKeigoDictionaries()
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
        <LoadingT />
        <div className="result">
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
    this.state = {
      sonkeigo: keigo[0].sonkeigo,
      kenjougo: keigo[0].kenjougo,
      teineigo: keigo[0].teineigo,
    };
  }
  render() {
    const { t } = this.props;

    if (!this.props.isShowResult) return null;

    if (this.props.data) {
      if (this.props.data.length === 1) {
        if (this.props.data[0].word_type === "not_found") {
          return (
            <div className="not-found">
              {t("result.not_found.title")}
              <br></br>
              {t("result.not_found.command")}
            </div>
          );
        }
      }
    }

    return (
      <div>
        <h2>{t("result.sonkeigo.title")}</h2>
        <div>{this.state.sonkeigo.word}</div>
        <div>{this.state.sonkeigo.sentence_jp}</div>
        <h2>{t("result.kenjougo.title")}</h2>
        <div>{this.state.kenjougo.word}</div>
        <div>{this.state.kenjougo.sentence_jp}</div>
        <h2>{t("result.teineigo.title")}</h2>
        <div>{this.state.teineigo.word}</div>
        <div>{this.state.teineigo.sentence_jp}</div>
      </div>
    );
  }
}

const keigo = [
  {
    plain: "する",
    sonkeigo: {
      word: "なさる",
      sentence_jp:
        "明日より熊本に出張なさるとのことで、お気をつけて行ってらっしゃいませ",
    },
    kenjougo: {
      word: "いたす",
      sentence_jp: "明日、お電話いたします",
    },
    teineigo: {
      word: "なさる",
      sentence_jp: "体調不良の方が多いため、本日の会議はリスケします",
    },
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
