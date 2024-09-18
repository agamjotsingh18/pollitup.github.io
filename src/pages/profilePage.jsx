import React from "react";

import {
  Container,
  Box,
  Flex,
  Stack,
  HStack,
  Heading,
  Avatar,
  Input,
  Textarea,
  Text,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  //UnorderedList
} from "@chakra-ui/react";

import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import "firebase/auth";
import { useAuth } from "../lib/auth";
import { addDoc, getDoc, getUserDocs } from "../lib/db";
import { useParams } from "react-router-dom";
//import { FaBorderNone } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Poll from "../components/poll";

export default function Profile(props) {
  const { user, loadingUser } = useAuth();
  const [userDoc, setUserDoc] = React.useState();
  const [userData, setUserData] = React.useState();
  const { uid } = useParams();

  const [edit, setEdit] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(""); //get from firebase
  const [desc, setDesc] = React.useState("");
  const [showIconModal, setShowIconModal] = React.useState(false);
  const [pfpLink, setPfpLink] = React.useState("");
  const [polls, setPolls] = React.useState([]);
  const toast = useToast();
  const [OpenShare, setOpenShare] = React.useState(false);

  React.useEffect(() => {
    //if (!user && !loadingUser) return window.location.href = '/login';
    if (!user) return;

    async function checkUserDoc() {
      const userDatas = await getDoc("users", uid ? uid : user.uid);
      if (!userDatas) {
        await addDoc(
          "users",
          {
            displayName: "",
            description: "",
            logo: "",
          },
          user.uid
        );
      }
      setUserData(userDatas);
      console.log(userDatas);
    }
    checkUserDoc();

    async function getPolls() {
      const userDocs = await getUserDocs("polls", uid ? uid : user.uid);
      setPolls(userDocs);
      // setDisplayName(user.displayName ? user.displayName : "");
      setUserDoc(user);
      // setPfpLink(user.pfpLink)
      setPolls(userDocs);
      // setDesc(user.description)
      console.log(userDocs);
    }
    getPolls();
  }, [user, loadingUser]);

  async function saveData() {
    let newDoc;
    console.log(pfpLink, displayName, desc);
    newDoc = {
      logo: pfpLink ? pfpLink : userData?.logo,
      displayName: displayName ? displayName : userData?.displayName,
      description: desc ? desc : userData?.description,
    };

    delete newDoc.id;
    await addDoc("users", newDoc, user.uid);
    setUserDoc({ newDoc });
    setShowIconModal(false);
    setUserData({
      ...userData,
      logo: pfpLink ? pfpLink : userData?.logo,
      displayName: displayName ? displayName : userData?.displayName,
      description: desc ? desc : userData?.description,
    });
  }

  let share = () => {
    let copyText = `${window.location.href}/` + user.uid;

    try {
      navigator.clipboard.writeText(copyText);

      toast({
        title: "Copied to Clipboard",
        description: "The sharing link is copied to clipboard",
        status: "success",
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Error copying to clipboard",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Container maxW="container.lg" align="center">
        <Modal isOpen={showIconModal} onClose={() => setShowIconModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                mb={2}
                placeholder="Logo URL"
                value={pfpLink}
                onChange={(e) => setPfpLink(e.target.value)}
              />
              <Input
                mb={2}
                placeholder="Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Textarea
                mb={2}
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={saveData}>
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={OpenShare} onClose={() => setOpenShare(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Share To</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HStack spacing={"16px"}>
                <FacebookShareButton
                  url={`https://pollitup.vercel.app/profile/${user?.uid}`}
                  quote={"Visit PollItUp"}
                  hashtag="#pollItUp"
                >
                  <FacebookIcon size={45} round={true} />
                </FacebookShareButton>
                <WhatsappShareButton
                  title="pollItUp"
                  url={`https://pollitup.vercel.app/profile/${user?.uid}`}
                >
                  <WhatsappIcon size={45} round={true} />
                </WhatsappShareButton>
                <TwitterShareButton
                  url={`https://pollitup.vercel.app/profile/${user?.uid}`}
                >
                  <TwitterIcon size={45} round={true} />
                </TwitterShareButton>
                <LinkedinShareButton
                  title="poll It Up"
                  url={`https://pollitup.vercel.app/profile/${user?.uid}`}
                >
                  <LinkedinIcon size={45} round={true} />
                </LinkedinShareButton>
                <TelegramShareButton
                  url={`https://pollitup.vercel.app/profile/${user?.uid}`}
                >
                  <TelegramIcon size={45} round={true} />
                </TelegramShareButton>
                <PinterestShareButton
                  description={`Checkout my profile in pollItUp`}
                  media={`https://pollitup.vercel.app/profile/${user?.uid}`}
                >
                  <PinterestIcon size={45} round={true} />
                </PinterestShareButton>
                <RedditShareButton
                  title="poll It Up"
                  url={`https://pollitup.vercel.app/profile/${user?.uid}`}
                >
                  <RedditIcon size={45} round={true} />
                </RedditShareButton>
              </HStack>
            </ModalBody>

            <ModalFooter>
              <Container mt={2} mb={5} centerContent>
                <Button colorScheme="blue" mr={3} onClick={share}>
                  copy text to clipboard
                </Button>
              </Container>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Heading align="center" m={12}>
          {uid === undefined ? "Your " : ""}Profile
        </Heading>
        <Container maxW="container.sm">
          <Stack p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Flex justify>
              <Box p={4}>
                <Avatar size="xl" src={user?.photoURL} />
              </Box>
              <Stack flex={1} m={4}>
                <Stack direction={{ base: "column", md: "row" }}>
                  <Box w={{ base: "100%", md: "50%" }} m={2}>
                    <Text align="left">Display name</Text>
                  </Box>
                  <Box w={{ base: "100%", md: "50%" }} m={2} pt={2}>
                    <Text align="left">{user?.displayName}</Text>
                  </Box>
                </Stack>
                <Stack direction={{ base: "column", md: "row" }}>
                  <Box w={{ base: "100%", md: "50%" }} m={2}>
                    <Text align="left">Description</Text>
                  </Box>
                  <Box w={{ base: "100%", md: "50%" }} m={2} pt={2}>
                    <Text align="left">{userData?.description}</Text>
                  </Box>
                </Stack>
              </Stack>
            </Flex>
            <Flex justify="space-between">
              {!loadingUser && (uid === user?.uid || uid === undefined) && (
                <>
                  <Button
                    colorScheme="gray"
                    leftIcon={<FontAwesomeIcon icon={faEdit} />}
                    onClick={() => setShowIconModal(true)}
                  >
                    Edit
                  </Button>
                  {edit && (
                    <Button colorScheme="blue" onClick={saveData}>
                      Save
                    </Button>
                  )}
                  <Button
                    colorScheme="gray"
                    variant="solid"
                    onClick={() => setOpenShare(true)}
                    leftIcon={<FontAwesomeIcon icon={faShareAlt} />}
                  >
                    Share
                  </Button>
                </>
              )}
            </Flex>
          </Stack>
          <br />
        </Container>

        <Container maxW="container.lg" my={4}>
          <Heading size="lg" align="left" fontWeight="bold">
            Polls
          </Heading>
          <SimpleGrid p={4} columns={{ base: 0, md: 2, lg: 4 }} spacing={6}>
            {polls &&
              polls.map((poll) => (
                <Poll
                  key={poll.id}
                  name={poll.name}
                  description={poll.description}
                  data={poll}
                  id={poll.id}
                  polls={polls}
                  setPolls={setPolls}
                />
              ))}
          </SimpleGrid>
        </Container>
      </Container>
    </>
  );
}
