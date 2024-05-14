import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Input from '../../../shared/ui/Input/Input';
import { FormFooter } from '../formFooter/FormFooter';
import { OutlinedButton } from '../../../shared/button/outlinedButton/OutlinedButton';
import { SignIn } from '../../../store/slices/customerSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useState } from 'react';

export interface ILoginData {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim('Email address must not contain leading or trailing whitespace.')
    .test('no-whitespace', 'Whitespace is not allowed', (value: string | undefined) => !/\s/.test(value as string))
    .test('lowercase', 'Password must contain lowercase letter', (value) => {
      if (!value) return true;

      return /[a-z]/.test(value);
    })
    .email('Email must be valid email.')
    .required('This is required field, enter your email.')
    .min(3, 'This field shold be at least 3 symbols')
    .max(50, 'This text is too long')
    .matches(
      /^(((?=.{3,50}$)[A-Za-z0-9\-_+=!]*)|(?=.{5,50}$)([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+))$/,
      'The domain part of the address with an error, should contain (.domain-name).For example: user@example.com'
    ),
  password: Yup.string()
    .test(
      'no-whitespace',
      'Whitespace is not allowed',
      (value: string | undefined) => !/^\s+|\s+$/g.test(value as string)
    )
    .required('Password is required field, enter your password.')
    .min(8, 'This password is too short, must be at least 8 characters long')
    .max(50, 'This password is too long')
    .matches(/[A-Z]/, 'The password must contain capital letter')
    .matches(/[a-z]/, 'The password must contain a lowercase letter')
    .matches(/\d/, 'The password must contain a digit')
    .matches(/[!%*?&]/, 'Use spec symbols (!,%,*,?,&)'),
});

export const LoginForm = (): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  // const customer = useAppSelector((state) => state.customers.customer);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<ILoginData> = (data) => {
    const email = data.email;
    const password = data.password;
    console.log(email, password);

    dispatch(SignIn({ email, password, setOpen }));
  };

  const { control, handleSubmit } = useForm<ILoginData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Controller
          control={control}
          name='email'
          render={({ field, fieldState }) => (
            <Input
              autoComplete='off'
              type='email'
              id='email'
              label='email'
              placeholder='user@example.com'
              error={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <br />
        <Controller
          control={control}
          name='password'
          render={({ field, fieldState }) => (
            <Input
              type={showPassword ? 'text' : 'password'}
              id='password'
              label='password'
              placeholder='Enter the password ...'
              error={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <br />
        <label>
          <input
            type='checkbox'
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>
        <OutlinedButton
          type='submit'
          text='Submit'
          wideBtn={true}
        />
        <FormFooter />
      </form>
    </>
  );
};
