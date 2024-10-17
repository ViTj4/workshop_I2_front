import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Webcam from 'react-webcam';
import Image from 'next/image';
import InstagramSVG from './svgComps/InstagramSVG'; // Assurez-vous que le chemin est correct

const CameraCheck: React.FC = () => {
  const webcamRef = React.useRef<Webcam | null>(null);
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [image3, setImage3] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [showIdentityImage, setShowIdentityImage] = useState(true);
  const [showPlusSVG, setShowPlusSVG] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const signUpData = sessionStorage.getItem('signUpData');
    if (!signUpData) {
      Router.push('/signup');
    }
  }, []);

  const uploadImages = async () => {
    const formData = new FormData();
    if (image1 && image2 && image3) {
      const blob1 = await fetch(image1).then((res) => res.blob());
      const blob2 = await fetch(image2).then((res) => res.blob());
      const blob3 = await fetch(image3).then((res) => res.blob());

      // Ajout des trois images au formulaire
      formData.append('image1', blob1, 'recto.jpg');
      formData.append('image2', blob2, 'verso.jpg');
      formData.append('image3', blob3, 'face.jpg');

      try {
        const response = await fetch('http://10.60.136.199:5000/compare_faces', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erreur dans la réponse de l\'API');
        }

        const data = await response.json();
        
        // Vérifier la correspondance des visages et afficher le nom extrait
        if (data.same_person) {
          alert(`Correspondance confirmée ! Nom détecté : ${data.name.join(' ')}`);
          Router.push('/Validation')
          // Router.push('/Login');
        } else {
          alert('Les visages ne correspondent pas.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi des images :', error);
        alert('Une erreur est survenue lors de l\'envoi des images.');
      }
    } else {
      alert('Veuillez capturer les trois images avant de les envoyer.');
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (step === 1) {
      setImage1(imageSrc || null);
      setStep(2);
      setShowPlusSVG(true);
      setIsCameraActive(false);
    } else if (step === 2) {
      setImage2(imageSrc || null);
      setStep(3);
      setShowPlusSVG(true);
      setIsCameraActive(false);
    } else if (step === 3) {
      setImage3(imageSrc || null);
      setIsCameraActive(false);
    }
  };

  const startVerification = () => {
    setShowIdentityImage(false);
    setStep(1);
  };

  const activateCamera = () => {
    setIsCameraActive(true);
    setShowPlusSVG(false);
  };

  const deleteImage = (imageNumber: number) => {
    if (imageNumber === 1) {
      setImage1(null);
      setStep(1);
    } else if (imageNumber === 2) {
      setImage2(null);
      setStep(2);
    } else if (imageNumber === 3) {
      setImage3(null);
      setStep(3);
    }
    setIsCameraActive(true);
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const canUpload = image1 && image2 && image3;

  return (
    <div className="relative min-h-[100vh] w-full bg-[#fafafa] flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-between overflow-auto">
        <div className="flex flex-col items-center mt-10">
          <div className="mb-2" style={{ width: '150px', height: '40px' }}>
            <InstagramSVG disableDarkMode={false} white={false} />
          </div>
          <h1 className="text-center text-2xl font-semibold text-[#262626]">Vérification d&apos;identité</h1>
        </div>

        {showIdentityImage ? (
          <div className="flex flex-col items-center">
            <Image
              src="/identity.png"
              width={200}
              height={300}
              alt="identity logo"
            />
          </div>
        ) : (
          showPlusSVG && (
            <div
              className="flex flex-col items-center cursor-pointer mb-12"
              onClick={activateCamera}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && activateCamera()}
            >
              <Image src="/plus.svg" alt="Plus SVG" width={100} height={100} />
              <p className="text-center text-sm text-[#262626] mt-2">Cliquez pour activer la caméra</p>
            </div>
          )
        )}

        {isCameraActive && (
          <div className="flex flex-col items-center mt-5 mb-10">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-[320px] h-[240px] border border-stone-300"
            />
          </div>
        )}

        {/* Bouton d'action pour capturer */}
        <button
          type="button"
          onClick={step === 0 ? startVerification : capture}
          className="bg-[#3975EA] w-[80%] max-w-[400px] rounded-[8px] py-2 text-white text-m font-semibold  "
        >
          {getButtonText()}
        </button>

        {/* Bouton pour voir les images capturées */}
        {step > 0 && (
          <div className="relative mt-5 w-[80%] max-w-[400px]">
            <button type='button'
              className="bg-[#3975EA] w-full rounded-[8px] py-2 text-white text-m font-semibold"
              onClick={toggleDropdown}
            >
              Voir les images capturées
            </button>
            {dropdownOpen && (
              <div className="absolute bg-white w-full border border-gray-300 rounded-lg mt-2 shadow-lg max-h-[200px] overflow-y-auto">
                <ul className="list-none p-2">
                  {image1 && (
                    <li className="border-b border-gray-300 py-2">
                      <Image src={image1} alt="Captured 1" width={100} height={70} className="inline" />
                      <button type='button'
                        onClick={() => deleteImage(1)}
                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </li>
                  )}
                  {image2 && (
                    <li className="border-b border-gray-300 py-2">
                      <Image src={image2} alt="Captured 2" width={100} height={70} className="inline" />
                      <button type='button'
                        onClick={() => deleteImage(2)}
                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </li>
                  )}
                  {image3 && (
                    <li className="py-2">
                      <Image src={image3} alt="Captured 3" width={100} height={70} className="inline" />
                      <button type='button'
                        onClick={() => deleteImage(3)}
                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {canUpload && (
          <button
            type="button"
            onClick={uploadImages}
            className="bg-green-500 w-[80%] max-w-[400px] rounded-[8px] py-2 text-white text-m font-semibold mt-5 mb-10"
          >
            Envoyer les images.
          </button>
        )}
      </div>

      {/* Pied de page avec le logo Meta */}
      <footer className="w-full bg-[#fafafa] py-4 flex justify-center">
        <Image
          src="/meta.png"
          width={65}
          height={15}
          alt="Meta logo"
        />
      </footer>
    </div>
  );
};

export default CameraCheck;
