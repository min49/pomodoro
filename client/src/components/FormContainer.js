import React from 'react';
import {Container, Grid, Header, Segment} from 'semantic-ui-react';

function FormContainer(props) {
  const {title, children, noContainer} = props;

  const content = (
    <Segment padded='very' as='section'>
      {title ? <Header as='h2'>{title}</Header> : null}
      <Grid>
        <Grid.Column mobile={16} tablet={8} computer={6}>
          {children}
        </Grid.Column>
      </Grid>
    </Segment>
  );

  if (noContainer) {
    return content;
  } else {
    return <Container>{content}</Container>;
  }
}

export default FormContainer;