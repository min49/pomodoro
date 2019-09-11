import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Container, Header, List, Segment} from 'semantic-ui-react';

import PasswordChangeForm from '../components/PasswordChangeForm';
import FormContainer from "../components/FormContainer";

function Settings(props) {
  const {isAuthenticated, tasks} = props;

  if (!isAuthenticated) {
    return <div>Please login or Register.</div>
  }

  return <>
    <Container>
      <Segment padded='very' as='section'>
        <Header as='h2'>Tasks</Header>
        <List bulleted divided relaxed='very' selection>
          {tasks.map(el => (
            <List.Item as={Link} key={el._id} to={`/settings/task/${el._id}`}>
              <List.Content>
                <List.Header>{el.name}</List.Header>
              </List.Content>
            </List.Item>
          ))}
        </List>
        <Button as={Link} to='/settings/task/new'>Add Task</Button>
      </Segment>
      <FormContainer title='Change Password' noContainer='true'>
        <PasswordChangeForm isAuthenticated={isAuthenticated}/>
      </FormContainer>
    </Container>
  </>;
}

export default Settings;