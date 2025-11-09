# Grade2Translation.py - FINAL REFINEMENT

from Grade1Translation import (
    translate_grade1, GRADE_1_MAP, CAPITAL_SIGN, NUMBER_SIGN, NUMBER_MAP
)
import re

# ====================================================================
# GRADE 2 CONTRACTION MAPS (Unified and Corrected)
# ====================================================================

# Unified Contractions: Longer matches MUST be listed first (e.g., "sh" before "s")
# We will treat the whole-word contractions as part of this list 
# because they are applied to the "core word."
CONTRACTIONS = {
    # 3-Letter Suffixes/Groups (MUST be highest priority)
    "ing": "⠣",    # Suffix: dots 3-5-6 (The 'g' cell dropped to the bottom)
    "tion": "⠴",   # Suffix: dots 3-4-5-6
    # Whole-Word Contractions (WWC) and Strong Group Signs (SC)
    "child": "⠡",  # WWC/SC
    "shall": "⠱",  # WWC/SC
    "which": "⠹",  # WWC/SC
    "out": "⠥",    # WWC/SC for 'out'
    "st": "⠎",     # Group Sign
    "ar": "⠜",     # Group Sign
    "er": "⠻",     # Group Sign
    "ch": "⠡",     # Group Sign
    "gh": "⠣",     # Group Sign
    "sh": "⠱",     # Group Sign
    "th": "⠹",     # Group Sign
    "wh": "⠷",     # Group Sign
    "ed": "⠫",     # Group Sign
    "ou": "⠦",     # Group Sign
    "ow": "⠳",     # Group Sign
    # Lower-Cell Word Signs (MUST stand alone as a whole word)
    "and": "⠯", "for": "⠿", "of": "⠷", "the": "⠮", "with": "⠾",
    # Single-Letter Word Signs (WWC)
    "but": "⠃", "can": "⠉", "do": "⠙", "every": "⠑", "from": "⠋",
    "go": "⠛", "have": "⠓", "just": "⠚", "knowledge": "⠅", "like": "⠇",
    "more": "⠍", "not": "⠝", "so": "⠕", "that": "⠹", "us": "⠥",
    "very": "⠧", "will": "⠺", "it": "⠭", "you": "⠽", "as": "⠵",
    "are": "⠜", # Word Sign for 'are'
}

# Sort contractions by length (longest first) to handle "checking" -> "ing" correctly.
SORTED_CONTRACTIONS = sorted(CONTRACTIONS.keys(), key=len, reverse=True)


# ====================================================================
# CORE LOGIC FUNCTIONS
# ====================================================================

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
    """
    Applies contractions using a sequential, non-overlapping scan, 
    then applies Grade 1 translation to any remaining uncontracted letters.
    """
    if not word:
        return ""

    # Check for Capitalization (applied only to the first cell)
    braille_prefix = CAPITAL_SIGN if word[0].isalpha() and word[0].isupper() else ""
    lower_word = word.lower()
    
    # Check for Number Sign (applied only once at the start)
    if lower_word[0].isdigit():
        braille_prefix = NUMBER_SIGN
        
    braille_list = []
    i = 0
    
    while i < len(lower_word):
        matched = False
        
        # 1. Try to match the longest available contraction at the current position 'i'
        for sign in SORTED_CONTRACTIONS:
            braille_sign = CONTRACTIONS[sign]
            sign_len = len(sign)
            
            if lower_word[i:i + sign_len] == sign:
                # Special Check: If it's a single-letter word sign, it must be a whole word
                if sign in ["a", "but", "can", "do", "every", "from", "go", "have", 
                            "just", "knowledge", "like", "more", "not", "so", "that", 
                            "us", "very", "will", "it", "you", "as", "are"]:
                    
                    # If the word is NOT exactly this contraction, skip this rule
                    if lower_word != sign:
                        continue 

                braille_list.append(braille_sign)
                i += sign_len
                matched = True
                break
        
        # 2. If no contraction was found, apply Grade 1 translation to the single letter/digit
        if not matched:
            char = lower_word[i]
            
            # NOTE: We skip prefix handling here because it was done at the start.
            # We must only translate the *single* character.
            
            if char.isdigit():
                 # Handle digits after the initial number sign
                 braille_list.append(NUMBER_MAP.get(char, char))
            else:
                 # Standard letter/punctuation translation
                 braille_list.append(GRADE_1_MAP.get(char, char))
            
            i += 1
            
    return braille_prefix + "".join(braille_list)


def translate_grade2(text: str) -> str:
    """
    Translates English text to Grade 2 (contracted) Braille.
    """
    if not text:
        return ""

    braille_output = []
    
    # Tokenize the text into word/punctuation/space chunks
    tokens = re.findall(r'(\s+|\S+)', text)
    
    for token in tokens:
        if token.isspace():
            braille_output.append(token)
            continue
            
        # 1. Separate the token into its parts
        leading_punc, core_word, trailing_punc = _split_word_and_punctuation(token)
        
        # 2. Translate punctuation (using Grade 1 logic)
        braille_output.append(translate_grade1(leading_punc))
        
        # 3. Translate the core word/number using the full Grade 2 logic
        braille_output.append(_apply_contractions_and_grade1_fallback(core_word))
        
        # 4. Translate trailing punctuation (using Grade 1 logic)
        braille_output.append(translate_grade1(trailing_punc))

    return "".join(braille_output)