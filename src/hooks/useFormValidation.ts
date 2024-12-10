import { useState, useCallback } from 'react';

type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

type ValidationErrors<T> = {
  [K in keyof T]?: string[];
};

export function useFormValidation<T extends Record<string, any>>(
  initialState: T,
  validationRules: ValidationRules<T>
) {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      const fieldRules = validationRules[name];
      if (!fieldRules) return [];

      return fieldRules
        .map(rule => (!rule.validate(value) ? rule.message : null))
        .filter((message): message is string => message !== null);
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (touched[name]) {
        const fieldErrors = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: fieldErrors }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched(prev => ({ ...prev, [name]: true }));
      const fieldErrors = validateField(name, formData[name]);
      setErrors(prev => ({ ...prev, [name]: fieldErrors }));
    },
    [formData, validateField]
  );

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const fieldName = key as keyof T;
      const fieldErrors = validateField(fieldName, formData[fieldName]);
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules, validateField]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormData
  };
}

// Common validation rules
export const commonValidations = {
  required: (message = 'This field is required'): ValidationRule<any> => ({
    validate: (value: any) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return true;
      return value !== null && value !== undefined;
    },
    message
  }),
  
  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  minLength: (length: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value.length >= length,
    message: message || `Must be at least ${length} characters`
  }),
  
  maxLength: (length: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value.length <= length,
    message: message || `Must be no more than ${length} characters`
  }),
  
  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (value: string) => regex.test(value),
    message
  }),
  
  numeric: (message = 'Must be a number'): ValidationRule<string> => ({
    validate: (value: string) => !isNaN(Number(value)),
    message
  }),
  
  passwordStrength: (message = 'Password must contain at least 8 characters, including uppercase, lowercase, number'): ValidationRule<string> => ({
    validate: (value: string) => 
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    message
  })
};
