import React from 'react';
import Page from './Page';
import CardHeader from './CardHeader';
import CardHeaderLogo from './CardHeaderLogo';

const Description = () => {
  return (
    <div className='card__content'>
      <p>
        <strong>The goal</strong> of the project is to explore
        what <em>we</em> have in common with <em>strangers</em> on
        the street.
      </p>
    </div>
  );
}

const Home = () => (
  <Page>
    <CardHeader>
      <CardHeaderLogo />
    </CardHeader>

    <Description />
  </Page>
);

export default Home;

