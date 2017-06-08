import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './Card.css';


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


const Card = (props) => {
  return (
    <div className='card'>
      <main className='card__main'>

        <div className='card__header'>
          <div className='card__header__logo'>
            <Link to='/'>
            <img alt='Pass It Forward' className='logo' src={logo} />
            </Link>
          </div>
          <div className='card__header__text'>
            <p>I remember how I used to</p>
            <p>enjoy the rain</p>
            <p>in my hometown.</p>
          </div>
        </div>

        <Description />
      </main>

      <aside className='card__aside'>
        Hi Stranger&hellip;
      </aside>
    </div>
  );
};

export default Card;
