import logo from "./logo.png";
import "./App.css";
import React from "react";
import Typewriter from "typewriter-effect";
import { useTranslation, withTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
      apiResponse: exactVerb,
      // apiResponse: exactBikago,
      // apiResponse: exactNoun,
      // apiResponse: formulaVerb,
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

  buildWordSentenceDOM(word_type, word_sentences, language) {
    const { t } = this.props;
    var wordSentenceDOM = [];
    var wordSentenceContent = [];

    for (const [index, word_sentence] of word_sentences.entries()) {
      if (!word_sentence.sentences.length && word_type !== "formula_verb") {
        wordSentenceContent.push(
          <div key={index + "-word-sentence"}>
            <div className="word-sentence-word">{word_sentence.word}</div>
            <div className="sentences-no">{t("result.no_sentences.info")}</div>
            <div className="sentences-no">
              {t("result.no_sentences.contribute")}
            </div>
            <div className="sentences-no-action">
              <FormDialogT wordSentence={word_sentence} />
            </div>
          </div>
        );
      } else if (word_type === "formula_verb") {
        wordSentenceContent.push(
          <div key={index + "-word-sentence"}>
            <div className="word-sentence-word">{word_sentence.word}</div>
          </div>
        );
      } else {
        wordSentenceContent.push(
          <div key={index + "-word-sentence"}>
            <div className="word-sentence-word">{word_sentence.word}</div>
            <div className="sentences-label">
              {t("result.sample_sentences")}
            </div>
            <ol className="word-sentence-sentences">
              {this.buildSentenceDOM(word_sentence, language)}
            </ol>
          </div>
        );
      }
      if (index < word_sentences.length - 1)
        wordSentenceContent.push(
          <hr key={index + "-word-sentence" + "-hr"}></hr>
        );
    }

    wordSentenceDOM.push(
      <div
        className="word-sentence"
        key={word_sentences[0].form + "-word-sentence"}
      >
        <div className="word-sentence-title">
          {t("result." + word_sentences[0].form + ".title")}
          <span className="word-sentence-description">
            {t("result." + word_sentences[0].form + ".description")}
          </span>
        </div>
        {wordSentenceContent}
      </div>
    );

    return wordSentenceDOM;
  }

  buildSentenceDOM(word_sentence, language) {
    var sentenceDOM = [];
    const className = word_sentence.form + "-sentence word-sentence-sentence";
    for (const [index, sentence] of word_sentence.sentences.entries()) {
      if (language === "en") {
        sentenceDOM.push(
          <li key={index + "-sentence"} className={className}>
            <div>{sentence.sentence_ja}</div>
            <div>{sentence.sentence_en}</div>
          </li>
        );
      } else {
        sentenceDOM.push(
          <li key={index + "-sentence"} className={className}>
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
      for (const [index, data] of this.props.data.entries()) {
        if (data.word_type === "not_found") {
          ret = (
            <div className="not-found">
              {t("result.not_found.title")}
              <br></br>
              {t("result.not_found.command")}
            </div>
          );
        }

        if (
          data.word_type === "exact_verb" ||
          data.word_type === "exact_noun" ||
          data.word_type === "formula_verb"
        ) {
          const plain = data.word_sentences.filter((plain) => {
            return plain.form === "plain";
          });
          const polite = data.word_sentences.filter((polite) => {
            return polite.form === "polite";
          });
          const honorific = data.word_sentences.filter((honorific) => {
            return honorific.form === "honorific";
          });
          const humble = data.word_sentences.filter((humble) => {
            return humble.form === "humble";
          });

          var plain_sentences = plain.length
            ? this.buildWordSentenceDOM(
                data.word_type,
                plain,
                this.props.i18n.language
              )
            : null;
          var humble_sentences = humble.length
            ? this.buildWordSentenceDOM(
                data.word_type,
                humble,
                this.props.i18n.language
              )
            : null;
          var honorific_sentences = honorific.length
            ? this.buildWordSentenceDOM(
                data.word_type,
                honorific,
                this.props.i18n.language
              )
            : null;
          var polite_sentences = polite.length
            ? this.buildWordSentenceDOM(
                data.word_type,
                polite,
                this.props.i18n.language
              )
            : null;

          ret.push(
            <div className="result" key={index + "-result"}>
              {plain_sentences}
              {honorific_sentences}
              {humble_sentences}
              {polite_sentences}
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

class FormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      setOpen: false,
      requestBody: {
        form: this.props.wordSentence.form,
        word: this.props.wordSentence.word,
        sentences: [],
      },
      sentences: [
        {
          sentence_ja: "",
          sentence_en: "",
          word: this.props.wordSentence.word,
        },
      ],
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({
      open: false,
      requestBody: {
        // reset values
        form: this.props.wordSentence.form,
        word: this.props.wordSentence.word,
        sentences: [],
      },
      sentences: [
        {
          sentence_ja: "",
          sentence_en: "",
          word: this.props.wordSentence.word,
        },
      ],
    });
  }

  handleInputChange(lang, event, index) {
    const list = [...this.state.sentences];
    if (lang === "en") list[index].sentence_en = event.target.value;
    else list[index].sentence_ja = event.target.value;
    this.setState({ sentences: list });
  }

  handleAdd() {
    console.log("add");
    this.setState({
      sentences: [
        ...this.state.sentences,
        {
          sentence_ja: "",
          sentence_en: "",
          word: this.props.wordSentence.word,
        },
      ],
    });
  }

  handleRemove(index) {
    console.log("remove");
    const list = [...this.state.sentences];
    list.splice(index, 1);
    this.setState({ sentences: list });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.state.requestBody.sentences = this.state.sentences;

    console.log("new request body");
    console.log(this.state.requestBody);

    this.handleClose();
  }

  render() {
    const { t } = this.props;

    let ret = [];

    ret.push(
      <div key="submit-sentence">
        <Button variant="outlined" onClick={this.handleClickOpen}>
          {t("result.no_sentences.action")}
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth>
          <DialogTitle> {t("result.no_sentences.action")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("result.no_sentences.submit_for")}{" "}
              {this.props.wordSentence.word}
            </DialogContentText>
            {this.state.sentences.map((x, i) => {
              return (
                <div key={"submit-sentences-dynamic" + i}>
                  {/* Japanese Sentence */}
                  <TextField
                    autoFocus={i === 0}
                    margin="dense"
                    id="name"
                    label={t("result.no_sentences.sentence")}
                    fullWidth
                    variant="standard"
                    onChange={(e) => this.handleInputChange("ja", e, i)}
                    required
                    multiline
                  />
                  {/* English Sentence */}
                  {this.props.i18n.language === "en" && (
                    <TextField
                      margin="dense"
                      id="name"
                      label={t("result.no_sentences.sentence_en")}
                      fullWidth
                      variant="standard"
                      value={x.sentence_en}
                      onChange={(e) => this.handleInputChange("en", e, i)}
                      multiline
                    />
                  )}
                  <div className="add-remove-sentence-buttons">
                    {/* Remove Button */}
                    {this.state.sentences.length !== 1 && (
                      <Button
                        variant="outlined"
                        onClick={() => this.handleRemove(i)}
                        className="remove-sentence-button"
                        startIcon={<DeleteIcon />}
                      >
                        {t("result.no_sentences.remove")}
                      </Button>
                    )}
                    {/* Add Button */}
                    {this.state.sentences.length - 1 === i && (
                      <Button
                        variant="outlined"
                        onClick={this.handleAdd}
                        className="add-sentence-button"
                        startIcon={<AddIcon />}
                      >
                        {t("result.no_sentences.another")}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {/* for debugging: printing */}
            {/* <div style={{ marginTop: 20 }}>
              {JSON.stringify(this.state.sentences)}
            </div> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>
              {t("result.no_sentences.cancel")}
            </Button>
            <Button onClick={(e) => this.handleSubmit(e)}>
              {t("result.no_sentences.submit")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

    return ret;
  }
}

const exactVerb = [
  {
    word_type: "exact_verb",
    word_sentences: [
      {
        form: "plain",
        word: "する",
        sentences: [],
      },
      {
        form: "honorific",
        word: "なさる",
        sentences: [
          {
            word: "なさる",
            sentence_ja:
              "明日より熊本に出張なさるとのことで、お気をつけて行ってらっしゃいませ",
            sentence_en: "English sentence",
          },
        ],
      },
      {
        form: "honorific",
        word: "される",
        sentences: [],
      },
      {
        form: "humble",
        word: "いたす",
        sentences: [
          {
            word: "いたす",
            sentence_ja: "明日、お電話いたします",
            sentence_en: null,
          },
        ],
      },
      {
        form: "humble",
        word: "させていただく",
        sentences: [
          {
            word: "させていただく",
            sentence_ja: "明日、お電話させていただきます",
            sentence_en: null,
          },
        ],
      },
      {
        form: "polite",
        word: "します",
        sentences: [
          {
            word: "します",
            sentence_ja: "明日より熊本に出張します",
            sentence_en: null,
          },
        ],
      },
    ],
    meaning: null,
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

const formulaVerb = [
  {
    word_type: "formula_verb",
    word_sentences: [
      {
        form: "plain",
        word: "する",
        sentences: [],
      },
      {
        form: "honorific",
        word: "なさる",
        sentences: [],
      },
      {
        form: "humble",
        word: "いたす",
        sentences: [],
      },
      {
        form: "humble",
        word: "いたす2",
        sentences: [],
      },
      {
        form: "polite",
        word: "します",
        sentences: [],
      },
      {
        form: "polite",
        word: "します2",
        sentences: [],
      },
    ],
    meaning: null,
  },
];

const exactNoun = [
  {
    word_type: "exact_noun",
    word_sentences: [
      {
        form: "honorific",
        word: "貴紙",
        sentences: [
          {
            word: "貴紙",
            sentence_ja:
              "貴紙平成○○年○○月○○日付朝刊に掲載されました「○○」の記事の中の○○の記載につきまして…",
            sentence_en: null,
          },
        ],
      },
      {
        form: "plain",
        word: "\n雑誌",
        sentences: [],
      },
      {
        form: "humble",
        word: "弊紙",
        sentences: [],
      },
      {
        form: "humble",
        word: "小紙",
        sentences: [],
      },
    ],
    meaning: null,
  },
  {
    word_type: "exact_noun",
    word_sentences: [
      {
        form: "honorific",
        word: "貴紙",
        sentences: [
          {
            word: "貴紙",
            sentence_ja:
              "貴紙平成○○年○○月○○日付朝刊に掲載されました「○○」の記事の中の○○の記載につきまして…",
            sentence_en: null,
          },
        ],
      },
      {
        form: "plain",
        word: "新聞",
        sentences: [],
      },
      {
        form: "humble",
        word: "弊紙",
        sentences: [],
      },
      {
        form: "humble",
        word: "小紙",
        sentences: [],
      },
    ],
    meaning: null,
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
const FormDialogT = withTranslation()(FormDialog);
