import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Webcam from 'react-webcam';
import Image from 'next/image'; // Importation du composant Image de Next.js
import InstagramSVG from './svgComps/InstagramSVG'; // Assurez-vous que le chemin est correct

const CameraCheck: React.FC = () => {
  const webcamRef = React.useRef<Webcam | null>(null);
  const [image1, setImage1] = useState<string | null>(null); // Image du recto
  const [image2, setImage2] = useState<string | null>(null); // Image du verso
  const [image3, setImage3] = useState<string | null>(null); // Image du visage
  const [capturedCount, setCapturedCount] = useState<number>(0); // Compteur d'images capturées
  const [isCameraActive, setIsCameraActive] = useState(false); // Pour contrôler l'activation de la caméra
  const [step, setStep] = useState<number>(0); // Étape de la vérification
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Pour afficher un message d'erreur

  const userData = {
    email: 'vito@hotmail.fr',
    password: 'Onche123',
    username: 'VitoZZ',
    fullName: 'vito scaletta',
  };

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

  // Fonction pour envoyer les images à l'API en utilisant FormData
  const uploadImages = async () => {
    console.log('Envoi des images à l\'API...');
    const formData = new FormData();

    if (image1 && image2 && image3) {
      // Convertir les images en Blob et les ajouter au FormData
      const blob1 = await fetch(image1).then((res) => res.blob());
      const blob2 = await fetch(image2).then((res) => res.blob());
      const blob3 = await fetch(image3).then((res) => res.blob());

      formData.append('image1', blob1, 'recto.jpg');
      formData.append('image2', blob2, 'verso.jpg');
      formData.append('image3', blob3, 'face.jpg');

      // Envoi des images à l'API
      const response = await fetch('http://10.60.136.165:5000/compare_faces', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('RESPONSE FROM API', data);
      console.log('NAME from API', data.name);

      // Vérification de la clé same_person
      if (data.same_person) {
        console.log('Utilisateur inscrit avec succès', { ...userData, same_person: true });
        setErrorMessage(null); // Réinitialiser les erreurs
        Router.push('/welcome');
      } else {
        setErrorMessage('Échec de la vérification d\'identité. Les visages ne correspondent pas. Veuillez réessayer.');
      }
    }
  };

  // Fonction de capture d'image
  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (step === 1) { // Étape du recto
      setImage1(imageSrc || null);
      console.log('Première image capturée (Recto)');
      setStep(2); // Passer à l'étape du verso
    } else if (step === 2) { // Étape du verso
      setImage2(imageSrc || null);
      console.log('Deuxième image capturée (Verso)');
      setStep(3); // Passer à l'étape de la photo du visage
    } else if (step === 3) { // Étape de la photo du visage
      setImage3(imageSrc || null);
      console.log('Troisième image capturée (Visage)');
      setCapturedCount(3); // Les trois images sont capturées
      uploadImages(); // Envoie les trois images à l'API
    }
  };

  // Fonction pour commencer la vérification
  const startVerification = () => {
    setIsCameraActive(true);
    setStep(1); // Passer à la première étape (Recto de la carte d'identité)
  };

  const getButtonText = () => {
    switch (step) {
      case 1:
        return 'Prendre en photo votre carte d\'identité - Recto';
      case 2:
        return 'Prendre en photo votre carte d\'identité - Verso';
      case 3:
        return 'Prendre une photo de vous';
      default:
        return 'Commencer la vérification';
    }
  };

  return (
    <div className="flex min-h-[100vh] w-full items-center justify-center bg-[#fafafa]">
      <div className="flex max-w-[700px] flex-col items-center justify-center bg-white p-10"> {/* Suppression de la classe border */}
        <div className="mb-10" style={{ width: '250px', height: '40px' }}>
          <InstagramSVG disableDarkMode={true} white={false} />
        </div>
        <h1 className="text-center text-2xl font-semibold text-[#262626] mb-5">Vérification d&apos;identité</h1>
        
        {/* Placement de l'image d'identité ici */}
        <div className="mb-5">
          <Image
            src="/identity.png"
            width={200} 
            height={300}
            alt="identity logo"
          />
        </div>

        {/* La caméra s'active seulement après avoir cliqué sur le bouton */}
        {isCameraActive && (
          <div className="mb-12">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-[1440px] h-[480px] border border-stone-300"
            />
          </div>
        )}

        <button
          type="button"
          onClick={step === 0 ? startVerification : capture}
          className="bg-[#3975EA] w-full rounded-[8px] py-2 text-white text-sm font-semibold"
        >
          {getButtonText()}
        </button>

        {image1 && (
          <div className="mt-5">
            <h3 className="text-center text-[#262626] font-semibold">Première image capturée (Recto) :</h3>
            <Image src={image1} alt="Captured 1" width={300} height={200} className="border border-stone-300 mt-2" />
          </div>
        )}

        {image2 && (
          <div className="mt-5">
            <h3 className="text-center text-[#262626] font-semibold">Deuxième image capturée (Verso) :</h3>
            <Image src={image2} alt="Captured 2" width={300} height={200} className="border border-stone-300 mt-2" />
          </div>
        )}

        {image3 && (
          <div className="mt-5">
            <h3 className="text-center text-[#262626] font-semibold">Troisième image capturée (Votre photo) :</h3>
            <Image src={image3} alt="Captured 3" width={300} height={200} className="border border-stone-300 mt-2" />
          </div>
        )}

        {capturedCount === 3 && <p className="mt-5 text-green-600 text-center">Les trois images ont été capturées et envoyées.</p>}

        {errorMessage && <p className="mt-5 text-red-600 text-center">{errorMessage}</p>}
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <Image
          src="/meta.png"
          width={65} 
          height={15}
          alt="Meta logo"
        />
      </div>
    </div>
  );
};

export default CameraCheck;
