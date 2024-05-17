import React from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { MainWrapper } from '../mainWrapper/MainWrapper';
import './Main.css';
import { OutlinedButton } from '../../shared/button/outlinedButton/OutlinedButton';
// import { Link } from 'react-router-dom';

export const Main: React.FC = () => {
  // Todo: uncomment lines related to navigation after 'catalog' page available
  const customer = useAppSelector((state) => state.customers.customer);
  return (
    <MainWrapper>
      <>
        <section className='hero'>
          <div className='hero__content'>
            {customer?.firstName ? <h3>Hello {customer?.firstName} !</h3> : null}
            <p>Welcome to the</p>
            <h1 className='hero__title'>House with flowers</h1>
            <p>Decorate your life with flowers</p>
            {/* <Link to='/catalog'> */}
            <OutlinedButton
              text='Shop now'
              light={true}
            />
            {/* </Link> */}
          </div>
        </section>
        <section className='greeting'>
          <p>The House with flowers welcomes you!</p>
          <p>
            We create beautiful decor, make beautiful bouquets for the holidays.Our friendly and creative team will be
            happy to work
          </p>
          <p>with you! You can learn more about our company by clicking on the link</p>
        </section>
        <section className='why-us'></section>
      </>
    </MainWrapper>
  );
};
