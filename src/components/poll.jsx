import React from 'react';
import { useAuth } from '../lib/auth';
import { Box } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Text } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Stack, Flex, Center, } from "@chakra-ui/react"
import { db, deleteDoc } from '../lib/db';
import { useToast } from "@chakra-ui/react";

import Pollpopup from './pollPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons'
import {
    Container,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
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
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';


export default function Poll(props) {
    const { user, loadingUser } = useAuth();
    const shareURL = `pollitup.vercel.app/poll/${props.data.id}`
    const [showModal, setShowModal] = React.useState(false);
    const [votes, setVotes] = React.useState(Math.floor(Math.random() * 5)); //replce with prop
    const [hasVoted, setVoted] = React.useState('');
    const [copyIcon, setCopyIcon] = React.useState(faCopy);
    const [OpenShare, setOpenShare] = React.useState(false);
    const [likesArr, setLikesArr] = useState([])

    const toast = useToast();

    useEffect(() => {
        const checkLikes = () => {
            if (props.data.likesArr) {
                setLikesArr(props.data.likesArr)
            } else {
                setLikesArr([])
            }
        }

        checkLikes();
    }, [])


    function upVote() {
        if (hasVoted === 'down') {
            setVotes(votes + 2);
            setVoted('up');
        }
        else if (hasVoted === '') {
            setVotes(votes + 1);
            setVoted('up');
        }
        else {
            setVotes(votes - 1);
            setVoted('')
        }
    }

    function downVote() {
        if (hasVoted === 'up') {
            setVotes(votes - 2);
            setVoted('down');
        }
        else if (hasVoted === '') {
            setVotes(votes - 1);
            setVoted('down');
        }
        else {
            setVotes(votes + 1);
            setVoted('')
        }
    }

    async function deleteHandler(docId) {
        await deleteDoc("polls", docId);
        console.log(props.polls);
        props.setPolls(props.polls.filter(poll => poll.id !== docId))
        toast({
            title: "Deleted",
            description: "Success your Poll was deleted",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    async function shareHandler(docId) {
        const loc = window.location;
        console.log(loc.port);
        setCopyIcon(faCheck);
        toast({
            title: "Copy",
            description: "Copied to Clipboard",
            status: "success",
            duration: 1000,
            isClosable: true,
        });
        setTimeout(() => {
            setCopyIcon(faCopy);
        }, 1000);
        await navigator.clipboard.writeText(loc.host + "/poll" + "/" + docId);
    }

    const likesHandler = async () => {
        if (!likesArr.includes(user.email)) {
            setLikesArr([...likesArr, user.email]);
            // const documentRef = doc(db, "polls", props.data.id);
            const documentRef = db.collection("polls").doc(props.data.id);
            const response = await documentRef.update({
                likesArr: [...likesArr, user.email]
            });
        }
    }


    return (
        <>
            <Box px={8} py={{ base: 12, lg: 8 }} borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Stack direction="column" spacing={4}>
                    <Flex>
                        {props.pollvoting &&
                            <Stack direction="column" pr={6}>
                                <ChevronUpIcon onClick={upVote} color={hasVoted === "up" && "green"} />
                                <Text ml=".2vw">{votes}{/*props.upvotes*/}</Text>
                                <ChevronDownIcon onClick={downVote} color={hasVoted === "down" && "red"} />
                            </Stack>
                        }
                        <Center flex={1} justifyContent={"space-between"}>
                            <div>
                                <Box align="left">
                                    <Heading as="h6" size="md">{props.name}</Heading>
                                    <Text>{props.description}</Text>
                                </Box>
                            </div>
                            <Flex flexDirection="column">
                                <Button cursor={"pointer"} colorScheme="whatsapp" rounded={"full"} onClick={likesHandler} title='Like' m={1}>
                                    {likesArr.includes(user.email) ? <AiFillLike /> : <AiOutlineLike />}

                                    {likesArr.length}
                                </Button>
                                <Button cursor={"pointer"} colorScheme="whatsapp" rounded={"full"} onClick={() => setOpenShare(true) || console.log("props::", props.data.id)} title='Copy Link' m={1}>
                                    <FontAwesomeIcon icon={copyIcon} />
                                </Button>
                            </Flex>
                        </Center>
                    </Flex>
                    {(props.flag === "discover") ? <Button colorScheme="green" onClick={() => setShowModal(true)} isFullWidth={true}>Open Poll</Button> :
                        <><Button colorScheme="green" onClick={() => setShowModal(true)} isFullWidth={true}>Open Poll</Button>
                            {user?.uid === props.polls[0].author.id && <Button colorScheme="red" onClick={() => deleteHandler(props.id)} isFullWidth={true}>Delete Poll</Button>
                            }
                        </>}
                </Stack>

                {showModal && <Pollpopup set={setShowModal} data={props.data} />}
            </Box>
            <Modal isOpen={OpenShare} onClose={() => setOpenShare(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Share To</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack spacing={"16px"}>
                            <FacebookShareButton
                                url={`${shareURL}`}
                                quote={'Visit PollItUp'}
                                hashtag="#pollItUp #Polls #checkitout"
                            >
                                <FacebookIcon size={45} round={true} />
                            </FacebookShareButton>
                            <WhatsappShareButton
                                title="pollItUp"
                                url={`${shareURL}`}
                            >
                                <WhatsappIcon size={45} round={true} />
                            </WhatsappShareButton>
                            <TwitterShareButton
                                url={`${shareURL}`}
                            >
                                <TwitterIcon size={45} round={true} />
                            </TwitterShareButton>

                            <LinkedinShareButton
                                title="poll It Up"
                                url={`${shareURL}`}
                            >
                                <LinkedinIcon size={45} round={true} />
                            </LinkedinShareButton>

                            <TelegramShareButton
                                url={`${shareURL}`}
                            >
                                <TelegramIcon size={45} round={true} />
                            </TelegramShareButton>

                            <PinterestShareButton
                                description={`Checkout my profile in pollItUp`}
                                media={`${shareURL}`}
                            >
                                <PinterestIcon size={45} round={true} />
                            </PinterestShareButton>

                            <RedditShareButton
                                title="poll It Up"
                                hashtag="#pollItUp #Polls #checkitout"
                                url={`${shareURL}`}
                            >
                                <RedditIcon size={45} round={true} />
                            </RedditShareButton>

                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <Container mt={2} mb={5} centerContent >
                            <Button colorScheme="blue" mr={3} onClick={() => shareHandler(props.data.id)}>
                                copy text to clipboard
                            </Button>
                        </Container>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

