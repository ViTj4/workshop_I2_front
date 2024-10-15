import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey           : 'AIzaSyCfOdhLu-APXE0NmeAXT3O8UpBYfR1Mxcg',
  authDomain       : 'workshop-f1ebd.firebaseapp.com',
  projectId        : 'workshop-f1ebd',
  storageBucket    : 'workshop-f1ebd.appspot.com',
  messagingSenderId: '739335601292',
  appId            : '1:739335601292:web:cfefcdc3c54217a7c44fa9'
};

const app = initializeApp(firebaseConfig);

export default app;
