
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/types/form";

interface FormFieldComponentProps {
  field: FormField;
  value: string | string[] | boolean;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  error?: string;
}

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field.fieldId, e.target.value);
  };

  const handleSelectChange = (value: string) => {
    onChange(field.fieldId, value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(field.fieldId, checked);
  };

  const handleRadioChange = (value: string) => {
    onChange(field.fieldId, value);
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "date":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder || ""}
            value={value as string}
            onChange={handleChange}
            required={field.required}
            data-testid={field.dataTestId}
            className={error ? "border-destructive" : ""}
            maxLength={field.maxLength}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || ""}
            value={value as string}
            onChange={handleChange}
            required={field.required}
            data-testid={field.dataTestId}
            className={error ? "border-destructive" : ""}
            maxLength={field.maxLength}
          />
        );
      case "dropdown":
        return (
          <Select
            value={value as string}
            onValueChange={handleSelectChange}
            required={field.required}
          >
            <SelectTrigger 
              className={error ? "border-destructive" : ""}
              data-testid={field.dataTestId}
            >
              <SelectValue 
                placeholder={field.placeholder || "Select an option"} 
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={handleRadioChange}
            className="flex flex-col space-y-2"
            data-testid={field.dataTestId}
          >
            {field.options?.map((option) => (
              <div className="flex items-center space-x-2" key={option.value}>
                <RadioGroupItem 
                  value={option.value}
                  id={`${field.fieldId}-${option.value}`}
                  data-testid={option.dataTestId}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.fieldId}
              checked={value as boolean}
              onCheckedChange={handleCheckboxChange}
              data-testid={field.dataTestId}
            />
            <Label htmlFor={field.fieldId}>{field.label}</Label>
          </div>
        );
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.fieldId} className="flex">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormFieldComponent;
