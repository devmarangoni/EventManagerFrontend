import { Box, Flex, HStack, useToast } from "@chakra-ui/react";
import { WarningIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { HouseIcon, ScheduleIcon } from "@common/icons/icons.jsx";
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
                        p="16px"
                        borderRadius="12px"
                        _hover={{
                            bg: "purple.300"
                        }}
                    >
                        <HouseIcon/>
                    </Flex>
                </NavLink>
            </Box>
            <Box>
                <NavLink to="/calendar">
                    <Flex 
                        justify="center" 
                        align="center"
                        bg="purple.200"
                        p="16px"
                        borderRadius="12px"
                        _hover={{
                            bg: "purple.300"
                        }}
                    >
                        <ScheduleIcon/>
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
                                p="16px"
                                borderRadius="12px"
                                _hover={{
                                    bg: "purple.300"
                                }}
                            >
                                <WarningIcon/>
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
                    p="16px"
                    borderRadius="12px"
                    _hover={{
                        bg: "purple.300"
                    }}
                >
                    <ArrowLeftIcon/>
                </Flex>
            </Box>
        </HStack>
    );
}