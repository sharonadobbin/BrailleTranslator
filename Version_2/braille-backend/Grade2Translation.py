# ===============================================================
# Grade2Translation.py — Unified English Braille (UEB) Grade 2
# ===============================================================

from Grade1Translation import (
    translate_grade1, GRADE_1_MAP, NUMBER_MAP
)
import re

# ----------------------------------------------------------------
# Indicators
# ----------------------------------------------------------------
CAPITAL_SIGN = '⠠'          # Single capital
DOUBLE_CAPITAL_SIGN = '⠠⠠'  # Double capital (word fully uppercase)
NUMBER_SIGN = '⠼'            # Numeric indicator

# ----------------------------------------------------------------
# Grade 2 Contractions (UEB-based, from Aroga reference chart)
# ----------------------------------------------------------------
CONTRACTIONS = {
    # STRONG GROUPSIGNS
    "ch": "⠡", "gh": "⠣", "sh": "⠩", "th": "⠹", "wh": "⠱",
    "ed": "⠫", "er": "⠻", "ou": "⠳", "ow": "⠪", "st": "⠌", "ar": "⠜", "ing": "⠬",

    # FINAL-LETTER GROUPSIGNS (suffixes)
    "ound": "⠯", "ance": "⠜", "sion": "⠴", "less": "⠣", "ount": "⠳",
    "ence": "⠑", "ong": "⠕", "ful": "⠋", "tion": "⠞", "ness": "⠝",
    "ment": "⠍", "ity": "⠽",

    # INITIAL-LETTER CONTRACTIONS
    "day": "⠙", "ever": "⠑", "father": "⠋", "here": "⠓", "know": "⠅",
    "lord": "⠇", "mother": "⠍", "name": "⠝", "one": "⠕", "part": "⠏",
    "question": "⠟", "right": "⠗", "some": "⠎", "time": "⠞", "under": "⠥",
    "work": "⠺", "young": "⠽",

    # STRONG WORDSIGNS (whole words)
    "child": "⠡", "shall": "⠩", "this": "⠹", "which": "⠱",
    "out": "⠳", "still": "⠌",

    # LOWER WORDSIGNS (whole words)
    "be": "⠃", "enough": "⠢", "were": "⠺", "his": "⠓", "in": "⠊", "was": "⠱",

    # ALPHABETIC WORDSIGNS (whole words)
    "but": "⠃", "can": "⠉", "do": "⠙", "every": "⠑", "from": "⠋",
    "go": "⠛", "have": "⠓", "just": "⠚", "knowledge": "⠅", "like": "⠇",
    "more": "⠍", "not": "⠝", "people": "⠏", "quite": "⠟", "rather": "⠗",
    "so": "⠕", "that": "⠹", "us": "⠥", "very": "⠧", "will": "⠺",
    "it": "⠭", "you": "⠽", "as": "⠵",

    # LOWER GROUPSIGNS
    "ea": "⠂", "bb": "⠆", "cc": "⠒", "ff": "⠖", "gg": "⠶",
    "con": "⠒", "dis": "⠲", "en": "⠢", "in": "⠔",

    # STRONG CONTRACTIONS (part and whole word)
    "and": "⠯", "for": "⠿", "of": "⠷", "the": "⠮", "with": "⠾",
}

# Sort contractions by length (longest first)
SORTED_CONTRACTIONS = sorted(CONTRACTIONS.keys(), key=len, reverse=True)

# ----------------------------------------------------------------
# Helper Functions
# ----------------------------------------------------------------

def _split_word_and_punctuation(token: str) -> tuple[str, str, str]:
    """Separates punctuation before and after the core word/number."""
    leading_punc_match = re.match(r'^([^a-zA-Z0-9\s]*)', token)
    leading_punc = leading_punc_match.group(0) if leading_punc_match else ""
    temp_word = token[len(leading_punc):]
    trailing_punc_match = re.search(r'([^a-zA-Z0-9\s]*)$', temp_word)
    trailing_punc = trailing_punc_match.group(0) if trailing_punc_match else ""
    core_word = temp_word[:-len(trailing_punc)] if trailing_punc else temp_word
    return leading_punc, core_word, trailing_punc


def _apply_contractions_and_grade1_fallback(word: str) -> str:
    """Applies contractions and Grade 1 fallback for any uncontracted letters."""
    if not word:
        return ""

    braille_prefix = ""

    # Capitalization indicators
    if word.isupper() and word.isalpha():
        braille_prefix = DOUBLE_CAPITAL_SIGN
    elif word[0].isupper():
        braille_prefix = CAPITAL_SIGN

    lower_word = word.lower()

    # Number handling
    if lower_word[0].isdigit():
        braille_prefix = NUMBER_SIGN

    braille_list = []
    i = 0

    while i < len(lower_word):
        matched = False

        # Try contractions first (longest first)
        for sign in SORTED_CONTRACTIONS:
            braille_sign = CONTRACTIONS[sign]
            sign_len = len(sign)

            if lower_word[i:i + sign_len] == sign:
                # Apply word-sign rules (whole-word only)
                if sign in [
                    "but", "can", "do", "every", "from", "go", "have",
                    "just", "knowledge", "like", "more", "not", "people",
                    "quite", "rather", "so", "that", "us", "very",
                    "will", "it", "you", "as", "are"
                ] and lower_word != sign:
                    continue  # skip partial word-sign use

                braille_list.append(braille_sign)
                i += sign_len
                matched = True
                break

        if not matched:
            char = lower_word[i]
            if char.isdigit():
                braille_list.append(NUMBER_MAP.get(char, char))
            else:
                braille_list.append(GRADE_1_MAP.get(char, char))
            i += 1

    return braille_prefix + "".join(braille_list)


# ----------------------------------------------------------------
# Main Translation Function
# ----------------------------------------------------------------

def translate_grade2(text: str) -> str:
    """Translates English text to Unified English Braille (Grade 2)."""
    if not text:
        return ""

    braille_output = []
    tokens = re.findall(r'(\s+|\S+)', text)

    for token in tokens:
        if token.isspace():
            braille_output.append(token)
            continue

        leading_punc, core_word, trailing_punc = _split_word_and_punctuation(token)

        # Punctuation handled as Grade 1
        braille_output.append(translate_grade1(leading_punc))

        # Core translation with Grade 2 rules
        braille_output.append(_apply_contractions_and_grade1_fallback(core_word))

        # Trailing punctuation handled as Grade 1
        braille_output.append(translate_grade1(trailing_punc))

    return "".join(braille_output)
