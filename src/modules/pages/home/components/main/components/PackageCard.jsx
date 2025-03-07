import { 
    Card, 
    CardBody,
    Divider,
    Image,
    Stack,
    Heading,
    Text,
    List,
    ListItem,
    ListIcon
} from "@chakra-ui/react";
import { IoIosCheckbox } from "react-icons/io";
import PropTypes from "prop-types";

export const PackageCard = ({ image, title, description, items }) => {

    return(
        <Card 
            bg="white"
            w={{ base: "100%", sm: "22em", md: "25em" }}
            h={{ base: "32em", md: "33em" }}
            boxShadow="2xl"
        >
            <CardBody display="flex" flexDir="column">
                <Image
                    h={{ base: "180px", sm: "210px" }}
                    w="100%"
                    src={image}
                    alt={`Festa ${title}: ${description}`}
                    borderRadius="lg"
                />
                <Stack mt="2" spacing="2">
                    <Heading 
                        size="md" 
                        color="highlight.600"
                    >
                        { title }
                    </Heading>
                    <Text
                        fontSize={{ base:"14px" }}
                    >
                        { description }
                    </Text>
                    <Divider
                        borderColor="highlight.600"
                    />
                    <List
                        spacing={0.5}
                    >
                        {items && items.length > 0 ? (
                            items.map((item, index) => (
                                <ListItem 
                                    key={index}
                                    fontSize={{ base: "12px", sm: "14px", md: "md" }}
                                >
                                    <ListIcon 
                                        fontSize="20px"
                                        as={IoIosCheckbox} 
                                        color='green.500'
                                    />
                                    {item}
                                </ListItem>
                            ))
                        ) : null}
                    </List>
                </Stack>
                
            </CardBody>
        </Card>
    )
}

PackageCard.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string)
};