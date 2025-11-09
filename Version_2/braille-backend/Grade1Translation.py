# ====================================================================
# Grade1Translation.py — Literal UEB Grade 1 Translation (Exact Match)
# ====================================================================

import re

# --------------------------------------------------------------------
# MAPPINGS
# --------------------------------------------------------------------

GRADE_1_MAP = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵', ' ': ' ', '\n': '\n'
}

# Explicit capital letter mappings (each with ⠠ prefix)
CAPITAL_LETTER_MAP = {
    'A': '⠠⠁', 'B': '⠠⠃', 'C': '⠠⠉', 'D': '⠠⠙', 'E': '⠠⠑',
    'F': '⠠⠋', 'G': '⠠⠛', 'H': '⠠⠓', 'I': '⠠⠊', 'J': '⠠⠚',
    'K': '⠠⠅', 'L': '⠠⠇', 'M': '⠠⠍', 'N': '⠠⠝', 'O': '⠠⠕',
    'P': '⠠⠏', 'Q': '⠠⠟', 'R': '⠠⠗', 'S': '⠠⠎', 'T': '⠠⠞',
    'U': '⠠⠥', 'V': '⠠⠧', 'W': '⠠⠺', 'X': '⠠⠭', 'Y': '⠠⠽',
    'Z': '⠠⠵'
}

PUNCTUATION_MAP = {
    ',': '⠂', ';': '⠆', ':': '⠒', '.': '⠲', '?': '⠦', '!': '⠖',
    "'": '⠄', '"': '⠶', '(': '⠣', ')': '⠜', '-': '⠤', '/': '⠌',
    '&': '⠯', '@': '⠈⠁', '%': '⠨⠴', '+': '⠐⠖', '=': '⠶', '*': '⠔',
    '#': '⠼', '$': '⠈⠎', '£': '⠈⠇', '€': '⠈⠑', '^': '⠘', '_': '⠸⠤',
    '×': '⠐⠦', '÷': '⠌⠤'
}

NUMBER_MAP = {
    '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑',
    '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊', '0': '⠚'
}

# Indicators
CAPITAL_SIGN = '⠠'
NUMBER_SIGN = '⠼'
PLACEHOLDER = '⠿'

# --------------------------------------------------------------------
# FUNCTIONS
# --------------------------------------------------------------------

def normalize_text(text: str) -> str:
    """Normalize text by collapsing extra whitespace."""
    return re.sub(r'\s+', ' ', text.strip())

def translate_grade1(text: str) -> str:
    """
    Literal UEB Grade 1 Braille translator.
    Every uppercase letter gets its ⠠ prefix.
    Each number sequence starts with ⠼.
    All characters are mapped exactly as seen.
    """
    text = normalize_text(text)
    result = []
    in_number = False

    for ch in text:
        # Handle numbers
        if ch.isdigit():
            if not in_number:
                result.append(NUMBER_SIGN)
                in_number = True
            result.append(NUMBER_MAP.get(ch, PLACEHOLDER))
            continue

        # If transitioning out of a number block
        if in_number and not ch.isdigit():
            in_number = False

        

        # Handle uppercase letters explicitly
        if ch.isupper():
            base = ch.lower()
            if base in GRADE_1_MAP:
                result.append(CAPITAL_SIGN + GRADE_1_MAP[base])
            else:
                result.append(PLACEHOLDER)
            continue

        # Handle lowercase letters
        if ch in GRADE_1_MAP:
            result.append(GRADE_1_MAP[ch])
            continue

        # Handle punctuation
        if ch in PUNCTUATION_MAP:
            result.append(PUNCTUATION_MAP[ch])
            continue

        # Handle spaces
        if ch == ' ':
            result.append(' ')
            continue

        # Unknowns
        result.append(PLACEHOLDER)

    return ''.join(result)

# --------------------------------------------------------------------
# DEMO
# --------------------------------------------------------------------
if __name__ == "__main__":
    text = input("Enter text to translate to Braille Grade 1:\n> ")
    print("\nBraille Output:")
    print(translate_grade1(text))
