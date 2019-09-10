import React, {useState} from 'react';
import {Button, Form, Message} from 'semantic-ui-react';

function TaskForm(props) {
  const [name, setName] = useState(props.name);
  const [focusTime, setFocusTime] = useState(props.focusTime);
  const [relaxTime, setRelaxTime] = useState(props.relaxTime);
  const {errorMessage, submitAction, cancelAction} = props;

  function submitHandler(e) {
    e.preventDefault();
    submitAction({name, focusTime, relaxTime});
  }

  function cancelHandler(e) {
    e.preventDefault();
    cancelAction();
  }

  return <Form onSubmit={submitHandler} error={!!errorMessage}>
    <Form.Field required>
      <label htmlFor='name'>Task Name</label>
      <input type='text' id='name' onChange={e => setName(e.target.value)}
             value={name} required/>
    </Form.Field>

    <Form.Field required>
      <label htmlFor='focusTime'>Focus Time</label>
      <input type='number' id='focusTime' min='1' onChange={e => setFocusTime(e.target.value)}
             value={focusTime} required/>
    </Form.Field>

    <Form.Field required>
      <label htmlFor='relaxTime'>Relax Time</label>
      <input type='number' id='relaxTime' min='1' onChange={e => setRelaxTime(e.target.value)}
             value={relaxTime} required/>
    </Form.Field>

    {errorMessage && <Message error>{errorMessage}</Message>}

    <Button onClick={cancelHandler}>Cancel</Button>
    <Button primary type="submit">Save</Button>
  </Form>;
}

TaskForm.defaultProps = {
  name: '',
  focusTime: '',
  relaxTime: ''
};

export default TaskForm;