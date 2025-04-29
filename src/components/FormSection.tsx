
import React from "react";
import FormFieldComponent from "./FormField";
import { Button } from "@/components/ui/button";
import { FormSection, FormValues, FormErrors } from "@/types/form";

interface FormSectionComponentProps {
  section: FormSection;
  values: FormValues;
  errors: FormErrors;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onSubmit: () => void;
}

const FormSectionComponent: React.FC<FormSectionComponentProps> = ({
  section,
  values,
  errors,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onSubmit,
}) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{section.title}</h2>
        <p className="text-gray-600 mt-1">{section.description}</p>
      </div>

      <div className="space-y-4">
        {section.fields.map((field) => (
          <FormFieldComponent
            key={field.fieldId}
            field={field}
            value={values[field.fieldId] ?? (field.type === "checkbox" ? false : "")}
            onChange={onChange}
            error={errors[field.fieldId]}
          />
        ))}
      </div>

      <div className="flex justify-between mt-8">
        {!isFirst && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrev}
            data-testid="prev-button"
          >
            Previous
          </Button>
        )}
        <div className="ml-auto">
          {!isLast ? (
            <Button 
              type="button" 
              onClick={onNext}
              data-testid="next-button"
            >
              Next
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={onSubmit}
              data-testid="submit-button"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormSectionComponent;
