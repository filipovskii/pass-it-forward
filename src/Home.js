import React from 'react';
import Page from './Page';
import CardHeader from './CardHeader';
import CardHeaderLogo from './CardHeaderLogo';

const Description = () => {
  return (
    <div className='card__content'>
      <p>
        Made by&nbsp;<em>Arkady Brot</em> for&nbsp;<em>Test</em>.
        If you'd like to get in touch, send your thoughts and questions
        to&nbsp;
        <a href='mailto:filipovskii.off@gmail.com'>this email</a>.
      </p>

      <p>Thank you for participating!</p>
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

