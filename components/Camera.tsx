import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Webcam from 'react-webcam';
import Image from 'next/image'; // Import de Image de Next.js

const CameraCheck: React.FC = () => {
  const webcamRef = React.useRef<Webcam | null>(null);
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null); // Pour la deuxième image
  const [capturedCount, setCapturedCount] = useState<number>(0);

  useEffect(() => {
    // Vérifier les permissions de la webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        console.log('Webcam permission granted.');
      })
      .catch((error) => {
        console.error('Webcam permission denied: ', error);
      });

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
  const uploadImages = async (img2: string) => {
    const formData = new FormData();

    if (image1) {
      // Convertir les images en Blob et les ajouter au FormData
      const blob1 = await fetch(image1).then(res => res.blob());
      const blob2 = await fetch(img2).then(res => res.blob());

      formData.append('image1', blob1, 'image1.jpg');
      formData.append('image2', blob2, 'image2.jpg');

      // Envoi des images à l'API
      const response = await fetch('http://172.20.10.3:5000/compare_faces', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);
    }
  };

  // Fonction de capture d'image
  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (capturedCount === 0) {
      setImage1(imageSrc || null); // Enregistre la première image
      setCapturedCount(1); // Incrémente le compteur
    } else if (capturedCount === 1) {
      setImage2(imageSrc || null); // Enregistre la deuxième image
      setCapturedCount(2); // Incrémente le compteur
      uploadImages(imageSrc || ''); // Envoie les deux images à l'API
    }
  };

  return (
    <div>
      <h1>Vérification d&apos;identité</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        onUserMedia={() => console.log('Webcam activée.')}
      />
      <button type="button" onClick={capture}>
        Capturer l&apos;image
      </button>

      {image1 && (
        <div>
          <h3>Première image capturée :</h3>
          <Image src={image1} alt="Captured 1" width={300} height={200} /> {/* Utilisation de next/image */}
        </div>
      )}

      {image2 && (
        <div>
          <h3>Deuxième image capturée :</h3>
          <Image src={image2} alt="Captured 2" width={300} height={200} /> {/* Utilisation de next/image */}
        </div>
      )}

      {capturedCount === 2 && <p>Les deux images ont été capturées et envoyées.</p>}
    </div>
  );
};

export default CameraCheck;
