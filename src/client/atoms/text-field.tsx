import React from 'react';
import styled from 'styled-components';
import Typography from 'client/atoms/typography';

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
  color: grey;
`;

const Field = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 2px solid grey;

  &:focus {
    outline: 0 !important;
    border-bottom: 2px solid red;
  }
`;

const TextLabel = styled(Typography)`
  margin-right: 2rem;
  margin-bottom: 2rem;
`;

export type Props = {
  id: string,
  name: string,
  label: string,
  type?: HTMLInputElement['type'],
  className?: string,
  value: string,
  onChange: HTMLInputElement['onchange'],
  onBlur: HTMLInputElement['onblur'],
  disabled?: boolean,
};

const TextField = ({ id, type = 'text', name, label, className, value, onChange, onBlur, disabled = false }: Props) => (
  <FieldContainer className={className}>
    <TextLabel size="xs" variant="pica" as="label" htmlFor={id}>{label}</TextLabel>
    <Field name={name} type={type} id={id} value={value} onChange={onChange} onBlur={onBlur} disabled={disabled} />
  </FieldContainer>
);

export default TextField;
