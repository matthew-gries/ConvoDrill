import React, { InputHTMLAttributes } from 'react'
import { useField } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label: string;
  textArea?: boolean
};

export const InputField: React.FC<InputFieldProps> = ({label, textArea, size: _, ...props}) => {

  const [field, {error}] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {textArea
        ? (<Textarea {...field} {...props} id={field.name} placeholder={props.placeholder} />)
        : (<Input {...field} {...props} id={field.name} placeholder={props.placeholder} />)
      }
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}