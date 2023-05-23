import React from "react";
import { Link as RLink } from "react-router-dom";
import ColorModeToggle from "./colorModeToggle";
import { Slide } from "@chakra-ui/react";

import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  transition,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "../lib/auth";
import { useState } from "react";
import { useEffect } from "react";

export default function NavbarComponent() {
  const [isOpen, setIsOpen] = React.useState(false);

  const { user, loadingUser } = useAuth();
  const toggle = () => setIsOpen(!isOpen);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <Flex
      as="nav"
      {...(sticky && {
        sx: {
          pos: "sticky",
          top: "0",
          transition: "all .3s ease-in-out",
          h: "90px",
          zIndex: "overlay",
          bg: "white",
          boxShadow: "lg",
        },
      })}
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      py={4}
      px={8}
      bg={["brand.500", "brand.500", "transparent", "transparent"]}
      color={["white", "white", "brand.500", "brand.500"]}
    >
      {/* Logo */}
      <Logo />

      {/* Toggle */}
      <Toggle toggle={toggle} isOpen={isOpen} />

      {/* Links */}
      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={8}
          align="center"
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "row", "row", "row"]}
          pt={[4, 4, 0, 0]}
        >
          <MenuItem to="/">
            {user && !loadingUser ? "Dashboard" : "Home"}
          </MenuItem>
          <MenuItem to="/discover">Discover</MenuItem>
          {user && !loadingUser && <MenuItem to="/create">Create</MenuItem>}
          {user && !loadingUser && <MenuItem to="/profile">Profile</MenuItem>}
          <MenuItem
            to={user && !loadingUser ? "/logout" : "/login"}
            type="button"
          >
            {user && !loadingUser ? "Logout" : "Login/Register"}
          </MenuItem>
          <ColorModeToggle color={useColorModeValue("brand.700", "white")} />
        </Stack>
      </Box>
    </Flex>
  );
}

function Logo() {
  return (
    <Box>
      <RLink to="/">
        <Heading as="h1" size="xl">
          Poll It Up
        </Heading>
      </RLink>
    </Box>
  );
}

function Toggle(props) {
  const { toggle, isOpen } = props;
  return (
    <Box display={{ base: "block", md: "none" }} p={2} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <HamburgerIcon w={5} h={5} />}
    </Box>
  );
}

function MenuItem(props) {
  const { to, children, type, ...rest } = props;

  const bgDesktop = useColorModeValue("brand.50", "brand.900");
  const bgHoverDesktop = useColorModeValue("brand.100", "brand.800");

  // Button menu item
  if (type === "button") {
    return (
      <RLink to={to}>
        <Button
          size="sm"
          bg={["brand.400", "brand.400", bgDesktop, bgDesktop]}
          _hover={{
            bg: ["brand.300", "brand.300", bgHoverDesktop, bgHoverDesktop],
          }}
        >
          {children}
        </Button>
      </RLink>
    );
  }

  return (
    <RLink to={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </RLink>
  );
}
