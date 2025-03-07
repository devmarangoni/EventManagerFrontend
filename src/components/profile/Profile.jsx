import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import { Heading, Flex } from "@chakra-ui/react";
import { UserInfosCard } from "@components/profile/components/UserInfosCard.jsx";

export const Profile = () => {
  const { auth } = useAuth();
  const { user, customer } = auth;

  return (
    <Flex
        w={{ base: "95vw", md: "70vw", lg: "50vw" }}
        flexDir="column"
        justify="start"
        align="start"
        gap="1rem"
    >
        <Heading size="lg">Perfil</Heading>
        <UserInfosCard
            user={user}
            customer={customer}
        />
    </Flex>
  );
};