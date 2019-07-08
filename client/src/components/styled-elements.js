import styled, {css} from 'styled-components';

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid ${props => props.theme.fgPrimary};
  color: ${props => props.theme.fgPrimary};
  cursor: pointer;
  font-size: 16px;
  margin: 0 1em;
  padding 0.25em 1em;

  ${props =>
  props.primary && css`
        background: ${props => props.theme.fgPrimary};
        color: ${props => props.theme.bgFirst};
      `};
`;

const LabelDiv = styled.div`
  color: ${props => props.theme.fgAccent};
  text-align: center;
`;

const SetterWrapper = styled.div`
  align: center;
  background: linear-gradient(-5deg, ${props => props.theme.bgSecond}, ${props => props.theme.bgFirst});
  border-radius: 5px;
  margin: 0 10px;
  padding: 0 5px 5px 5px;
  width: 150px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
`;

const TimerWrapper = styled.div`
  background: linear-gradient(-15deg, ${props => props.theme.bgFirst}, ${props => props.theme.bgSecond});
  margin: 20px 0 40px;
  padding: 10px;
  border-radius: 5px;
`;

const TimerLabel = styled.div`
  color: ${props => props.theme.fgPrimary};
  font-family: 'Patua One', serif;
  font-size: 24px;
  text-align: center;
`;

const TimeDisplay = styled.div`
  text-align: center;
  color: ${props => props.theme.fgAccent};
  font-family: 'Gugi', sans-serif;
  font-size: 36px;
  margin: 20px 0;
`;

export {Button, LabelDiv, SetterWrapper, Row, TimerLabel, TimerWrapper, TimeDisplay}
