export const validateTextInputContent = (input) => {
    return /[a-zA-Z]/.test(input)
}

export const validateTextInputLength = (input, minLength, maxLength) => {
    return input.length >= minLength && input.length <= maxLength
}