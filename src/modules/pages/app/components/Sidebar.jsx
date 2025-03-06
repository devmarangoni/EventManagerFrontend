import { Flex, List, ListIcon, ListItem, Avatar, Text, useToast } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { HouseIcon, ScheduleIcon } from "@common/icons/icons.jsx";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import { WarningIcon, ArrowLeftIcon } from "@chakra-ui/icons";
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
            <ListItem>
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
                        <ListIcon as={HouseIcon}/>
                        <Text>Inicio</Text>
                    </Flex>
                </NavLink>
            </ListItem>
            <ListItem>
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
                        <ListIcon as={ScheduleIcon}/>
                        <Text>Eventos</Text>
                    </Flex>
                </NavLink>
            </ListItem>
            {auth?.user?.admin ?
                (
                    <ListItem>
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
                                <ListIcon as={WarningIcon}/>
                                <Text>Clientes</Text>
                            </Flex>
                        </NavLink>
                    </ListItem>
                ) : null 
            }
            <ListItem>
                <Flex
                    onClick={logoutUser}
                    justify="center" 
                    alignSelf="flex-end" 
                    bg="purple.200"
                    p="12px"
                    borderRadius="12px"
                    _hover={{
                        bg: "purple.300"
                    }}
                >
                    <ListIcon as={ArrowLeftIcon}/>
                    <Text>Sair</Text>
                </Flex>
            </ListItem>
        </List>
    );
}