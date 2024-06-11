import { Customer, Image, Price } from '@commercetools/platform-sdk';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { OutlinedButton } from '../../../shared/button/outlinedButton/OutlinedButton';
import './ProductCard.css';
import { ImageGallery } from './imageGallery/ImageGallery';
import { RateStarIcon } from '../../../shared/icons/rateStarIcon/RateStarIcon';
import SvgCircleIcon from '../../../shared/icons/circle/CircleIcon';
import { setRightPrice } from '../../../utils/price-formatting-functions';
import { ProductModal } from './productModal/ProductModal';
import useCart from '../../../hooks/useGetProductToCart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Loader } from '../../../shared/ui/Loader/Loader';

export interface IProductCardProps {
  name: string | '';
  description: string | '';
  images: Image[] | [];
  prices: Price[] | undefined;
  id: string;
}

export const ProductCard: FC<IProductCardProps> = ({ name, description, images, id, prices }): JSX.Element => {
  // const [amount, setAmount] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const { addProductToCart, removeProductFromCart, loading } = useCart();
  const customer = useSelector((state: RootState) => state.customers.customer);
  const cartIds = useSelector((state: RootState) => state.cart.cartItemsId);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [buttonType, setButtonType] = useState('add');

  const handleAddToCart = useCallback(
    async (productId: string, variantId: number, customer: Customer | null) => {
      await addProductToCart(productId, variantId, customer);
    },
    [addProductToCart]
  );

  const handleRemoveFromCart = useCallback(
    (id: string) => {
      let lineItemId = '';
      cart.lineItems.forEach((el) => {
        if (el.productId === id) {
          lineItemId = el.id;
        }
      });
      if (lineItemId) {
        removeProductFromCart(lineItemId);
      }
    },
    [removeProductFromCart, cart.lineItems]
  );

  const handleToggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const setImageIndex = (index: number) => {
    if (index !== currentImageIndex) {
      setCurrentImageIndex(index);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      if (currentImageIndex < images.length - 1) {
        setImageIndex(currentImageIndex + 1);
      }
    } else if (touchEndX.current - touchStartX.current > 50) {
      if (currentImageIndex > 0) {
        setImageIndex(currentImageIndex - 1);
      }
    }
  };

  const toggleOpenedModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (cart.lineItems.length && cartIds?.includes(id)) {
      setButtonType('remove');
    } else {
      setButtonType('add');
    }
  }, [cartIds, id, cart.lineItems.length, handleAddToCart, handleRemoveFromCart]);

  return (
    <div className='product-card'>
      <Loader isLoading={loading} />
      {isModalVisible ? (
        <ProductModal
          currentIndex={currentImageIndex}
          images={images}
          onClick={toggleOpenedModal}
        />
      ) : null}
      <div
        className='product-card__imageContainer'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={toggleOpenedModal}
          className='unstyled-button'
          title='zoom image'
        >
          <img
            className='product-card__image'
            src={images[currentImageIndex].url}
            alt={`${images[currentImageIndex].label} main`}
          />
        </button>

        {images.length > 1 ? (
          <ul className='product-card__main-slider-container'>
            {images.map((__, index) => (
              <li key={index}>
                <button
                  className='product-card__main-image-slider'
                  onClick={() => setImageIndex(index)}
                  data-testid={`image-slider-button-${index}`}
                >
                  <SvgCircleIcon selected={currentImageIndex === index} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className='product-card__description'>
        <h1 className='product-card__title'>{name}</h1>
        <div className='product-card__reviews'>
          <div className='product-card__rate'>
            <RateStarIcon />
            <RateStarIcon />
            <RateStarIcon />
            <RateStarIcon />
            <RateStarIcon />
          </div>
          <div className='product-card__reviews-number'>0 reviews</div>
        </div>
        <div className='product-card__price-container'>
          <div
            className='product-card__price-value'
            data-testid='price-value'
          >
            {prices ? setRightPrice(prices[0].value.centAmount, prices[0].discounted?.value.centAmount) : '0.00'}
          </div>
          <div>In stock</div>
        </div>
        <div className='product-card__cart-button-container'>
          {buttonType === 'add' ? (
            <>
              <OutlinedButton
                text='Add to cart'
                loading={loading}
                onClick={() => handleAddToCart(id, 1, customer)}
              />
              {/* <QuantityController
                amount={amount}
                setAmount={setAmount}
              /> */}
            </>
          ) : (
            <OutlinedButton
              text='Remove from cart'
              loading={loading}
              onClick={() => handleRemoveFromCart(id)}
            />
          )}
        </div>

        {description ? (
          <>
            <h3 className='product-card__description-title'>Description:</h3>
            <p className={`product-card__description-text ${isExpanded ? 'expanded' : 'collapsed'}`}>{description}</p>
            <button
              className='product-card__description-btn'
              onClick={handleToggleDescription}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? <ImageGallery images={images} /> : null}
    </div>
  );
};
