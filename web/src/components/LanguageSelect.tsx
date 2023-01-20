import { FormControl } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';
import { useField } from 'formik';
import ISO6391 from "iso-639-1";
import React, { InputHTMLAttributes } from 'react'

type LanguageSelectProps = InputHTMLAttributes<HTMLSelectElement> & {
  name: string;
  placeholder: 'Target Language' | 'Native Language'
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({placeholder, size: _, ...props}) => {

  const [field, {error}] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <Select {...field} {...props} id={field.name} placeholder={placeholder}>
        {ISO6391.getAllNames().map((languageName, i) => (
          <option key={i} value={ISO6391.getCode(languageName)}>{languageName}</option>
        ))}
      </Select>
    </FormControl>

  );
}