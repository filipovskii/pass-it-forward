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
    </div>
  );
}


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
      username: null
    };

    this._onChange = (e) => {
      this.setState({value: e.target.value});
    };
    this._detach = [];

    this._sendStory = (e) => {
      e.preventDefault();
      const body = this.state.value;
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
        console.log('xxx in sigh in', user);
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
        .on('value', (v) => this._setStories(v.val()))
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

    const iconOpacity = this.state.value ? 1 : 0;
    console.log(this.props);
    const user = backend.auth().currentUser;
    console.log('xxx user', user);
    console.log('xxx state', this.state);
    return (
      <Page>
        <CardHeader>
          <CardHeaderLogo />
          <pre className='card__header__text'>{this.state.card.en}</pre>
        </CardHeader>

        <Description />

        <h1 id='read' className='card__heading'>Stories</h1>
        <StoryList stories={this.state.stories} />

        <form onSubmit={this._sendStory} className='storyForm'>
          <TextArea
            id='share'
            placeholder='Write my story…'
            value={this.state.value}
            onChange={this._onChange}
            className='storyForm__textfield'>
          </TextArea>

          <button
            className='storyForm__submit'
            style={{opacity: iconOpacity}}
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
