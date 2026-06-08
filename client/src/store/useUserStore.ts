import { toast } from "sonner"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import axios from "axios"

const API_END_POINT = "http://127.0.0.1:8000/auth"
axios.defaults.withCredentials = true

export type User = {

    user_id: string,

    username: string,

    email: string,
}

export type SingupInputState = {
    username: string,
    email: string,
    password: string,
}

export type LoginInputState = {
    email: string,
    password: string,
}


export type UserState = {

    user: User | null,
    loading: boolean,
    done: boolean,
    isAuthenticated: boolean,
    isCheckingAuth: boolean

    singup: (input: SingupInputState) => Promise<void>,
    login: (input: LoginInputState) => Promise<void>,
    logout: () => Promise<void>,
    checkAuthentication: () => Promise<void>,
}


export const useUserStore = create<UserState>()(persist((set) => ({

    user: null,
    loading: false,
    done: false,
    isAuthenticated: false,
    isCheckingAuth: false,

    singup: async (input: SingupInputState) => {
        // console.log(input);
        try {
            set({ loading: true });

            const response = await axios.post(`${API_END_POINT}/register`, input, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                set({
                    loading: false,
                    done: true,
                });
            }

        } catch (error: any) {
            console.log(error);
            set({
                loading: false,
                done: false,
            })
            toast.error("Error while logging");

        }

    },
    login: async (input: LoginInputState) => {

        try {
            set({ loading: true });

            const response = await axios.post(`${API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (response.data.success) {
                toast.success(response.data.message);
                set({
                    loading: false,
                    done: true,
                });
            }

        } catch (error) {
            console.log(error);
            set({
                loading: false,
                done: false,
            })
            toast.error("Error while logging");

        }
    },
    logout: async () => {
        console.log("logout");

    },
    checkAuthentication: async () => {
        console.log("checking authentication");

    },

}),

    {
        name: "user-name",
        storage: createJSONStorage(() => localStorage),
    }))































