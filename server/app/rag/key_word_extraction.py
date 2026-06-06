from collections import Counter
import re

def extract_keywords(text: str, top_k: int = 25):

    stop_words = {
        "the", "a", "an", "is", "are", "was",
        "were", "and", "or", "to", "of",
        "in", "on", "for", "with", "that",
        "this", "it", "as", "by", "from"
    }

    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())

    words = [
        word
        for word in words
        if word not in stop_words
    ]

    return [
        word
        for word, _ in Counter(words).most_common(top_k)
    ]