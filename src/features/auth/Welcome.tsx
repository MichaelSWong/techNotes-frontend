import { Link } from 'react-router-dom';

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);

  return (
    <section className='welcome'>
      <p>{today}</p>
      <h1>Welcome!</h1>
      <br />
      <p>
        <Link to='/dash/notes'>View techNotes</Link>
      </p>
      <br />
      <p>
        <Link to='/dash/notes/new'>Add New techNote</Link>
      </p>
      <br />
      <p>
        <Link to='/dash/users'>View User Settings</Link>
      </p>
      <br />
      <p>
        <Link to='/dash/users/new'>Add New User</Link>
      </p>
    </section>
  );
};

export default Welcome;
