import {
    Card, 
    CardBody, 
    Flex, 
    Heading, 
    Image,
    Text
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import withoutPhoto from "@images/customerCard/withoutPhoto.png";

export const UserInfosCard = ({ customer, user }) => {
    const infos = [
        {
          label: "Usuário:",
          value: user?.username
        },
        {
            label: "Tipo:",
            value: user?.admin ? "administrador" : "cliente"
        },
        {
          label: "Email:",
          value: user?.email
        },
        {
          label: "Celular:",
          value: customer?.mobile
        },
        {
          label: "Telefone:",
          value: customer?.phone
        }
    ];

    return(
        <Card 
            w="100%"
            h="100%"
            shadow="lg"
        >
            <CardBody
                display="flex"
                flexDir="column"
                justifyContent="space-between"
                gap="10px"
            >
                <Flex
                    flexDir="column"
                    justify="center"
                    align="center"
                    gap="0.5rem"
                >
                    <Image
                        src={ user?.photo || withoutPhoto }
                        alt="customer photo"
                        borderRadius="100%"
                        w="45%"
                        h="45%"
                        objectFit="contain"
                    />
                    <Heading 
                        size="lg"
                        textAlign="center"
                    >
                        { customer?.name }
                    </Heading>
                    <Flex
                        w="45%"
                        fontSize="large"
                        flexDir="column"
                        align="start"
                        gap="5px"
                    >
                        {infos ? 
                            infos.map(info => {
                                const { label, value } = info;

                                if(!value) return;

                                return(
                                    <Flex 
                                        key={`${label}-${value}`}
                                        gap="5px"
                                    >
                                        <Text fontWeight="bold">{ label }</Text>
                                        <Text>{ value }</Text>
                                    </Flex>
                                );
                            }) : null
                        }
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    );
}

UserInfosCard.propTypes = {
    customer: PropTypes.object,
    user: PropTypes.object
}