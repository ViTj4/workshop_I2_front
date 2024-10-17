import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import Image from 'next/image'; // Move this up
import { NextPage } from 'next';
import InstagramSVG from '../components/svgComps/InstagramSVG';

const Validation: NextPage = () => {


  const handleSignUp = (e: any) => {
    Router.push('/Login');
  };

  return (
    <div className="relative min-h-[100vh] bg-[#fafafa]">
      <Head>
        <title>Instagram • Sign up</title>
        <meta name="description" content="Instagram Clone" />
        <link rel="icon" href="/instagram.png" />
      </Head>
      <div className="flex min-h-[100vh] w-full items-center justify-center">
        <div>
          <div className="flex max-w-[350px] flex-col items-center justify-center border border-stone-300 bg-white">
            <div className="h-auto w-[175px] pt-10 pb-5">
              <InstagramSVG disableDarkMode white={false} />
            </div>
            <div className="px-10 pb-5 text-center font-semibold text-[#8e8e8e]">
              <p>Votre identité a été validée.</p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/GreenCheck.png"
                width={150}
                height={150}
                alt="identity logo"
              />
                <button
                  className="
                    my-5 
                    w-3/4 
                    rounded-[4px] 
                    px-2 
                    py-1 
                    text-sm 
                    font-semibold 
                    text-white 
                    bg-blue-500 
                    hover:bg-blue-600 
                    transition-colors 
                    duration-200 
                    ease-in-out
                  "
                  type="submit"
                  onClick={handleSignUp}
                >
                  Accéder à Instagram
                </button>
            </div>

          </div>
        </div>
      </div>
      {/* Logo Meta centré en bas */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <Image
          src="/meta.png"
          width={80} // Réduction de la taille du logo
          height={30} // Réduction de la taille du logo
          alt="Meta logo"
        />
      </div>
    </div>
  );
};

export default Validation;
