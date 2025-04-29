
import { FormResponse, User } from "@/types/form";

const API_BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export async function createUser(user: User): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create user");
    }
    
    return { success: true, message: data.message || "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}

export async function getForm(rollNumber: string): Promise<FormResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/get-form?rollNumber=${rollNumber}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch form");
    }
    
    const data: FormResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching form:", error);
    return null;
  }
}
