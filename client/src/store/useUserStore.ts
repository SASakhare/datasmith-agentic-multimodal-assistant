import { toast } from "sonner"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import axios from "axios"
import { ConversationStore } from "./useChatStore"

const API_END_POINT = "http://127.0.0.1:8000/auth"
axios.defaults.withCredentials = true


export type User = {

    user_id: string,

    name: string,

    email: string,
}

export type SingupInputState = {
    name: string,
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
    isRegistered: boolean,
    isCheckingAuth: boolean
    resetDone: () => void,
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
    isRegistered: false,


    resetDone: () => {
        set({
            done: false,
        });
    },
    singup: async (input: SingupInputState) => {
        // console.log(input);
        try {
            set({ loading: true, isCheckingAuth: true });

            const response = await axios.post(`${API_END_POINT}/register`, input, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // console.log(response);


            if (response.data.success) {
                toast.success("Account created successfully");
                set({
                    loading: false,
                    isCheckingAuth: false,
                    isRegistered: true,
                });

            }

        } catch (error: any) {
            toast.error(error.response.data.message);
            // console.log(error.response);
            set({
                loading: false,
                done: false,
                isCheckingAuth: false,
                isRegistered: false,
            })

        }

    },
    login: async (input: LoginInputState) => {

        try {
            set({ loading: true, isCheckingAuth: true });

            const response = await axios.post(`${API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (response.data.success) {
                toast.success(response.data.message);
                // console.log(response.data);
                localStorage.setItem("access_token", response.data.token)
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
                set({
                    user: response.data.user,
                    loading: false,
                    done: true,
                    isCheckingAuth: false,
                    isAuthenticated: true,
                });

            }

        } catch (error: any) {
            toast.error(error.response.data.message);
            // console.log(error.response);
            set({
                loading: false,
                done: false,
                isCheckingAuth: false,
                isAuthenticated: false,
            })

        }
    },
    logout: async () => {
        try {
            set({ loading: true, isCheckingAuth: true });

            const response = await axios.get(`${API_END_POINT}/logout`)

            if (response.data.success) {
                // ← remove token completely
                localStorage.removeItem("access_token")
                delete axios.defaults.headers.common["Authorization"]

                ConversationStore.setState({
                    conversation: null,
                    messages: [],
                    current_conversation: "",
                    all_conversations: [],
                })

                set({
                    user: null,
                    loading: false,
                    done: false,
                    isCheckingAuth: false,
                    isAuthenticated: false,
                });
            }

            window.location.href = "/"

        } catch (error: any) {
            toast.error(error.response.data.message);
            // console.log(error);
            
            set({
                loading: false,
                isCheckingAuth: false,
            })
        }
    }
    ,
    checkAuthentication: async () => {
        // console.log("checking authentication");

    },

}),

    {
        name: "user-name",
        storage: createJSONStorage(() => localStorage),
    }))































