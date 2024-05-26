import { useState, useEffect } from 'react';
import { Heading, useToast, Progress, Box } from '@chakra-ui/react';
import CaptionCardUnsave from '../components/CaptionCardUnsave';
import { GetUsersGeneratedContent, UnsaveContent } from '../services';

interface IProfileProps {
  email: string;
}

interface ISavedContent {
  id: string;
  caption: string;
  email: string;
  socialNetwork: string;
  subject: string;
  tone: string;
}

const Profile = (props: IProfileProps) => {
  const { email } = props;
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<ISavedContent[]>([]);

  const fetchSavedContent = async () => {
    setIsLoading(true);
    try {
      const response = await GetUsersGeneratedContent(email);
      setPosts(response.data.posts);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data.errorMessage ?? error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedContent();
  }, []);

  // Group posts by subject
  const postsBySubject = posts.reduce<Record<string, ISavedContent[]>>(
    (acc, post) => {
      (acc[post.subject] = acc[post.subject] || []).push(post);
      return acc;
    },
    {}
  );

  const unsaveContent = async (captionId: string) => {
    setIsLoading(true);
    try {
      await UnsaveContent(captionId);
      toast({
        title: 'Caption unsaved',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setPosts(posts.filter((post) => post.id !== captionId));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data.errorMessage ?? error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading size="md" marginBottom="4">
        Saved Content
      </Heading>
      {Object.entries(postsBySubject).map(([subject, posts], index) => (
        <Box key={index} marginBottom={4}>
          <Heading size="lg" marginBottom={2}>
            {subject}
          </Heading>
          {posts.map((post, index) => (
            <CaptionCardUnsave
              captionId={post.id}
              key={index}
              caption={post.caption}
              socialNetwork={post.socialNetwork}
              tone={post.tone}
              index={index}
              unsaveContent={unsaveContent}
            />
          ))}
        </Box>
      ))}
      {isLoading && <Progress size="xs" isIndeterminate marginTop={2} />}
    </>
  );
};

export default Profile;
