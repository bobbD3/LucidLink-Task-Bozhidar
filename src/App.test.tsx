import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { S3Provider } from './contexts/S3Provider';
import Config from './components/Config/index';

test('renders the Config component without crashing', () => {
  render(
    <S3Provider>
      <Config />
    </S3Provider>
  );
});

test('Login button is initially present', () => {
  render(
    <S3Provider>
      <Config />
    </S3Provider>
  );
  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('clicking Login button toggles the form visibility and changes the button text', () => {
  render(
    <S3Provider>
      <Config />
    </S3Provider>
  );
  fireEvent.click(screen.getByText('Login'));
  expect(screen.getByText('Hide')).toBeInTheDocument();
});

test('form has all three input fields and the submit button', () => {
  render(
    <S3Provider>
      <Config />
    </S3Provider>
  );
  fireEvent.click(screen.getByText('Login'));
  expect(screen.getByPlaceholderText('Access Key ID')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Secret Access Key')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Bucket Name')).toBeInTheDocument();
  expect(screen.getByText('Connect')).toBeInTheDocument();
});

test('form submits and updates the context when inputs are filled and submit button is clicked', () => {
  render(
    <S3Provider>
      <Config />
    </S3Provider>
  );
  fireEvent.click(screen.getByText('Login'));

  fireEvent.change(screen.getByPlaceholderText('Access Key ID'), { target: { value: 'test-access-key-id' } });
  fireEvent.change(screen.getByPlaceholderText('Secret Access Key'), { target: { value: 'test-secret-access-key' } });
  fireEvent.change(screen.getByPlaceholderText('Bucket Name'), { target: { value: 'test-bucket-name' } });

  const submitButton = screen.getByText('Connect');
  fireEvent.click(submitButton);
});
