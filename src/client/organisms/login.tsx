import React, { useState } from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import shortId from 'shortid';
import { useMutation, gql } from '@apollo/client';

import TextField from 'client/atoms/text-field';
import { useDispatch } from 'client/state';
import { login } from 'client/state/actions/auth';
import Typography from 'client/atoms/typography';
import Button from 'client/atoms/button';
// import { CreateUser, CreateUserVariables } from ''
// TODO generate mutation definitions

type FormValues = {
  name: string,
};

const validate = (values: FormInfo) => {
  const errors = {};
  if (values.name.length <= 3) {
    errors.email = 'Must be >3 characters';
  }
  return errors;
};

const CREATE_USER = gql`
  mutation CreateUser($name: String!) {
    createUser(input: { name: $name }) {
      user {
        id
        name
      }
      secret
    }
  }
`;

const Form = styled.form`
  padding: 1rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: row;
`;

const NameField = styled(TextField)`
  margin-right: 0.6rem;
`;

const Login = () => {
  const dispatch = useDispatch();
  const [formId] = useState(shortId.generate());
  const initialValues: FormValues = { name: '' };

  const [createUser] = useMutation(CREATE_USER);

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={async (values) => {
        const { data } = await createUser({ variables: values });
        // TODO handle error

        dispatch(login({
          userId: data.createUser.user.id,
          userSecret: data.createUser.secret,
        }));
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form onSubmit={handleSubmit}>
          <NameField
            id={`${formId}:name`}
            name="name"
            label="Pick a name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            disabled={isSubmitting}
          />
          {errors.name && <Typography>{errors.name}</Typography> }
          <Button type="submit" disabled={isSubmitting}>
            Lets go!
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
