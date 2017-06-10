import React from 'react';
import TextArea from 'react-textarea-autosize';
import Page from './Page';
import CardHeader from './CardHeader';
import CardHeaderLogo from './CardHeaderLogo';
import sendIcon from './send.svg';
import './Card.css';
import config from './firebaseCredentials.js';


import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


const backend =  firebase.initializeApp(config);
const MAX_STORY_LENGTH = 2400;


const Description = () => {
  return (
    <div className='card__content'>
      <p>
        <strong>The goal</strong> of the project is to explore
        what <em>we</em> have in common with <em>strangers</em> on
        the street.
      </p>

      <p>
        <strong>You are here because</strong> you received a card. Did it
        resonate with you? Did it remind you of something?
      </p>

      <p>
        <strong>Here you can </strong>
        <a href='#read'>read the stories</a> of strangers and&nbsp;
        <a href='#share'>share your story</a>.
      </p>

      <p>
        And <strong>about that card</strong>, please pass it on to the
        next stranger.
      </p>
    </div>
  );
};


const DescriptionDE = () => {
  return (
    <div className='card__content'>
      <p>
        <strong>Das Zeil</strong> des Projektes ist es, zu erforschen,
        was <em>wir</em> gemeinsam mit <em>Fremden</em> auf der Straße
        haben.
      </p>

      <p>
        <strong>Sie sind hier weil</strong> Sie eine Karte erhalten haben.
        Ist es mit dir in Resonanz? Hat er dich an etwas erinnert?
      </p>

      <p>
        <strong>Hier können Sie </strong>seine Story&nbsp;
        <a href='#share'>teilen</a> und die Stories von anderen
        Leuten <a href='#read'>lesen</a>.
      </p>

      <p>
        Und <strong>über diese Karte</strong>, bitte, gebe es an den
        nächsten Fremden weiter.
      </p>
    </div>
  );
};


const Story = ({story}) => {
  return (
    <blockquote className='story'>
      <p className='story__text'>
        {story.body}
      </p>
      <footer className='story__footer'>
        – {story.username}
      </footer>
    </blockquote>
  );
};


const StoryList = ({stories}) => {
  const keys = Object.keys(stories);
  const items = keys.map((key) => {
    const story = stories[key];
    return (
      <li key={key} className='storyList__item'>
        <Story story={story} />
      </li>
    );
  });

  if (!keys.length) {
    return (
      <p className='storyList_empty'>
        You are the first one. Why are you here?
      </p>
    );
  }

  return (
    <ul className='storyList'>
      {items}
    </ul>
  );
};


class Card extends React.Component {

  constructor() {
    super();
    this.state = {
      value: '',
      card: null,
      loading: true,
      stories: [],
      username: null,
      lang: localStorage.getItem('user/lang') || 'en'
    };

    this._onChange = (e) => {
      this.setState({value: e.target.value});
    };
    this._detach = [];

    this._setGer = () => {
      localStorage.setItem('user/lang', 'de');
      this.setState({lang: 'de'});
    }

    this._setEng = () => {
      localStorage.setItem('user/lang', 'en');
      this.setState({lang: 'en'});
    }

    this._sendStory = (e) => {
      e.preventDefault();

      const body = this.state.value;

      if (body.length > MAX_STORY_LENGTH) {
        return;
      }

      const key = backend.database().ref().child('stories').push().key;
      const user = backend.auth().currentUser;

      let username = this.state.username;
      let usernameUpdate = {};

      if (!username) {
        username = 'Pretty Passerby';
        usernameUpdate[`users/${user.uid}`] = { username };
      }

      const cardSlug = this.props.match.params.cardSlug;
      const updates = {
        [`cards/${cardSlug}/stories/${key}`]: {
          body: body,
          uid: user.uid,
          username: username,
          cardSlug
        },
        ...usernameUpdate
      };

      backend.database().ref().update(updates);
      this.setState({value: ''});
    };

    this._setStories = (stories) => {
      stories = stories || {};
      this.setState({stories});
    };

    this._setCard = (card) => {
      let stories = {};

      if (card && card.stories) {
        stories = card.stories;
      }

      this.setState({
        card: card,
        loading: false,
        stories
      });
    }

    this._setUsername = (obj) => {
      if (obj && obj.username) {
        this.setState({username: obj.username});
      }
    };
  }

  componentWillMount() {
    const auth = backend.auth();
    auth
      .signInAnonymously()
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('xxx sign in error', error, errorCode, errorMessage);
      })
      .then((user) => {
        return backend
          .database()
          .ref(`/users/${user.uid}`)
          .once('value');
      }).then((v) => this._setUsername(v.val()));

    const slug = this.props.match.params.cardSlug;

    this._detach.push(
      backend
        .database()
        .ref(`cards/${slug}/stories`)
        .on('value', (v) => {
          if (v) {
            this._setStories(v.val());
            return;
          }

          this._setStories({});
        })
    );

    this._detach.push(
      backend
        .database()
        .ref(`/cards/${slug}`)
        .once('value')
        .then((v) => this._setCard(v.val()))
    );
  }


  componentWillUnmount() {
    this._detach.forEach(f => f());
  }

  render() {
    const {card, loading} = this.state;


    if (loading) {
      return (
        <Page>
          <CardHeader>
            <CardHeaderLogo />
          </CardHeader>
        </Page>
      );
    }


    if (!card) {
      return (
      <Page>
        <CardHeader>
          <CardHeaderLogo />
        </CardHeader>
        <div className='card__content'>
          <p><em>Nevermind..</em></p>
        </div>
      </Page>
      );
    }

    const {value} = this.state;

    const errorText = (
      value.length > MAX_STORY_LENGTH ?
      'Sorry, the text is too long.' :
      null
    );

    let btnOpacity = 1;
    let btnDisabled = false;

    if (!value || errorText) {
      btnOpacity = 0;
      btnDisabled = true;
    }

    const isEng = this.state.lang === 'en';

    let engItemClasses = 'lang__item';
    let gerItemClasses = 'lang__item';

    if (isEng) {
      engItemClasses += ' lang__item_active';
    } else {
      gerItemClasses += ' lang__item_active';
    }

    let description = (
      isEng ? <Description /> : <DescriptionDE />
    );

    return (
      <Page>
        <CardHeader>
          <CardHeaderLogo />
          <pre className='card__header__text'>
            {this.state.card[this.state.lang]}
          </pre>
          <div className='lang'>
            <button onClick={this._setEng} className={engItemClasses}>
              en
            </button>
            <button onClick={this._setGer} className={gerItemClasses}>
              de
            </button>
          </div>
        </CardHeader>

        {description}

        <h1 id='read' className='card__heading'>Stories</h1>
        <StoryList stories={this.state.stories} />

        <form onSubmit={this._sendStory} className='storyForm'>
          <span className='storyForm__error'>{errorText}</span>
          <TextArea
            id='share'
            placeholder='Write my story…'
            value={this.state.value}
            onChange={this._onChange}
            className='storyForm__textfield'>
          </TextArea>

          <button
            className='storyForm__submit'
            style={{opacity: btnOpacity}}
            disabled={btnDisabled}
            type='submit'>

            <img
              alt='Send story'
              className='storyForm__icon'
              src={sendIcon} />
          </button>
        </form>
      </Page>
    );
  }
}

export default Card;
