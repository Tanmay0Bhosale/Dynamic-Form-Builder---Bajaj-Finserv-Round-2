
import React, { useState, useEffect } from "react";
import { getForm } from "@/services/api";
import { Form, FormSection, FormValues, FormErrors, User } from "@/types/form";
import FormSectionComponent from "./FormSection";
import { toast } from "sonner";

interface DynamicFormProps {
  user: User;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ user }) => {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formData = await getForm(user.rollNumber);
        if (formData && formData.form) {
          setForm(formData.form);
        } else {
          toast.error("Failed to load form data");
        }
      } catch (error) {
        console.error("Error loading form:", error);
        toast.error("An error occurred while loading the form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [user.rollNumber]);

  const currentSection = form?.sections[currentSectionIndex];

  const handleChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user changes value
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (section: FormSection): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];
      
      // Check required fields
      if (field.required && 
        (value === undefined || value === "" || 
        (Array.isArray(value) && value.length === 0))) {
        newErrors[field.fieldId] = field.validation?.message || "This field is required";
        isValid = false;
      }
      
      // Check min length for text fields
      if (field.minLength !== undefined && 
          typeof value === "string" && 
          value.length < field.minLength) {
        newErrors[field.fieldId] = `Minimum ${field.minLength} characters required`;
        isValid = false;
      }
      
      // Check max length for text fields
      if (field.maxLength !== undefined && 
          typeof value === "string" && 
          value.length > field.maxLength) {
        newErrors[field.fieldId] = `Maximum ${field.maxLength} characters allowed`;
        isValid = false;
      }
      
      // Validate email format
      if (field.type === "email" && 
          typeof value === "string" && 
          value.trim() !== "" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.fieldId] = "Please enter a valid email address";
        isValid = false;
      }
      
      // Validate phone format
      if (field.type === "tel" && 
          typeof value === "string" && 
          value.trim() !== "" &&
          !/^\d{10}$/.test(value.replace(/\D/g, ""))) {
        newErrors[field.fieldId] = "Please enter a valid 10-digit phone number";
        isValid = false;
      }
    });
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!currentSection) return;
    
    const isValid = validateSection(currentSection);
    
    if (isValid && form) {
      setCurrentSectionIndex((prev) => Math.min(prev + 1, form.sections.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!form || !currentSection) return;
    
    const isValid = validateSection(currentSection);
    
    if (isValid) {
      // Check if all sections are valid
      let allSectionsValid = true;
      
      for (let i = 0; i < form.sections.length; i++) {
        if (i !== currentSectionIndex) {
          const sectionValid = validateSection(form.sections[i]);
          if (!sectionValid) {
            allSectionsValid = false;
            setCurrentSectionIndex(i);
            toast.error(`Please complete the "${form.sections[i].title}" section`);
            break;
          }
        }
      }
      
      if (allSectionsValid) {
        console.log("Form submitted with values:", formValues);
        toast.success("Form submitted successfully!");
      }
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="flex justify-center py-12">
          <div className="text-center">
            <p className="text-lg">Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="form-container">
        <div className="flex justify-center py-12">
          <div className="text-center">
            <p className="text-lg text-destructive">Failed to load form. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1 className="text-3xl font-bold mb-6">{form.formTitle}</h1>
      
      <div className="step-indicator">
        {form.sections.map((section, index) => (
          <div
            key={section.sectionId}
            className={`step-indicator-item ${
              index === currentSectionIndex ? "active" : ""
            } ${index < form.sections.length - 1 ? "flex-1" : ""}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{section.title}</div>
            {index < form.sections.length - 1 && (
              <div className="h-0.5 w-full bg-gray-200 mx-2 mt-4"></div>
            )}
          </div>
        ))}
      </div>
      
      {currentSection && (
        <FormSectionComponent
          section={currentSection}
          values={formValues}
          errors={formErrors}
          onChange={handleChange}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={currentSectionIndex === 0}
          isLast={currentSectionIndex === form.sections.length - 1}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default DynamicForm;
