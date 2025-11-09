# BrailleToText.py
from Grade1Translation import GRADE_1_MAP, NUMBER_MAP

# Define indicators locally (to keep Grade1Translation.py unchanged)
CAPITAL_SIGN = '⠠'
NUMBER_SIGN = '⠼'

# Reverse the dictionaries
REVERSE_GRADE1 = {v: k for k, v in GRADE_1_MAP.items()}
REVERSE_NUMBERS = {v: k for k, v in NUMBER_MAP.items()}

def braille_to_text(braille_input: str) -> str:
    """
    Converts Braille Unicode patterns back to English text (Grade 1).
    Handles capitalization, numbers, and basic punctuation.
    """
    output = []
    i = 0
    cap_next = False
    num_mode = False

    while i < len(braille_input):
        ch = braille_input[i]

        # Capital sign (⠠)
        if ch == CAPITAL_SIGN:
            cap_next = True
            i += 1
            continue

        # Number sign (⠼)
        elif ch == NUMBER_SIGN:
            num_mode = True
            i += 1
            continue

        # Space or newline
        elif ch in [' ', '\n']:
            output.append(ch)
            num_mode = False
            cap_next = False  # reset capitalization after space
            i += 1
            continue

        # Translate actual Braille
        if num_mode:
            text_char = REVERSE_NUMBERS.get(ch, '')
        else:
            text_char = REVERSE_GRADE1.get(ch, '')

        # Apply capitalization only for the next single letter
        if cap_next and text_char.isalpha():
            text_char = text_char.upper()
            cap_next = False

        output.append(text_char)
        i += 1

        # If number mode and current char isn’t a number, exit number mode
        if num_mode and ch not in REVERSE_NUMBERS:
            num_mode = False

    return "".join(output)
