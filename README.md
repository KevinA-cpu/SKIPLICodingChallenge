# SKIPLI Coding Challenge

The project use Node v20.10.0 with built-in support for dotenv. Ensure that you have the correct version of Node installed on your machine before running the project.

This project consists of a backend and a frontend. The backend is responsible for handling requests and interacting with various services such as Google Email Service, Firebase for storing data, and Gemini for generating captions and ideas base on various texts. The frontend is a React application using Chakra UI for styling.

I tried every possible way to try and use Twilio but there are some issues with it when trying to send a message to a verified phone number. Tried to add a new number, no verification code sent to my phone. There was no way to create a ticket as well. Time is money so I have decided to fallback to using Google Email Service.

## Backend

From the root folder, navigate to the `backend` directory by running the following command:

```bash
cd backend
```

Before running the backend, make sure to fill in the following environment variables in a `.env` file, following the '.env.template' file as a guide:

```

MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
OAUTH_REFRESH_TOKEN=your_oauth_refresh_token
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
GEMINI_API_KEY=your_gemini_api_key
PORT=your_port

```

To run the backend run the following commands:

```bash
npm install
npm run start
```

## Frontend

From the root folder, navigate to the `frontend` directory by running the following command:

```bash
cd frontend
```

Before running the frontend, make sure to fill in the following environment variables in a `.env` file, following the '.env.template' file as a guide:

```
SERVER_URL=your_server_url
```

To run the frontend, navigate to the `frontend` directory and run the following commands:

```bash
npm install
npm run start
```
