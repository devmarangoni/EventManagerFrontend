import { Grid, GridItem, Box } from "@chakra-ui/react";
import { Sidebar } from "@pages/app/components/Sidebar.jsx";
import { FooterbarMobile } from "@pages/app/components/FooterbarMobile.jsx";
import PropTypes from "prop-types";

export const App = ({ funcionalityComponent }) => {
    return (
        <Grid templateColumns={{ base: "1fr", lg: "repeat(6, 1fr)" }} bg="gray.50" w="full" minH="100vh">
            <GridItem
                as="aside"
                colSpan={{ lg: 1 }}
                bg="purple.100"
                p={{ base: "20px", lg: "30px" }}
                display={{ base: "none", lg: "block" }}
            >
                <Sidebar/>
            </GridItem>
            <GridItem
                as="main"
                colSpan={{ base: 6, lg: 5 }}
                p={{ base: "12px", md: "20px" }}
            >
                {funcionalityComponent ? 
                    (
                        funcionalityComponent
                    ) : (
                        <>Aqui vem o component da home principal (não sei o que terá no momento)</>
                    )
                }
            </GridItem>
            <Box
                as="footer"
                position="fixed"
                bottom="0"
                width="100%"
                bg="purple.100"
                p="12px"
                display={{ base: "block", lg: "none" }}
            >
                <FooterbarMobile/>
            </Box>
        </Grid>
    );
}

App.propTypes = {
 funcionalityComponent: PropTypes.node
}