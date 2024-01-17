import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ModalProvider = ({ user, children }) => {
  // const { user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="313px">
          <ModalHeader
            fontSize="25px"
            fontFamily="Work sans"
            textAlign="center"
          >
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <Image
              src={user?.pic}
              alt={user?.name}
              h="20vh"
              w="20vh"
              objectFit="cover"
              borderRadius="100%"
              mb="10px"
            ></Image>
            <Text fontFamily="Work sans" fontSize="20px">
              {user?.email}
            </Text>
          </ModalBody>
          {/* 
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalProvider;
