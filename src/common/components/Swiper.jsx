import { IconButton, Flex, Circle } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { ImageCard } from "@pages/home/components/main/components/ImageCard.jsx";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { useState, useEffect } from "react";

export const Swiper = ({ type, elements, showInDesktop }) => {
    const displayInDesktop = showInDesktop ? "flex" : "none";
    
    const firstIndex = 0;
    const lastIndex = elements.length - 1
    const [actualElement, setActualElement] = useState({
        element: null,
        index: 0
    });
    
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);

    useEffect(() => {
        setActualElement({
            element: elements[0],
            index: 0
        });
    }, [type, elements]);

    const manageSwiper = (isIncrement) => {
        if(elements.length <= 0) return;

        let newElementIndex = actualElement.index;

        if(isIncrement){
            const newIndex = actualElement.index + 1;
            newElementIndex = newIndex > lastIndex ? firstIndex : newIndex;
        }else{
            const newIndex = actualElement.index - 1;
            newElementIndex = newIndex < firstIndex ? lastIndex : newIndex;
        }

        setActualElement({
            element: elements[newElementIndex],
            index: newElementIndex
        });
    };

    const handleTouchStart = (event) => {
        setTouchStartX(event.targetTouches[0].clientX);
    };

    const handleTouchMove = (event) => {
        setTouchEndX(event.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if(touchStartX - touchEndX > 50){
            manageSwiper(true);
        }

        if(touchStartX - touchEndX < -50){
            manageSwiper(false);
        }
    };

    if (elements.length <= 0 || !actualElement?.element) return null;

    return (
        <Flex
            display={{ base: "flex", md: displayInDesktop }}
            minW="100%"
            flexDir="column"
            align="center"
            gap={5}
        >
            <Flex
                w={{ base: "100%" }}
                justify={{ base: "space-between", md: "center" }}
                align="center"
            >
                <IconButton
                    onClick={() => manageSwiper(false)}
                    bg="transparent"
                    color="black"
                    _hover={{
                        bg: "transparent",
                        borderRadius: "1rem"
                    }}
                    icon={<IoIosArrowDropleftCircle fontSize="30px" />}
                />
                <Flex
                    justify="center"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {type === "image" ? (
                        <ImageCard 
                            src={actualElement.element} 
                            index={actualElement.index}
                        />
                    ) : (
                        actualElement.element
                    )}
                </Flex>
                <IconButton
                    onClick={() => manageSwiper(true)}
                    bg="transparent"
                    color="black"
                    _hover={{
                        bg: "transparent"
                    }}
                    icon={<IoIosArrowDroprightCircle fontSize="30px" />}
                />
            </Flex>
            <Flex>
                {elements && elements.map((_, index) => (
                    <Circle 
                        key={index} 
                        size="10px" 
                        bg={index === actualElement.index ? "primary.500" : "gray.300"} 
                        mx={1}
                    />
                ))}
            </Flex>
        </Flex>
    );
};

Swiper.propTypes = {
    type: PropTypes.string.isRequired,
    elements: PropTypes.array.isRequired,
    showInDesktop: PropTypes.bool.isRequired
};