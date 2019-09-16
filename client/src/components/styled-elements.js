import styled from 'styled-components';

const TimerLabel = styled.div`
  color: ${props => props.theme.fgPrimary};
  font-family: 'Patua One', serif;
  font-size: 24px;
  line-height: 1em;
  text-align: center;
`;

const TimeDisplay = styled.div`
  text-align: center;
  color: ${props => props.theme.fgAccent};
  font-family: 'Gugi', sans-serif;
  font-size: 36px;
  line-height: 1em;
  margin: 20px 0;
`;

const FeaturesContainer = styled.div`
  margin-top: 50px;
  text-align: center;
`;

const FeaturesItem = styled.div`
  font-size: 16px;
  line-height: 1.5em;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export {
  TimerLabel, TimeDisplay, FeaturesContainer, FeaturesItem
}
