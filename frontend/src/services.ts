import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.SERVER_URL || 'http://localhost:3000',
});

export const CreateNewAccessCode = async (email: string) => {
  return instance.post('/access-codes', { email });
};

export const ValidateAccessCode = async (email: string, accessCode: string) => {
  return instance.post('/access-codes/validate', { email, accessCode });
};

export const GeneratePostCaptions = async (
  socialNetwork: string,
  subject: string,
  tone: string
) => {
  return instance.post('/captions', {
    socialNetwork,
    subject,
    tone,
  });
};

export const SaveGeneratedContent = async (
  email: string,
  data: {
    socialNetwork: string;
    subject: string;
    tone: string;
    caption: string;
  }
) => {
  return instance.post('/posts', { email, data });
};

export const GetPostIdeas = async (topic: string) => {
  return instance.post('/ideas', { topic });
};

export const GenerateCaptionsFromIdea = async (subject: string) => {
  return instance.post('/captions/idea', { subject });
};

export const GetUsersGeneratedContent = async (email: string) => {
  return instance.get(`/captions?email=${encodeURIComponent(email)}`);
};

export const UnsaveContent = async (captionId: string) => {
  return instance.post('/captions/unsave', { captionId });
};
