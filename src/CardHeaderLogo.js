import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';

const CardHeaderLogo = () => (
  <div className='card__header__logo'>
    <Link to='/'>
    <img alt='Pass It Forward' className='logo' src={logo} />
    </Link>
  </div>
);

export default CardHeaderLogo;

