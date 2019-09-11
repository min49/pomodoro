import React from 'react';
import {Button, Header, Icon} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {FeaturesContainer, FeaturesItem} from '../components/styled-elements';


function Features() {

  return (
    <FeaturesContainer>
      <Header as='h2'>Features</Header>
      <FeaturesItem>
        <Icon name='list'/>Categorize pomodoro sessions by tasks.
      </FeaturesItem>
      <FeaturesItem>
        <Icon name='setting'/>Customize focus and relax time intervals.
      </FeaturesItem>
      <FeaturesItem>
        <Icon name='table'/>View stats of completed sessions.
      </FeaturesItem>
      <Button as={Link} to='/register'>Create an account</Button>
    </FeaturesContainer>
  );
}

export default Features;