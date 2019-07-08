import React from 'react';
import {Button, LabelDiv, Row, SetterWrapper} from "./styled-elements";

function SessionSetter(props) {
  const {length, inc, dec} = props;
  return (
    <SetterWrapper>
      <LabelDiv id="session-label">Session Length</LabelDiv>
      <Row>
        <Button id="session-decrement" onClick={dec}>-</Button>
        <LabelDiv as="span" id="session-length">{Math.floor(length / 60)}</LabelDiv>
        <Button id="session-increment" onClick={inc}>+</Button>
      </Row>
    </SetterWrapper>
  );
}

export default SessionSetter;