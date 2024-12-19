import React from 'react';

interface FormFieldProps {
  formType: string; 
  state: string;
  name: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const FormField: React.FC<FormFieldProps> = ({ formType, name, state, onChangeHandler }) => {
  return (
    <div className='{formType}-input flex flex-col justify-center w-[100%] mb-[10px]'>
      <label htmlFor={formType} className='font-[Helvetica Neue] font-sans text-xl'>
        {name.charAt(0).toUpperCase() + name.slice(1)}:
      </label>
      <input
        type={formType}
        id={formType}
        value={state}
        onChange={onChangeHandler}
        required
        className='w-[100%] p-[8px] mt-[4px] border-4 rounded-md border-slate-600 bg-slate-200'
      />
    </div>
  );
};

export default FormField;