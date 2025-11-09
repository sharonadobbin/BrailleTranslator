# Grade1Translation.py

# ====================================================================
# BRAILLE MAPPINGS AND CONSTANTS
# ====================================================================

# Grade 1 Letter-for-Letter Map (Unicode Braille Patterns)
GRADE_1_MAP = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵',
    ' ': ' ',   # Space
    # Punctuation (Standard US English Braille)
    '.': '⠲',   # Period (Dots 2-5-6)
    ',': '⠂',   # Comma (Dot 2)
    '!': '⠖',   # Exclamation point (Dots 2-3-5)
    '?': '⠦',   # Question mark (Dots 2-3-6)
    '“': '⠶',   # Opening/Closing Quote (Dots 2-3-5-6)
    '”': '⠶',   # Same as opening quote
    '"': '⠶',   # Simple Double Quote
    "'": '⠄',   # Apostrophe (Dot 3)
    '-': '⠤',   # Hyphen (Dots 3-6)
    '(': '⠣',   # Opening Parenthesis (Dots 1-2-6) - used as a two-cell sign
    ')': '⠜',   # Closing Parenthesis (Dots 3-4-5) - used as a two-cell sign
    '\n': '\n'  # Newline
}

# Number Map (1-9 and 0 correspond to a-j)
NUMBER_MAP = {
    '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑',
    '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊', '0': '⠚',
}

# Braille Prefixes
CAPITAL_SIGN = '⠠' # Dots 6
NUMBER_SIGN = '⠼'  # Dots 3-4-5-6


def translate_grade1(text: str) -> str:
    """
    Translates English text to Grade 1 (uncontracted) Braille.
    Handles capitalization, numbers, and basic punctuation.
    """
    braille_output = []
    in_number_sequence = False 

    for i, char in enumerate(text):
        braille_char = ''
        
        # 1. Handle Numbers
        if char.isdigit():
            if not in_number_sequence:
                braille_output.append(NUMBER_SIGN)
                in_number_sequence = True
            
            braille_char = NUMBER_MAP.get(char, '')
            
        else:
            in_number_sequence = False
            
            # 2. Handle Capitalization (Check original character case)
            if char.isalpha() and char.isupper():
                braille_output.append(CAPITAL_SIGN)
                # Convert to lowercase for lookup
                lookup_char = char.lower()
            else:
                lookup_char = char

            # 3. Look up in the Grade 1 map
            braille_char = GRADE_1_MAP.get(lookup_char, char) # Keep unmapped chars (like #, @) as is
        
        braille_output.append(braille_char)

    return "".join(braille_output)