import React from 'react';
import styled, { keyframes } from 'styled-components';
import Typography, { HeroHeader, Secondary, Quote as QuoteTypography } from 'client/atoms/typography';
import PageContent from 'client/layout/page-content';
import LoginForm from 'client/organisms/login';

const backgroundKeyframes = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const quotes = [
  { content: 'I can\'t 100% tell you that it is not a game', author: 'Sid Meier' },
  { content: 'At least it is free - at least... I don\'t think I paid for it', author: 'Charles Ponzi' },
  { content: 'I\'ve definitely had less fun', author: 'Floyd J. Thompson' },
  { content: 'Yeah it\'s probably good - that ok? Where\'s my cheque?', author: 'Jerry Maguire' },
];

const carouselAnim = quotes.reduce((acc, _, i) => {
  const frames = (i * 25) + 10;
  const translate = -100 * (i + 1);

  return `${acc}
    ${frames}% {
      transform: translateX(${translate}%);
    }
    ${frames + 15}% {
      transform: translateX(${translate}%);
    }`;
}, '');

const quotesKeyframes = keyframes`
  0% {
    transform: translateX(0%);
  }
  ${carouselAnim}
`;

const HeaderSection = styled.div`
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  padding-top: 4rem;
  padding-bottom: 3rem;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #f3ff35);
  background-size: 600% 600%;
  animation: ${backgroundKeyframes} 12s ease infinite;
`;

const TLDRSection = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
`;

const TLDRContent = styled(PageContent)`
  font-weight: 200;
  text-align: center;
`;

const Hero = styled(HeroHeader)`
  text-shadow: 0.0rem 0.05rem 0.2rem #333;
  display: block;
`;

const Subtitle = styled(Secondary)`
  align-self: flex-end;
  color: ${({ theme }) => theme.colors.white};
  text-shadow: 0.0rem 0.05rem 0.2rem #333;
  margin-top: 0.8rem;
`;

const Version = styled(Typography)`
  position: absolute;
  border-radius: 100%;
  width: 10rem;
  transform: rotate(30deg);
  background: rgba(64, 64, 64, 0.5);
  width: 2rem;
  font-size: 0.6rem;
  padding: 0.65rem 0;
  height: 2rem;
  top: -1rem;
  right: 3rem;
`;

const HeaderContent = styled(PageContent)`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const LoginContent = styled(PageContent)`
`;

const LoginSection = styled.div`
  background: ${({ theme }) => theme.colors.lightGrey};
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const QuotesSection = styled.div`
  flex-grow: 1;
`;

const FooterSection = styled.div`
  background: ${({ theme }) => theme.colors.darkGrey};
`;

const FooterContent = styled(PageContent)`
  color: ${({ theme }) => theme.colors.lightGrey};
  font-size: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 1rem;
  padding-left: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: 200;
`;

const rgba = (hex, alpha) => {
  const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${alpha})`;
};

const QuotesContent = styled(PageContent)`
  padding-top: 2rem;
  padding-bottom: 2rem;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    width: max(calc((100vw - 1350px) / 2), 5rem);
    z-index: 1;
  }

  &::before {
    right: 100%;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.lightGrey} 0%,
      ${({ theme }) => theme.colors.lightGrey} 70%,
      ${({ theme }) => rgba(theme.colors.lightGrey, 0)} 100%
    );
  }

  &::after {
    left: 100%;
    background: linear-gradient(
      -90deg,
      ${({ theme }) => theme.colors.lightGrey} 0%,
      ${({ theme }) => theme.colors.lightGrey} 70%,
      ${({ theme }) => rgba(theme.colors.lightGrey, 0)} 100%
    );
  }
`;

const QuotesCarousel = styled.div`
  display: flex;
  transform: translateX(0%);
  animation: ${quotesKeyframes} 15s ease-in-out infinite;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const CustomerQuote = styled(QuoteTypography)`
  color: ${({ theme }) => theme.colors.blue};
  text-align: center;
`;

const CustomerName = styled(Typography)`
  width: 100%;
  flex-shrink: 0;
  text-align: center;
  font-size: 0.7rem;
  text-align: right;
  color: ${({ theme }) => theme.colors.grey};
  margin-top: 0.5rem;
  font-weight: 200;
`;

const QuoteWrapper = styled.div`
  padding: 1rem 4rem;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

type QuoteProps = {
  content: string,
  author: string,
};

const Quote = ({ content, author }: QuoteProps) => (
  <QuoteWrapper>
    <CustomerQuote>{ content }</CustomerQuote>
    <CustomerName>{`- ${author}`}</CustomerName>
  </QuoteWrapper>
);

const SectionTitle = styled(Typography)`
  display: block;
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`;

const Underline = styled.u`
  margin: 0 0.25rem;
`;

const HomePage = () => (
  <Wrapper>
    <HeaderSection>
      <HeaderContent>
        <Hero>Seven Hand Poker</Hero>
        <Subtitle>The best game ever*</Subtitle>
        <Version>Alpha</Version>
      </HeaderContent>
    </HeaderSection>
    <TLDRSection>
      <TLDRContent>
        <SectionTitle>What is it?</SectionTitle>
        {/* eslint-disable-next-line max-len */}
        A two player card game, beloved by billions, played exclusively on MSN Messenger before it was wiped from existence. To my knowledge no-one has re-created it, but finally,
        <Underline>finally</Underline>
        it&apos;s back! Enjoy!
      </TLDRContent>
    </TLDRSection>
    <LoginSection>
      <LoginContent>
        <LoginForm />
      </LoginContent>
    </LoginSection>
    <QuotesSection>
      <QuotesContent>
        <QuotesCarousel>
          {/* eslint-disable-next-line react/no-array-index-key */}
          { quotes.map(({ content, author }, i) => <Quote key={i} content={content} author={author} />) }
          <Quote content={quotes[0].content} author={quotes[0].author} />
        </QuotesCarousel>
      </QuotesContent>
    </QuotesSection>
    <FooterSection>
      <FooterContent>
        <Typography>*unconfirmed</Typography>
        |
        <Typography>All rights reserved</Typography>
        |
        <a href="mailto:complaints@sevenhandpoker.com"><Typography>contact us</Typography></a>
      </FooterContent>
    </FooterSection>
  </Wrapper>
);

export default HomePage;
