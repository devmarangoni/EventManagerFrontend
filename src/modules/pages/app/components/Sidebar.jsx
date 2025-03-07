import { Flex, List, ListIcon, ListItem, Avatar, Text, useToast } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import { IoIosPeople, IoIosLogOut, IoIosHome, IoIosCalendar } from "react-icons/io";
import withoutPhoto from "@images/customerCard/withoutPhoto.png";
import { useLoading } from "@common/hooks/Loading/useLoading";

export function Sidebar(){
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
        <List 
            color="highlight.600" 
            fontSize="1.2rem" 
            spacing={4}
        >
            <ListItem>
                <NavLink to="/profile">
                    <Flex
                        cursor="pointer"
                        justify="center" 
                        align="center" 
                        bg="purple.200"
                        p="12px"
                        gap="12px"
                        borderRadius="12px"
                        _hover={{
                            bg: "purple.300"
                        }}
                    >
                        <Avatar name={auth?.user?.username} src={withoutPhoto} />
                        <Flex
                            flexDir="column"
                        >
                            <Text fontSize="1.2rem" fontWeight="bold">{auth?.user?.username || "Username"}</Text>
                            <Text fontSize="0.8rem">{auth?.user?.email || "Email"}</Text>
                        </Flex>
                    </Flex>
                </NavLink>
            </ListItem>
            <ListItem
                cursor="pointer"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="purple.200" 
                borderRadius="12px"
                _hover={{
                    bg: "purple.300"
                }}
            >
                <NavLink to="/">
                    <Flex
                        justify="start" 
                        align="center" 
                        p="12px"
                    >
                        <ListIcon fontSize="25px" as={IoIosHome}/>
                        <Text>Inicio</Text>
                    </Flex>
                </NavLink>
            </ListItem>
            <ListItem
                cursor="pointer"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="purple.200" 
                borderRadius="12px"
                _hover={{
                    bg: "purple.300"
                }}
            >
                <NavLink to="/calendar">
                    <Flex
                        justify="start" 
                        align="center" 
                        p="12px"
                    >
                        <ListIcon fontSize="25px" as={IoIosCalendar}/>
                        <Text>Calendário</Text>
                    </Flex>
                </NavLink>
            </ListItem>
            {auth?.user?.admin ?
                (
                    <ListItem
                        cursor="pointer"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bg="purple.200" 
                        borderRadius="12px"
                        _hover={{
                            bg: "purple.300"
                        }}
                    >
                        <NavLink to="/customers">
                            <Flex
                                justify="start" 
                                align="center" 
                                p="12px"
                            >
                                <ListIcon fontSize="25px" as={IoIosPeople}/>
                                <Text>Clientes</Text>
                            </Flex>
                        </NavLink>
                    </ListItem>
                ) : null 
            }
            <ListItem
                cursor="pointer"
                onClick={logoutUser}
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="purple.200" 
                borderRadius="12px"
                _hover={{
                    bg: "purple.300"
                }}
            >
                <Flex
                    justify="start" 
                    align="center" 
                    p="12px"
                >
                    <ListIcon fontSize="25px" as={IoIosLogOut}/>
                    <Text>Sair</Text>
                </Flex>
            </ListItem>
        </List>
    );
}