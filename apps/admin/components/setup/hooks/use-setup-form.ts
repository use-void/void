import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSetupSchema, type SetupFormValues } from "../schema/setup.schema";

export function useSetupForm(t: (key: string) => string) {
  return useForm<SetupFormValues>({
    resolver: zodResolver(createSetupSchema(t)),
    mode: "onChange",
    defaultValues: {
      storeName: "",
      storeDescription: "",
      country: "",
      city: "",
      address: "",
      currency: "SAR",    
      timezone: "Asia/Riyadh",    
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",         
      password: "",
      confirmPassword: "",
      shouldSeed: false,  
    },
  });
}