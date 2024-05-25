import React, { useEffect } from 'react';
import ProductList from './products/ProductList';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { getProducts } from '../../store/slices/productSlice';
import './products/Product.css';

const CatalogPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(getProducts());
  });
  return (
    <section className='catalog'>
      <div className='container'>
        <h1 className='catalog__title'>Choose the bouquet of your dreams!</h1>
        <ProductList />
      </div>
    </section>
  );
};

export default CatalogPage;
