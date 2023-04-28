
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupForm({ signup }) {
  const [formData, setFormData] = useState(
    {
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      email: ''
    });

  const navigate = useNavigate();

  function handleChange(evt) {
    const fieldName = evt.target.name;
    const value = evt.target.value;

    setFormData(currData => {
      currData[fieldName] = value;
      return { ...currData };
    });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    console.log('I am form data after setFormData', formData);
    await signup(formData);
    navigate("/");
  }

  return (
    <form className="SignupForm" onSubmit={handleSubmit}>
      <div className="SignupForm-div" key={'SignupForm-div'} >
        <div>
          <input
            id='SignupForm-username'
            key='username'
            name='username'
            type='text'
            placeholder='username'
            value={formData.username}
            onChange={handleChange}
            aria-label="Title"
          />
        </div>
        <div>
          <input
            id='SignupForm-firstName'
            key='firstName'
            name='firstName'
            type='text'
            placeholder='firstName'
            value={formData.firstName}
            onChange={handleChange}
            aria-label="Title"
          />
        </div>
        <div>
          <input
            id='SignupForm-lastName'
            key='lastName'
            name='lastName'
            type='text'
            placeholder='lastName'
            value={formData.lastName}
            onChange={handleChange}
            aria-label="Title"
          />
        </div>
        <div>
          <input
            id='SignupForm-password'
            key='password'
            name='password'
            type='password'
            placeholder='password'
            value={formData.password}
            onChange={handleChange}
            aria-label="Title"
          />
        </div>
        <div>
          <input
            id='SignupForm-email'
            key='email'
            name='email'
            type='text'
            placeholder='email'
            value={formData.email}
            onChange={handleChange}
            aria-label="Title"
          />
        </div>
      </div>

      <input className='SignupForm-submit' type='submit' value='Log In!'>

      </input>
    </form>
  );

}

export default SignupForm;