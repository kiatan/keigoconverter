import logo from "./logo.png";
import "./App.css";
import React from "react";
import Typewriter from "typewriter-effect";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-group">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="title">Keigo Converter</p>
        </div>
        <div className="switch">
          <input
            id="language-toggle"
            className="check-toggle check-toggle-round-flat"
            type="checkbox"
          />
          <label htmlFor="language-toggle"></label>
          <span className="on">JA</span>
          <span className="off">EN</span>
        </div>
      </header>
      <KeigoConverter class="keigo-converter" />
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
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            className="input"
            type="text"
            name="word"
            placeholder="Type your word here"
            onChange={this.handleChange}
          />
          <input className="input-button" type="submit" value="Show Result" />
        </form>
        <Loading />
        <div className="result">
          <Result
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
      date: new Date(),
      sonkeigo: keigo[0].sonkeigo,
      kenjougo: keigo[0].kenjougo,
      teineigo: keigo[0].teineigo,
    };
  }
  render() {
    if (!this.props.isShowResult) return null;

    if (this.props.data) {
      if (this.props.data.length === 1) {
        if (this.props.data[0].word_type === "not_found") {
          return (
            <div className="not-found">
              Sorry, your input is not found in our database (｡╯︵╰｡)
              <br></br>
              Please try again with a different word or submit to our database.
            </div>
          );
        }
      }
    }

    return (
      <div>
        <h2>尊敬語</h2>
        <div>{this.state.sonkeigo.word}</div>
        <div>{this.state.sonkeigo.sentence_jp}</div>
        <h2>謙譲語</h2>
        <div>{this.state.kenjougo.word}</div>
        <div>{this.state.kenjougo.sentence_jp}</div>
        <h2>丁寧語</h2>
        <div>{this.state.teineigo.word}</div>
        <div>{this.state.teineigo.sentence_jp}</div>
        <h2>It is {this.state.date.toLocaleTimeString()}</h2>
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
    return (
      <div className="loading">
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
              .typeString("ちょっと待って！")
              .pauseFor(500)
              .deleteAll()
              .typeString("今しばらくお待ちください。")
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
