
import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import DynamicForm from "@/components/DynamicForm";
import { User } from "@/types/form";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Dynamic Form Builder</h1>
      
      {!user ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DynamicForm user={user} />
      )}
    </div>
  );
};

export default Index;
