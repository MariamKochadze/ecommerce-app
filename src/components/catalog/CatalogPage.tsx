import ProductList from './products/ProductList';
import { useAppSelector } from '../../hooks/reduxHooks';
import './products/Product.css';
import Message from '../../shared/ui/Message/Message';
import CatalogSkeleton from './CatalogSkeleton';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { getProducts, getCategories, getProductsWithFilter } from '../../store/slices/productSlice';
import { useEffect } from 'react';
import { MainWrapper } from '../mainWrapper/MainWrapper';
import { useState } from 'react';
// import { CatalogTree } from '../../shared/ui/catalogTree/CatalogTree';
// import { Box } from '@mui/material';
// import RangeSlider from '../../shared/ui/Slider';
// import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { Filters } from './filters/Filters';
import { Toolbar } from './filters/Toolbar';
import { BreadCrumbs } from './filters/BreadCrumb';

const CatalogPage = (): JSX.Element => {
  const isLoading = useAppSelector((state) => state.products.isLoading);
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.products.categories);
  const filters = useAppSelector((state) => state.products.filters);
  const activeCat = useAppSelector((state) => state.products.filters.catId);
  const sort = useAppSelector((state) => state.products.sort);
  const search = useAppSelector((state) => state.products.search);

  //eslint-disable-next-line
  const [selected, setSelected] = useState(activeCat ? activeCat : '');

  const loadData = (): void => {
    void dispatch(getCategories());
    void dispatch(getProducts());
  };

  useEffect(() => {
    if (!categories.length) void loadData();
    //eslint-disable-next-line
    else void dispatch(getProductsWithFilter());
    //eslint-disable-next-line
  }, [JSON.stringify(filters), JSON.stringify(sort), search]);
  // ;

  useEffect(() => {
    activeCat ? setSelected(activeCat) : setSelected('');
  }, [activeCat]);

  // const handleCatClick = (catId: string) => dispatch(getProductsByCat('36da2b34-eccd-4a91-af76-c9c0b49fa007'));
  // const handleCatClick = () => void dispatch(getProductsWithFilter());
  // const handleCatClick = (catId: string) => dispatch(getProductsByCat(catId));

  return (
    <MainWrapper>
      <section className='catalog'>
        <div className='container'>
          <BreadCrumbs />
          <h1 className='catalog__title'>{!isLoading ? 'Choose the bouquet of your dreams!' : ''}</h1>
          <div className='catalog-toolbar'>
            <Toolbar />
          </div>
          <div className='catalog__inner'>
            <div className='catalog-category'>
              {/* {categories.length && (
                <CatalogTree
                  categories={categories}
                  handleClick={handleCatClick}
                  selected={selected}
                  setSelected={setSelected}
                />
              )} */}
              <Filters />
            </div>
            <div className='catalog-list'>
              {isLoading ? (
                Array.from(new Array(9)).map((_, index) => <CatalogSkeleton key={index} />)
              ) : (
                <ProductList />
              )}
            </div>
          </div>
        </div>
        <Message />
      </section>
    </MainWrapper>
  );
};

export default CatalogPage;
