# nlp_processor.py

import spacy

# Load spaCy's English model once when the module is imported
nlp = spacy.load("en_core_web_sm")

def preprocess_text_for_braille(text: str) -> str:
    """
    Cleans and simplifies input text before Braille translation.
    Handles tokenization, lemmatization, and expands contractions.
    """
    doc = nlp(text)
    cleaned_tokens = []

    # Simple contraction expansion mapping (you can extend this list anytime)
    contractions = {
        "can't": "cannot",
        "won't": "will not",
        "i'm": "i am",
        "you're": "you are",
        "they're": "they are",
        "it's": "it is",
        "don't": "do not",
        "doesn't": "does not",
        "i've": "i have",
        "we've": "we have",
        "isn't": "is not",
        "aren't": "are not",
        "wasn't": "was not",
        "weren't": "were not"
    }

    for token in doc:
        word = token.text.lower()
        if word in contractions:
            expanded = contractions[word]
            cleaned_tokens.extend(expanded.split())
        else:
            cleaned_tokens.append(token.lemma_)

    return " ".join(cleaned_tokens)


def postprocess_braille_to_text(text: str) -> str:
    """
    Cleans or adjusts text after Braille-to-Text translation.
    Could reintroduce contractions, adjust grammar, etc.
    """
    doc = nlp(text)
    processed_text = " ".join([token.text for token in doc])
    return processed_text.capitalize()
