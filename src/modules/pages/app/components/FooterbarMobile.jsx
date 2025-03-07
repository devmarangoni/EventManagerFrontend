import { Box, Flex, HStack, useToast } from "@chakra-ui/react";
import { IoIosPeople, IoIosLogOut, IoIosHome, IoIosCalendar } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useLoading } from "@common/hooks/Loading/useLoading";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";

export function FooterbarMobile(){
    const toast = useToast();
    const { showLoading, hideLoading } = useLoading();
    const { auth, logout } = useAuth();
    
    const logoutUser = () => {
        try{
            showLoading();
            logout();
            toast({
                status: "success",
                title: "Logout",
                description: "Deslogado com sucesso",
                isClosable: true
            });
        }catch(error){
            console.log(error?.message);
            toast({
                status: "error",
                title: "Logout",
                description: error?.message,
                isClosable: true
            });
        }finally{
            setTimeout(() => {
                hideLoading();
            }, 2500);
        }
    }

    return(
        <HStack
            color="highlight.600" 
            fontSize="1.2rem" 
            spacing={4}
        >
            <Box>
                <NavLink to="/">
                    <Flex 
                        justify="center" 
                        align="center"
                        bg="purple.200"
                        p="12px"
                        borderRadius="12px"
                        _hover={{
                            bg: "purple.300"
                        }}
                    >
                        <IoIosHome fontSize="25px"/>
                    </Flex>
                </NavLink>
            </Box>
            <Box>
                <NavLink to="/calendar">
                    <Flex 
                        justify="center" 
                        align="center"
                        bg="purple.200"
                        p="12px"
                        borderRadius="12px"
                        _hover={{
                            bg: "purple.300"
                        }}
                    >
                        <IoIosCalendar fontSize="25px"/>
                    </Flex>
                </NavLink>
            </Box>
            {auth?.user?.admin ?
                (
                    <Box>
                        <NavLink to="/customers">
                            <Flex 
                                justify="center" 
                                align="center"
                                bg="purple.200"
                                p="12px"
                                borderRadius="12px"
                                _hover={{
                                    bg: "purple.300"
                                }}
                            >
                                <IoIosPeople fontSize="25px"/>
                            </Flex>
                        </NavLink>
                    </Box>
                ) : null 
            }
            <Box onClick={logoutUser}>
                <Flex
                    justifySelf="center" 
                    align="center"
                    bg="purple.200"
                    p="12px"
                    borderRadius="12px"
                    _hover={{
                        bg: "purple.300"
                    }}
                >
                    <IoIosLogOut fontSize="25px"/>
                </Flex>
            </Box>
        </HStack>
    );
}