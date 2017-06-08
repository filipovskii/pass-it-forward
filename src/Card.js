import React from 'react';
import { Link } from 'react-router-dom';

const Card = (props) => {
  return (
    <div>
      <h1>Card {props.match.params.cardSlug}</h1>
      <Link to='/'>home</Link>
    </div>
  );
};

export default Card;
