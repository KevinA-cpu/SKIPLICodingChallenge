const express = require('express');
const bodyParser = require('body-parser');
const argon2 = require('argon2');
const cors = require('cors');
// const client = require('twilio')(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );
const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  deleteDoc,
} = require('firebase/firestore');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();

const usersCollection = collection(db, 'users');
const postsCollection = collection(db, 'posts');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/access-codes', async (req, res) => {
  const { email } = req.body;

  const accessCode = Math.floor(100000 + Math.random() * 900000);

  try {
    // Send the verification code via SMS
    // await client.messages.create({
    //   body: `Your verification code is: ${verificationCode}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone,
    // });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: 'Access Code',
      text: `Your access code is: ${accessCode}`,
    };

    // Send the access code via email
    await transporter.sendMail(mailOptions);

    const hashAccessCode = await argon2.hash(accessCode.toString(), {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
    });

    const userDoc = doc(db, 'users', email);
    await setDoc(
      userDoc,
      {
        accessCode: hashAccessCode,
      },
      { merge: true }
    );

    res.json({ accessCode });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

app.post('/access-codes/validate', async (req, res) => {
  const { email, accessCode } = req.body;

  try {
    const querySnapshot = await getDocs(usersCollection);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const user = users.find((user) => user.id === email);

    if (!user) {
      return res.status(404).json({ errorMessage: 'User not found' });
    }

    const isValid = await argon2.verify(user.accessCode, accessCode.toString());

    if (!isValid) {
      return res.status(400).json({ errorMessage: 'Invalid access code' });
    }

    // Create a document reference with the user's email
    const userDoc = doc(db, 'users', email);

    // Set the access code to empty
    await updateDoc(userDoc, {
      accessCode: '',
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

app.post('/captions', async (req, res) => {
  const { socialNetwork, subject, tone } = req.body;

  try {
    const result = await model.generateContent(
      `Generate 5 separate caption, each one with a ${tone} tone for a ${socialNetwork} post about ${subject}`
    );
    const response = await result.response;
    let captions = response.text().split('\n');

    // Remove the first element from the array
    captions.shift();

    // Filter out any empty strings
    captions = captions.map((caption) => {
      // Remove asterisks
      let cleanCaption = caption.replace(/\*\*/g, '');
      // Remove numbers at the start of the caption
      cleanCaption = cleanCaption.replace(/^\d+\.\s*/, '');
      // Remove quotation marks
      cleanCaption = cleanCaption.replace(/"/g, '');
      return cleanCaption;
    });

    captions = captions.filter((caption) => caption.trim() !== '');

    res.json({ captions });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

app.post('/posts', async (req, res) => {
  const { email, data } = req.body;
  if (!email) {
    return res.status(400).json({ errorMessage: 'Please provide email' });
  }
  if (!data) {
    return res.status(400).json({ errorMessage: 'Please provide data' });
  }
  if (!data.subject)
    return res.status(400).json({ errorMessage: 'Please provide a subject' });
  if (!data.caption)
    return res.status(400).json({ errorMessage: 'Please provide a caption' });
  if (!data.socialNetwork)
    return res
      .status(400)
      .json({ errorMessage: 'Please provide a social network' });
  if (!data.tone)
    return res.status(400).json({ errorMessage: 'Please provide a tone' });

  try {
    await addDoc(postsCollection, {
      email,
      ...data,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

app.post('/ideas', async (req, res) => {
  const { topic } = req.body;

  try {
    const result = await model.generateContent(
      `Generate 10 separate post ideas for a ${topic} post on social media, a single bullet point list will do`
    );
    const response = await result.response;

    let postIdeas = response.text().split('\n');

    postIdeas = postIdeas.map((postIdea) => {
      let cleanPostIdea = postIdea.replace(/\*\*/g, '');
      cleanPostIdea = cleanPostIdea.replace(/^\d+\.\s*/, '');
      cleanPostIdea = cleanPostIdea.replace(/"/g, '');
      cleanPostIdea = cleanPostIdea.replace(/- /, '');
      cleanPostIdea = cleanPostIdea.replace(/\* /, '');
      return cleanPostIdea;
    });

    postIdeas = postIdeas.filter((postIdea) => postIdea.trim() !== '');

    res.json({ postIdeas });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

app.post('/captions/idea', async (req, res) => {
  const { subject } = req.body;

  try {
    const result = await model.generateContent(
      `Generate 5 separate caption, each one for this ${subject} post`
    );
    const response = await result.response;
    let captions = response.text().split('\n');

    // Remove the first element from the array
    captions.shift();

    // Filter out any empty strings
    captions = captions.map((caption) => {
      // Remove asterisks
      let cleanCaption = caption.replace(/\*\*/g, '');
      // Remove numbers at the start of the caption
      cleanCaption = cleanCaption.replace(/^\d+\.\s*/, '');
      // Remove quotation marks
      cleanCaption = cleanCaption.replace(/"/g, '');
      return cleanCaption;
    });

    captions = captions.filter((caption) => caption.trim() !== '');

    res.json({ captions });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

app.get('/captions', async (req, res) => {
  const { email } = req.query;
  try {
    const postsQuery = query(postsCollection, where('email', '==', email));
    const querySnapshot = await getDocs(postsQuery);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

app.post('/captions/unsave', async (req, res) => {
  const { captionId } = req.body;

  if (!captionId) {
    return res.status(400).json({ errorMessage: 'Please provide post id' });
  }

  try {
    const postDoc = doc(db, 'posts', captionId);
    await deleteDoc(postDoc);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

app.post('/unsave-content', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ errorMessage: 'Please provide post id' });
  }

  try {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
