import React, { useEffect } from 'react';
import Router from 'next/router';
import Webcam from 'react-webcam';

const CameraCheck: React.FC = () => {
  const webcamRef = React.useRef<Webcam | null>(null);

  useEffect(() => {
    // Récupérer les données du sessionStorage
    const signUpData = sessionStorage.getItem('signUpData');
    if (signUpData) {
      console.log('Données utilisateur récupérées : ', JSON.parse(signUpData));
    } else {
      // Si les données ne sont pas présentes, rediriger vers la page d'inscription
      Router.push('/signup');
    }
  }, []);

  const handleIdentityCheck = () => {
    // Logique de vérification avec la caméra ici...
    console.log('Vérification d&apos;identité en cours...');
    // Une fois validé, tu peux compléter l'inscription en utilisant les données récupérées
  };

  return (
    <div>
      <h1>Vérification d&apos;identité</h1>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <button type="button" onClick={handleIdentityCheck}>Valider l&apos;identité</button>
    </div>
  );
};

export default CameraCheck;
