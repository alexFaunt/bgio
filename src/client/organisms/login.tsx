import React, { useState } from 'react';
import { Formik } from 'formik';
import shortId from 'shortid';
import { useMutation, gql } from '@apollo/client';

import TextField from 'client/atoms/text-field';
import { useDispatch } from 'client/state';
import { login } from 'client/state/actions/auth';
import Typography from 'client/atoms/typography';
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
        <form onSubmit={handleSubmit}>
          <TextField
            id={`${formId}:name`}
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            disabled={isSubmitting}
          />
          {errors.name && <Typography>{errors.name}</Typography> }
          <button type="submit" disabled={isSubmitting}>
            Lets go!
          </button>
        </form>
      )}
    </Formik>
  );
};

export default Login;
