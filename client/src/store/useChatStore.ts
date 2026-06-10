import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import axios from "axios"
import { toast } from "sonner"



const API_END_POINT = "https://datasmith-agentic-multimodal-assistant.onrender.com/conversation"
const API_END_POINT_CHAT = "https://datasmith-agentic-multimodal-assistant.onrender.com/chat"

axios.defaults.withCredentials = true

export type Message = {
    message_id: string,

    conversation_id: string,

    role: string,

    content: string,

    created_at: string,
}

export type ConversationShow = {
    conversation_id: string,
    title: string,
    created_at: string,
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
    conversation_id: string,
    role: string

}


export type PlanStep = {

    tool: string,
    reason: string,

}

export type ExecutionPlan = {

    intent: string,
    need_rag: boolean,
    need_human_approval: boolean,
    need_clarification: boolean,
    clarification_question: string | null
    steps: PlanStep[]
}


export type MessageAgent = {

    role: string,
    content: string,
}


export type AgentState = {


    query: string,

    conversation_id: string,

    need_web_search: boolean,

    web_context: string,

    current_step: number,

    conversation_history: Message[],

    conversation_summary: string,

    plan: ExecutionPlan | null

    retrieved_context: string,

    final_answer: string,

    need_human_approval: boolean,

    human_approved: boolean,

    available_knowledge: string[],

}





export type ConversationState = {

    conversation: Conversation | null,
    agentState: AgentState | null,
    messages: Message[],

    current_conversation: string,
    all_conversations: ConversationShow[],

    generate_response: (input: FormData, current_conversation: string) => Promise<void>,
    create_message: (input: QueryState) => Promise<void>,
    get_conversation: (conversation_id: string) => Promise<void>,
    get_all_conversation: () => Promise<void>,
    create_new_conversation: () => Promise<void>,
    update_conversation: (conversation_id: string) => Promise<void>,
    delete_conversation: (conversation_id: string) => Promise<void>,

}



export const ConversationStore = create<ConversationState>()(persist((set) => ({

    conversation: null,
    agentState: null,
    messages: [],
    current_conversation: "",
    all_conversations: [],

    create_message: async (input: QueryState) => {
        try {
            const response = await axios.post(`${API_END_POINT}/create_message`, input, {
                headers: {
                    "Content-Type": "application/json",
                }
            })


            if (response.data.success) {
                toast.success(response.data.message)
                set((state) => ({
                    messages: [...state.messages, response.data.Message]
                }));
            }

        } catch (error: any) {

            // console.log(error);
            toast.error(error.response.data['detail']['message'])
            return;
        }

    }
    ,
    generate_response: async (input: FormData, current_conversation: string) => {
        try {
            const response = await axios.post(`${API_END_POINT_CHAT}/${current_conversation}`, input, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                // console.log(response.data);

                const planTitle = response.data.agent_state?.plan?.title

                set((state) => ({
                    messages: [...state.messages, response.data.response_message],
                    agentState: response.data.agent_state,

                    // update title in sidebar list if plan returned one
                    all_conversations: planTitle
                        ? state.all_conversations.map((conv) =>
                            conv.conversation_id === current_conversation
                                ? { ...conv, title: planTitle }
                                : conv
                        )
                        : state.all_conversations,
                }));

                // also persist to backend if title was generated
                if (planTitle) {
                    await axios.put(`${API_END_POINT}/update/${current_conversation}`,
                        { title: planTitle },
                        { headers: { "Content-Type": "application/json" } }
                    )
                }
            }

        } catch (error: any) {
            // console.log(error);
            toast.error(error.response.data['detail']['message'])
            return;
        }
    },

    get_conversation: async (conversation_id: string) => {
        try {

            const response = await axios.get(`${API_END_POINT}/${conversation_id}`);
            // console.log(response);

            if (response.data.success) {
                toast.success(response.data.message);
                // console.log(response.data.Messages);

                set({
                    conversation: response.data.conversation,
                    messages: response.data.Messages,
                    current_conversation: response.data.conversation["conversation_id"],
                    agentState: null,
                })

            }

            // console.log(response);


        } catch (error: any) {
            // console.log(error.details);
            // toast.error(error.details);
        }

    },

    get_all_conversation: async () => {

        try {

            const response = await axios.get(`${API_END_POINT}/user/all`);

            if (response.data.success) {
                toast.success(response.data.message);
                // console.log(response.data);


                set({
                    all_conversations: response.data.conversations,
                    
                });
            }


        } catch (error: any) {
            // console.log(error);
            toast.error(error.response.data['detail']['message'])

            return;
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
                set((state) => ({
                    conversation: response.data.conversation,
                    current_conversation: response.data.conversation["conversation_id"],
                    agentState: null,
                    messages: [],
                    all_conversations: [
                        {
                            title: response.data.conversation.title,
                            created_at: response.data.conversation.created_at,
                            conversation_id: response.data.conversation.conversation_id,
                        },
                        ...state.all_conversations,
                    ]
                }));
            }

        } catch (error: any) {

            toast.error(error.response.data['detail']["message"]);
            // console.log(error.response.data['detail']["message"]);
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
            // console.log(error.response.data);
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
            // console.log(error.response.data);
        }
    }

}), {
    name: "conversation",
    storage: createJSONStorage(() => localStorage),
}))




























