import React from 'react';
import './Page.css';

const Page = ({children}) => (
  <div className='page'>
    <main className='page__main'>
      {children}
    </main>
  </div>
);

export default Page;
