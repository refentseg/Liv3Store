import { Input } from "@/components/ui/input";
import React, { ChangeEvent } from "react";

import { FieldValues, UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  pattern?: string;
  error?:Record<string, any>;
  helperText?: string;
  value?:any
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AppTextInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { fieldState, field } = useController<FieldValues>({ ...props, defaultValue: '' });

  return (
    <div>
      <Input
        {...props}
        {...field}
        ref={ref}
        type={props.type || "text"}
        placeholder={props.label}
        pattern={props.pattern}
        className="form-input !border-t-blue-gray-200 focus:!border-t-gray-900"
      />
      {fieldState.error && <p style={{ color: 'red' }}>{fieldState.error.message}</p>}
      {!fieldState.error && <p style={{ color: 'red', margin: 0 }}>&nbsp;</p>}
    </div>
  );
});

export default AppTextInput;
