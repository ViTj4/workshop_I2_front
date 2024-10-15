import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { NextPage } from 'next';
import useSetFormErrors from '../hooks/useSetFormErrors';
import InstagramSVG from '../components/svgComps/InstagramSVG';

const SignUp: NextPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [emailFormErrors, setEmailFormErrors] = React.useState('');
  const [passwordFormErrors, setPasswordFormErrors] = React.useState('');
  const [usernameFormErrors, setUsernameFormErrors] = React.useState('');

  useSetFormErrors({
    email,
    password,
    username,
    setEmailFormErrors,
    setPasswordFormErrors,
    setUsernameFormErrors,
  });

  const handleSignUp = (e: any) => {
    e.preventDefault();
    // Validation ici...
    if (emailFormErrors === '' && passwordFormErrors === '' && usernameFormErrors === '') {
      // Stocker les données dans le sessionStorage
      sessionStorage.setItem('signUpData', JSON.stringify({ email, password, username, fullName }));

      // Rediriger vers la page CameraCheck pour le contrôle d'identité
      Router.push('/Camera');
    }
  };

  return (
    <div>
      <Head>
        <title>Instagram • Sign up</title>
        <meta name="description" content="Instagram Clone" />
        <link rel="icon" href="/instagram.png" />
      </Head>
      <div className="flex min-h-[100vh] w-full items-center justify-center bg-[#fafafa]">
        <div>
          <div className="flex max-w-[350px] flex-col items-center justify-center border border-stone-300 bg-white">
            <div className="h-auto w-[175px] pt-10 pb-5">
              <InstagramSVG disableDarkMode white={false} />
            </div>
            <div className="px-10 pb-5 text-center font-semibold text-[#8e8e8e]">
              <p>Sign up to see photos and videos from your friends.</p>
            </div>
            <div className="w-full px-10">
              <form
                action=""
                className="signInPageFormContainer"
                onSubmit={handleSignUp}
              >
                <label htmlFor="signUpFullName">
                  <input
                    className="w-full border border-stone-300 bg-[#fafafa] px-2 py-[7px] text-sm focus:outline-none"
                    type="text"
                    id="signUpFullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                  />
                </label>
                <p className="h-[20px] pb-2 text-[10px] text-red-600" />
                <label htmlFor="signInPageUserName">
                  <input
                    className="w-full border border-stone-300 bg-[#fafafa] px-2 py-[7px] text-sm focus:outline-none"
                    type="text"
                    id="signInPageUserName"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                  />
                </label>
                <p className="h-[30px] text-[10px] text-red-600">
                  {usernameFormErrors}
                </p>
                <label htmlFor="signInPageEmail">
                  <input
                    className=" w-full border border-stone-300 bg-[#fafafa] px-2 py-[7px] text-sm focus:outline-none"
                    type="email"
                    id="signInPageEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                  />
                </label>
                <p className="h-[20px] pb-2 text-[10px] text-red-600">
                  {emailFormErrors}
                </p>
                <label htmlFor="signInPagePassword">
                  <input
                    className="w-full border border-stone-300 bg-[#fafafa] px-2 py-[7px] text-sm focus:outline-none"
                    type="password"
                    id="signInPagePassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                </label>
                <p className="h-[20px] text-[10px] text-red-600">
                  {passwordFormErrors}
                </p>
                <button
                  className={`${
                    emailFormErrors === '' && passwordFormErrors === ''
                      ? 'bg-[#0095f6]'
                      : 'pointer-events-none cursor-default bg-[#abddff]'
                  } my-5 w-full rounded-[4px]  px-2 py-1 text-sm font-semibold text-white`}
                  type="submit"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
