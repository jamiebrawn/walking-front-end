import { validateTextInputContent, validateTextInputLength } from "../src/utils/formValidations";

describe('validateTextInputContent', () => {
    test('should return true if input contains letters', () => {
        expect(validateTextInputContent('My Test Walk')).toBe(true);
    });
    test('should return true if input contains letters and other characters', () => {
        expect(validateTextInputContent('My Test Walk 3')).toBe(true);
        expect(validateTextInputContent('My Test Walk 3!!')).toBe(true);
    });
    test('should return false if input does not contain any letters', () => {
        expect(validateTextInputContent('124!')).toBe(false);
    });
});

describe('validateTextInputLength', () => {
    test('should return true if string length is shorter than given max length', () => {
        expect(validateTextInputLength('hello', 1, 10)).toBe(true);
    });
    test('should return false if string length is longer than given max length', () => {
        expect(validateTextInputLength('hello, I am a long string', 1, 10)).toBe(false);
    });
    test('should return true if string length is longer than given min length', () => {
        expect(validateTextInputLength('hello', 1, 10)).toBe(true);
    });
    test('should return false if string length is shorter than given min length', () => {
        expect(validateTextInputLength('hi', 3, 10)).toBe(false);
        expect(validateTextInputLength('', 3, 10)).toBe(false);
    });
});