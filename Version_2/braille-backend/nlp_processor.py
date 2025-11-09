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

    # Simple contraction expansion mapping (extend as needed)
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
        "weren't": "were not",
        "that's": "that is",
        "there's": "there is",
        "what's": "what is",
        "who's": "who is",
    }

    for token in doc:
        word = token.text.lower()
        if word in contractions:
            expanded = contractions[word]
            cleaned_tokens.extend(expanded.split())
        else:
            # Lemmatize to get base form (helps Grade 2 contraction handling)
            cleaned_tokens.append(token.lemma_)

    cleaned_text = " ".join(cleaned_tokens)
    return cleaned_text.strip()


def postprocess_braille_to_text(text: str) -> str:
    """
    Cleans up and restores text after Braille-to-Text translation.
    Handles grammar corrections, reintroduces contractions, and improves fluency.
    """
    doc = nlp(text.lower())
    tokens = [token.text for token in doc]
    recon_text = " ".join(tokens)

    # Restore common contractions / phrasing fixes
    replacements = {
        "i be": "i am",
        "he be": "he is",
        "she be": "she is",
        "they be": "they are",
        "we be": "we are",
        "you be": "you are",
        "toward s": "towards",
        "the y": "they",
        "it be": "it is",
        "do not not": "do not",
    }

    for old, new in replacements.items():
        recon_text = recon_text.replace(old, new)

    # Minor punctuation/spacing cleanup
    recon_text = recon_text.replace(" ,", ",").replace(" .", ".").replace("  ", " ")

    # Capitalize first letter, ensure sentence ends correctly
    recon_text = recon_text.strip().capitalize()
    if not recon_text.endswith(('.', '!', '?')):
        recon_text += '.'

    return recon_text
