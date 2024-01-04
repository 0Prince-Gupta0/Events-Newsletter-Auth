import { Form, Link, json, redirect, useActionData,  useNavigation, useSearchParams } from 'react-router-dom';

import classes from './AuthForm.module.css';

function AuthForm() {

  const data=useActionData();
 const navigation=useNavigation();
   
const[searchParams]=useSearchParams();
const isLogin=searchParams.get('mode')==='login';
const isSubmitting=navigation.state==='submitting';
  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
        {data && data.errors && (
          <ul>
            {Object.values(data.errors).map((err)=>(
              <li key={err}>
                {err}
              </li>
            ))}
          </ul>
        )}
        {data && data.message && <p>{data.message}</p>}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin?'signup':'login'}`}>
            {isLogin ? 'Create new user' : 'Login'}
          </Link>
          <button disabled={isSubmitting}>{isSubmitting?'Submitting':'Save'}</button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;


export async function action ({request})
{
const searchParams=new URL(request.url).searchParams;
const mode=searchParams.get('mode')||'login';

if(mode!=='login' && mode !=='signup')
{
  throw json({message:'UnsupportedMode'},{status:422});
}

  const data=await request.formData()
  const authData={
    email:data.get('email'),
    password:data.get('password')
  }

  const response=await fetch('http://localhost:8080/'+mode,{
    method:'POST',
    headers:{'Content-Type':'Application/json',
    },
    body:JSON.stringify(authData)
  });
  console.log(response.status);

  if(response.status===422 || response.status===401)
  {
    return response;
  }

  if(!response.ok)
  {
    throw json({message:"Could not Authenticate"},{status:500});
  }

  const resData=await response.json();
  const token=resData.token;
  console.log(token);
  localStorage.setItem('token',token);
  const expiration=new Date();
  expiration.setHours(expiration.getHours()+1);
localStorage.setItem('expiration',expiration.toISOString());

  return redirect('/');
}