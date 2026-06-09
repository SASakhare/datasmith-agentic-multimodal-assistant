import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import axios from "axios"
import { toast } from "sonner"



const API_END_POINT = "http://127.0.0.1:8000/conversation"

axios.defaults.withCredentials=true

export type Message = {
    message_id: string,

    conversation_id: string,

    role: string,

    content: string,

    timestamp: string,
}

export type ConversationShow = {
    conversation_id: string,
    title: string,
    timeStamp: string,
}
export type Conversation = {
    conversation_id: string,
    user_id: string,
    message_count: number,
    title: string,
    rag_content: [],
    created_at: string,
    updated_at: string,
}

export type QueryState = {
    query: string,
}

export type ConversationState = {

    conversation: Conversation | null,

    messages: Message[],

    current_conversation: string,
    all_conversations: ConversationShow[],

    send_query: (input: QueryState) => Promise<void>,
    get_conversation: (conversation_id: string) => Promise<void>,
    get_all_conversation: () => Promise<void>,
    create_new_conversation: () => Promise<void>,
    update_conversation: (conversation_id: string) => Promise<void>,
    delete_conversation: (conversation_id: string) => Promise<void>,

}



export const ConversationStore = create<ConversationState>()(persist((set) => ({

    conversation: null,
    messages: [],
    current_conversation: "",
    all_conversations: [],

    send_query: async (input: QueryState) => {
        console.log(input);

    },

    get_conversation: async (conversation_id: string) => {
        try {

            const response = await axios.get(`${API_END_POINT}/${conversation_id}`);

            if (response.data.success) {
                toast.success(response.data.message);
                console.log(response.data.message);

                set({
                    conversation: response.data.conversation,
                    messages: response.data.messages,
                    current_conversation: response.data.conversation["conversation_id"],
                })

            }

            // console.log(response);


        } catch (error: any) {
            console.log(error.details);
            // toast.error(error.details);
        }

    },

    get_all_conversation: async () => {

        try {

            const response = await axios.get(`${API_END_POINT}/user/all`);

            if (response.data.success) {
                toast.success(response.data.message);

                set({
                    all_conversations: response.data.conversations,

                });
            }


        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message)
        }


    },

    create_new_conversation: async () => {

        try {
            const response = await axios.post(`${API_END_POINT}/create`, { title: "new chat" }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (response.data.success) {
                toast.success(response.data.message);
                set({
                    conversation: response.data.conversation,
                });
            }

        } catch (error: any) {

            toast.error(error.response.data['detail']["message"]);
            console.log(error.response.data['detail']["message"]);
        }

    },


    update_conversation: async (conversation_id: string) => {
        // console.log(conversation_id);
        try {
            const response = await axios.put(`${API_END_POINT}/update/${conversation_id}`, { title: "new chat" }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (response.data.success) {
                toast.success(response.data.message);
                set({
                    conversation: response.data.conversation,
                });
            }

        } catch (error: any) {

            toast.error(error.response.data.message);
            console.log(error.response.data);
        }
    },


    delete_conversation: async (conversation_id: string) => {

        try {
            const response = await axios.delete(`${API_END_POINT}/delete/${conversation_id}`)

            if (response.data.success) {
                toast.success(response.data.message);
                set({
                    conversation: response.data.conversation,
                });
            }

        } catch (error: any) {

            toast.error(error.response.data.message);
            console.log(error.response.data);
        }
    }

}), {
    name: "conversation",
    storage: createJSONStorage(() => localStorage),
}))




























