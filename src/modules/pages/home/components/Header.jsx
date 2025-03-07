import { Flex, Image, Text } from "@chakra-ui/react";
import companyLogo from "@assets/images/companyLogo.png";

export const Header = () => {

    return(
        <>
            <Flex
                w="100%"
                h="10%"
                bg="white"
                justifyContent="space-between"
                alignItems="center"
                padding="12px"
                position="fixed"
                zIndex="999"
            >
                <Flex
                    justifyContent="flex-start"
                    alignItems="center"
                    cursor="pointer"
                >
                    <Image
                        boxSize={{ base: "18%", sm:"12%", md: "14%" }}
                        objectFit="cover"
                        src={companyLogo}
                        alt="Maira Gasparini company logo"
                    />
                    <Flex
                        flexDir="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        fontFamily="cursive"
                    >
                        <Text
                            fontSize={{ base: "0.8rem", sm: "1.1rem" }} 
                            fontWeight="bold"
                            color="primary.600"
                        >
                            Maira Gasparini
                        </Text>
                        <Text
                            fontSize={{ base: "0.5rem", sm: "0.8rem" }} 
                            fontWeight="bold"
                            color="highlight.400"
                        >
                            Decoração de festas
                        </Text>
                    </Flex>
                </Flex>  
                {/* <Flex
                    justifyContent="center"
                    alignItems="center"
                    gap="5%"
                >
                    <Button 
                        bg="secundary.300"
                        color="gray.800"
                        fontWeight="bold"
                        _hover={{
                            bg:"secundary.400"
                        }}
                        onClick={() => redirectToLogin("")}
                    >
                        ADMIN
                    </Button>
                    <Button 
                        bg="primary.300" 
                        color="gray.800"
                        fontWeight="bold"
                        _hover={{
                            bg:"primary.400"
                        }}
                        onClick={() => redirectToLogin("/cliente")}
                    >
                        CLIENTE
                    </Button>
                </Flex>               */}
            </Flex>
        </>
    );
}