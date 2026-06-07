from langchain_core.prompts import ChatPromptTemplate

SUMMARY_UPDATE_PROMPT = """
You are a memory compression agent.

Existing Summary:
{old_summary}

Recent Messages:
{messages}

Instructions:

- Update the existing summary.
- Preserve important user preferences.
- Preserve important project details.
- Preserve important decisions.
- Remove unimportant chit-chat.
- Keep summary under 300 words.

Return only the updated summary.
"""


message_summarization_prompt=ChatPromptTemplate.from_template(SUMMARY_UPDATE_PROMPT)

