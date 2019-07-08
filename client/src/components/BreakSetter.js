import React from 'react';
import {Button, LabelDiv, Row, SetterWrapper} from "./styled-elements";

function BreakSetter(props) {
  const {length, inc, dec} = props;
  return (
    <SetterWrapper>
      <LabelDiv id="break-label">Break Length</LabelDiv>
      <Row>
        <Button id="break-decrement" onClick={dec}>-</Button>
        <LabelDiv as="span" id="break-length">{Math.floor(length / 60)}</LabelDiv>
        <Button id="break-increment" onClick={inc}>+</Button>
      </Row>
    </SetterWrapper>
  );
}

export default BreakSetter;