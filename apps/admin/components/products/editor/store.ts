import { create } from "zustand";
import { ProductFormValues } from "./schema";

interface ProductEditorState {
  // Data
  initialValues: ProductFormValues | null;
  formValues: ProductFormValues | null;
  activeLocale: string;
  
  // Actions
  init: (values: ProductFormValues) => void;
  setFieldValue: <T extends keyof ProductFormValues>(field: T, value: ProductFormValues[T]) => void;
  setContentValue: (locale: string, field: 'name' | 'description', value: string) => void;
  setPricingValue: (field: keyof ProductFormValues['pricing'], value: string) => void;
  setInventoryValue: (field: keyof ProductFormValues['inventory'], value: string | number | boolean) => void;
  setShippingValue: (field: keyof ProductFormValues['shipping'], value: string) => void;
  setActiveLocale: (locale: string) => void;
  setStatus: (status: "active" | "draft") => void;
  
  // Getters
  isDirty: () => boolean;
}

export const useProductStore = create<ProductEditorState>((set, get) => ({
  initialValues: null,
  formValues: null,
  activeLocale: 'ar',

  init: (values) => set({ 
    initialValues: JSON.parse(JSON.stringify(values)), 
    formValues: JSON.parse(JSON.stringify(values)) 
  }),

  setActiveLocale: (locale) => set({ activeLocale: locale }),

  setFieldValue: (field, value) => set((state) => ({
    formValues: state.formValues ? { ...state.formValues, [field]: value } : null
  })),

  setContentValue: (locale, field, value) => set((state) => {
    if (!state.formValues) return state;
    const newContent = { ...state.formValues.content };
    const current = newContent[locale] || { name: "", description: "" };
    newContent[locale] = { ...current, [field]: value };
    return {
      formValues: { ...state.formValues, content: newContent }
    };
  }),

  setPricingValue: (field, value) => set((state) => {
    if (!state.formValues) return state;
    return {
      formValues: {
        ...state.formValues,
        pricing: { ...state.formValues.pricing, [field]: value }
      }
    };
  }),

  setInventoryValue: (field, value) => set((state) => {
    if (!state.formValues) return state;
    return {
      formValues: {
        ...state.formValues,
        inventory: { ...state.formValues.inventory, [field]: value }
      }
    };
  }),

  setShippingValue: (field, value) => set((state) => {
    if (!state.formValues) return state;
    return {
      formValues: {
        ...state.formValues,
        shipping: { ...state.formValues.shipping, [field]: value }
      }
    };
  }),

  setStatus: (status) => set((state) => {
    if (!state.formValues) return state;
    return {
      formValues: { ...state.formValues, status }
    };
  }),

  isDirty: () => {
    const { initialValues, formValues } = get();
    if (!initialValues || !formValues) return false;
    return JSON.stringify(initialValues) !== JSON.stringify(formValues);
  },
}));
