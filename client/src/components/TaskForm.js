import React, {useState} from 'react';

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

  return <div>
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor='name'>Task Name</label>
        <input type='text' id='name' onChange={e => setName(e.target.value)}
               value={name} required/>
      </div>

      <div>
        <label htmlFor='focusTime'>Focus Time</label>
        <input type='text' id='focusTime' onChange={e => setFocusTime(e.target.value)}
               value={focusTime} required/>
      </div>

      <div>
        <label htmlFor='relaxTime'>Relax Time</label>
        <input type='text' id='relaxTime' onChange={e => setRelaxTime(e.target.value)}
               value={relaxTime} required/>
      </div>

      {errorMessage && <div>{errorMessage}</div>}

      <button onClick={cancelHandler}>Cancel</button>
      <button type="submit">Save</button>
    </form>
  </div>;
}

TaskForm.defaultProps = {
  name: '',
  focusTime: '',
  relaxTime: ''
};

export default TaskForm;