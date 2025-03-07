import PropTypes from "prop-types";
import { 
    Input,
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    Button,
    FormErrorMessage,
    Icon
} from "@chakra-ui/react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useState } from "react";

export function FormField({ name, onChange, size, placeholder, label, type, isRequired, errorMessage, checkIfIsInvalid, value }) {
    const [showPassword, setShowPassword] = useState(false);
    const [input, setInput] = useState(value || "");

    const validateEmail = type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const validatePhone = type !== "tel" || /^\d{9,11}$/.test(input);
    const inputIsBlank = input === "";

    const isInvalid = checkIfIsInvalid && isRequired && (inputIsBlank || (type === "email" && !validateEmail) || (type === "tel" && !validatePhone));

    const handleInputChange = (e) => {
        onChange(e);
        setInput(e.target.value);
    }

    return (
        <FormControl isRequired={isRequired} isInvalid={isInvalid}>
            <FormLabel>{ label }</FormLabel>
            {
                type === "password" ? (
                    <InputGroup size={size}>
                        <Input
                            name={name}
                            onChange={handleInputChange}
                            pr="4.5rem"
                            type={showPassword ? "text" : "password"}
                            placeholder={placeholder}
                            value={input}
                        />
                        <InputRightElement width="3rem">
                            <Button
                                h="1.75rem"
                                size="sm"
                                bg="transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <Icon fontSize="25px" objectFit="contain">
                                    {showPassword ? <IoIosEye/> : <IoIosEyeOff/>}
                                </Icon>
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                ) : (
                    <Input
                        name={name}
                        onChange={handleInputChange}
                        size={size}
                        placeholder={placeholder}
                        type={type ? type : "text"}
                        value={input}
                    />
                )
            }
            {
                isInvalid ? (
                    <FormErrorMessage display={{ base: "none", md: "block" }}>{ errorMessage }</FormErrorMessage>
                ) : null
            }
        </FormControl>
    );
}

FormField.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    size: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    isRequired: PropTypes.bool,
    errorMessage: PropTypes.string,
    checkIfIsInvalid: PropTypes.bool,
    value: PropTypes.any
}