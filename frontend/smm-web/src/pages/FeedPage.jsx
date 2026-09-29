import { useState } from 'react';

import {
  Avatar,
  Box,
  Container,
  InputBase,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Button,
} from '@mui/material';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';

import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import {
  useNavigate,
} from 'react-router-dom';

import { getPosts } from '../features/posts/api/postsApi';

import { getFriends } from '../features/friends/api/friendsApi';

import {
  openConversation,
} from '../features/messages/api/messagesApi';

import {
  useAuthStore,
} from '../features/auth/store/authStore';

import {
  API_ORIGIN,
} from '../config';

import CreatePostCard from '../features/posts/components/CreatePostCard';

import PostCard from '../features/posts/components/PostCard';

export default function FeedPage() {
  const user =
    useAuthStore(
      (state) => state.user
    );

  const navigate =
    useNavigate();

  
  const [search, setSearch] =
    useState('');

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'posts',
      search,
    ],

    queryFn: () =>
      getPosts({
        page: 1,
        pageSize: 20,
        search,
      }),
  });

 
  const friendsQuery =
    useQuery({
      queryKey: [
        'friends',
      ],

      queryFn:
        getFriends,
    });

  const openChatMutation =
    useMutation({
      mutationFn:
        openConversation,

      onSuccess: (result) => {
        navigate(
          `/messages?conversation=${result.conversationId}`
        );
      },
    });

  const onlineFriends =
    friendsQuery.data?.filter(
      (friend) =>
        friend.isOnline === true
    ) ?? [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f6f8fc',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >
        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              md:
                '240px minmax(0, 680px)',
              lg:
                '240px minmax(0, 680px) 300px',
            },

            gap: 3,

            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                position: 'sticky',
                top: 96,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack spacing={1.2}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                >
                  Navigation
                </Typography>

                <Typography fontWeight={700}>
                  Home
                </Typography>

                <Typography color="text.secondary">
                  Friends
                </Typography>

                <Typography color="text.secondary">
                  Messages
                </Typography>

                <Typography color="text.secondary">
                  Notifications
                </Typography>
              </Stack>
            </Paper>
          </Box>

          <Stack spacing={2.5}>

            

            <Paper
              elevation={0}
              sx={{
                p: 1.2,
                px: 2,
                borderRadius: 999,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'white',
              }}
            >
              <SearchRoundedIcon
                color="action"
              />

              <InputBase
                fullWidth
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search posts..."
              />
            </Paper>

            <CreatePostCard />

            {isLoading &&
              [1, 2, 3].map(
                (item) => (
                  <Paper
                    key={item}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          'flex',
                        gap: 1.5,
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        width={46}
                        height={46}
                      />

                      <Box
                        sx={{
                          flex: 1,
                        }}
                      >
                        <Skeleton width="30%" />
                        <Skeleton width="20%" />
                      </Box>
                    </Box>

                    <Skeleton
                      height={24}
                      sx={{
                        mt: 2,
                      }}
                    />

                    <Skeleton
                      height={24}
                      width="75%"
                    />
                  </Paper>
                )
              )}

            {isError && (
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                }}
              >
                <Typography color="error">
                  Feed could not be loaded.
                </Typography>
              </Paper>
            )}

            {data?.items?.map(
              (post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              )
            )}

            {!isLoading &&
              data?.items?.length === 0 && (
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    No posts found.
                  </Typography>
                </Paper>
              )}
          </Stack>

          

          <Box
            sx={{
              display: {
                xs: 'none',
                lg: 'block',
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                position: 'sticky',
                top: 96,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                fontWeight={800}
                mb={2}
              >
                Contacts
              </Typography>

              {friendsQuery.isLoading && (
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Loading...
                </Typography>
              )}

              {!friendsQuery.isLoading &&
                onlineFriends.length === 0 && (
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    No friends online.
                  </Typography>
                )}

              <Stack spacing={1.5}>
                {onlineFriends.map(
                  (friend) => {
                    const avatar =
                      friend.profileImageUrl
                        ? friend.profileImageUrl.startsWith(
                            'http'
                          )
                          ? friend.profileImageUrl
                          : `${API_ORIGIN}${friend.profileImageUrl}`
                        : null;

                    return (
                      <Box
                        key={friend.id}
                        sx={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            position:
                              'relative',
                          }}
                        >
                          <Avatar
                            src={
                              avatar ||
                              undefined
                            }
                            sx={{
                              width: 42,
                              height: 42,
                            }}
                          >
                            {
                              friend
                                .firstName?.[0]
                            }
                          </Avatar>

                          <Box
                            sx={{
                              position:
                                'absolute',
                              right: 0,
                              bottom: 0,
                              width: 11,
                              height: 11,
                              borderRadius:
                                '50%',
                              bgcolor:
                                '#22c55e',
                              border:
                                '2px solid white',
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            noWrap
                          >
                            {
                              friend.firstName
                            }{' '}
                            {
                              friend.lastName
                            }
                          </Typography>

                          <Typography
                            variant="caption"
                            color="success.main"
                          >
                            Online
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          variant="contained"
                          startIcon={
                            <ChatBubbleRoundedIcon />
                          }
                          disabled={
                            openChatMutation.isPending
                          }
                          onClick={() =>
                            openChatMutation.mutate(
                              friend.id
                            )
                          }
                          sx={{
                            borderRadius:
                              999,
                            textTransform:
                              'none',
                            minWidth: 0,
                          }}
                        >
                          Message
                        </Button>
                      </Box>
                    );
                  }
                )}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

