import { Form, NavLink, useRouteLoaderData, useSubmit } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import NewsletterSignup from './NewsletterSignup';
import { useEffect } from 'react';

function MainNavigation() {
  const token=useRouteLoaderData('root');
  const submit=useSubmit();
  useEffect(()=>{
  if(!token)
  {
    return ;
  }
  if(token==="EXPIRED")
  {
    submit(null,{action:'/logout',method:'post'});
    return;
  }
  setTimeout(() => {
    submit(null,{action:'/logout',method:'post'});
  }, 1*60*60*1000);
  },[token,submit])
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/newsletter"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Newsletter
            </NavLink>
          </li>
          {!token && <li>
            <NavLink
              to="/auth?mode=login"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Authentication
            </NavLink>
          </li>}
          {token && <li>
            <Form action='logout' method='post'>
              <button>Logout</button>
            </Form>
          </li>}
        </ul>
      </nav>
      <NewsletterSignup />
    </header>
  );
}

export default MainNavigation;
