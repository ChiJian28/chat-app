import { create } from "zustand";

// will return an object with the following properties
export const useLoggingStore = create((set) => ({
    loggingOut: false,
    setLoggingOut: (value) => set({ loggingOut: value }),
}))


