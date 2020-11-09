import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from 'client/atoms/typography';

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: space-between;
  position: relative;
  padding-top: 0.9rem;
  box-shadow: 0 0.1rem 0.4rem -0.2rem ${({ theme }) => theme.colors.darkGrey};
  text-align: left;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};

  ::after {
    content: '';
    position: absolute;
    bottom: 0;
    transform: scale(0, 1);
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.blue};
    transition: all 0.15s cubic-bezier(.24,.89,.26,1.01);
  }

  &:focus-within::after {
    transform: scale(1, 1);
  }
`;

const Field = styled.input`
  background-color: transparent;
  border: none;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  padding-bottom: 0.3rem;
  padding-top: 0.1rem;
  color: ${({ theme }) => theme.colors.darkGrey};
  min-width: 0px;
  width: 100%;
  margin: 0;

  &:focus {
    outline: 0 !important;
  }
`;

const TextLabel = styled(Typography)`
  position: absolute;
  top: ${({ atTop }) => (atTop ? 0.3 : 0.8)}rem;
  left: 0.6rem;
  font-size: ${({ atTop }) => (atTop ? 0.5 : 0.8)}rem;
  transition: all 0.2s cubic-bezier(.24,.89,.26,1.01);
  color: ${({ theme }) => theme.colors.grey};
  display: block;
  font-weight: 200;
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

const TextField = ({
  id,
  type = 'text',
  name,
  label,
  className,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
}: Props) => {
  const [focused, setFocused] = useState(false);

  const onFocusCb = (event) => {
    setFocused(true);
    if (onFocus) {
      onFocus(event);
    }
  };

  const onBlurCb = (event) => {
    setFocused(false);
    if (onFocus) {
      onBlur(event);
    }
  };

  return (
    <FieldContainer className={className}>
      <TextLabel size="xs" variant="pica" as="label" htmlFor={id} atTop={value || focused}>{label}</TextLabel>
      <Field
        name={name}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlurCb}
        onFocus={onFocusCb}
        disabled={disabled}
      />
    </FieldContainer>
  );
};

export default TextField;
