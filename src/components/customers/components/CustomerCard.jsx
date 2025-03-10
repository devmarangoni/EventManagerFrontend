import {
    Card, 
    CardBody, 
    Flex, 
    Heading, 
    Image,
    Text,
    Button
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import withoutPhoto from "@images/customerCard/withoutPhoto.png";

export const CustomerCard = ({ customer }) => {
    const infos = [
        {
          label: "Email:",
          value: customer?.email
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

    const handleSeeCustomerEvents = () => {
        console.log(customer);
    }

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
                        src={ customer?.user?.photo || withoutPhoto }
                        alt="customer photo"
                        borderRadius="100%"
                        w="45%"
                        h="45%"
                        objectFit="contain"
                    />
                    <Heading 
                        size="md"
                        textAlign="center"
                    >
                        { customer?.name }
                    </Heading>
                    <Flex
                        w="45%"
                        fontSize={{ base: "small", md: "medium" }}
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
                <Button onClick={handleSeeCustomerEvents}>Ver eventos</Button>
            </CardBody>
        </Card>
    );
}

CustomerCard.propTypes = {
    customer: PropTypes.object
}