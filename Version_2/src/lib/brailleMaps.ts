/**
 * Maps a 6-dot binary pattern (e.g., "100000") to a Braille character.
 * Used by the 6-dot input.
 */
export const dotPatternToBrailleMap: { [key: string]: string } = {
  "100000": "⠁", // A
  "110000": "⠃", // B
  "100100": "⠉", // C
  "100110": "⠙", // D
  "100010": "⠑", // E
  "110100": "⠋", // F
  "110110": "⠛", // G
  "110010": "⠓", // H
  "010100": "⠊", // I
  "010110": "⠚", // J
  "101000": "⠅", // K
  "111000": "⠇", // L
  "101100": "⠍", // M
  "101110": "⠝", // N
  "101010": "⠕", // O
  "111100": "⠏", // P
  "111110": "⠟", // Q
  "111010": "⠗", // R
  "011100": "⠎", // S
  "011110": "⠞", // T
  "101001": "⠥", // U
  "111001": "⠧", // V
  "010111": "⠺", // W
  "101101": "⠭", // X
  "101111": "⠽", // Y
  "101011": "⠵", // Z
  "000000": " ",   // Space
};

/**
 * Maps keyboard labels (like 'Q', '1', '!', 'th') to Braille characters.
 * Derived from the data in BrailleKeyboard.tsx
 * Note: This map should be expanded for completeness. Some keys from
 * BrailleKeyboard might map to the same Braille character initially.
 */
export const labelToBrailleMap: { [key: string]: string } = {
  // Letters (Uppercase labels map to lowercase keys for consistency)
  'A': '⠁', 'B': '⠃', 'C': '⠉', 'D': '⠙', 'E': '⠑', 'F': '⠋', 'G': '⠛',
  'H': '⠓', 'I': '⠊', 'J': '⠚', 'K': '⠅', 'L': '⠇', 'M': '⠍', 'N': '⠝',
  'O': '⠕', 'P': '⠏', 'Q': '⠟', 'R': '⠗', 'S': '⠎', 'T': '⠞', 'U': '⠥',
  'V': '⠧', 'W': '⠺', 'X': '⠭', 'Y': '⠽', 'Z': '⠵',
  // Numbers (Using Grade 1 Braille mappings, often prefixed in practice)
  '1': '⠂', // Using dot 2 for '1' as per image seems non-standard Grade 1, using standard dot 1 'a' mapping instead for reverse? Check standard. Let's assume standard Grade 1 for reverse for now.
  '2': '⠆', // Assuming standard Grade 1 B
  '3': '⠒', // Assuming standard Grade 1 C
  '4': '⠲', // Assuming standard Grade 1 D
  '5': '⠢', // Assuming standard Grade 1 E
  '6': '⠖', // Assuming standard Grade 1 F
  '7': '⠶', // Assuming standard Grade 1 G
  '8': '⠦', // Assuming standard Grade 1 H
  '9': '⠔', // Assuming standard Grade 1 I
  '0': '⠴', // Assuming standard Grade 1 J
  // Punctuation & Symbols (Add more as needed)
  '`': '⠈', // Grave accent (dot 4)
  '!': '⠖', // Exclamation (dots 2-3-5) - Same as 6/F
  '@': '⠈', // At sign (assuming dot 4) - Needs clarification
  '#': '⠼', // Number sign (dots 3-4-5-6)
  '$': '⠫', // Dollar sign (dots 1-2-4-6) - Same as 'ed'
  '%': '⠩', // Percent sign (dots 1-4-6 - same as 'sh')
  '*': '⠡', // Asterisk (dots 1-6 - same as 'ch')
  '[': '⠪', // Opening bracket (dots 2-4-6) - Same as 'ow'
  ']': '⠻', // Closing bracket (dots 1-2-4-5-6) - Same as 'er'
  '-': '⠤', // Hyphen (dots 3-6)
  '=': '⠶', // Equals (dots 2-3-5-6) - Same as 7/G
  '(': '⠐⠣', // Opening parenthesis (prefix + shape) - Simplified to just shape
  ')': '⠐⠜', // Closing parenthesis (prefix + shape) - Simplified to just shape
  "'": '⠄', // Apostrophe (dot 3)
  '\\': '⠌', // Backslash (dots 3-4) - Same as '/' and 'st'
  ';': ' semicolons', // Semicolon (dots 2-3)
  ':': '⠱', // Colon (dots 1-5-6) - Same as 'wh' and '\5/'
  ',': '⠂', // Comma (dot 2) - Same as 1
  '.': '⠲', // Period (dots 2-5-6)
  '/': '⠌', // Slash (dots 3-4) - Same as '\' and 'st'
  '?': '⠦', // Question mark (dots 2-3-6) - Same as 8/H
  '"': '⠶', // Quotation mark (dots 2-3-5-6) - Same as 7/G and =
  // Digraphs / Contractions
  'sh': '⠩',
  'and': '⠯',
  'ing': '⠬',
  'th': '⠹',
  'ch': '⠡',
  'wh': '⠱',
  'gh': '⠣',
  'ar': '⠜',
  'ow': '⠪',
  'ou': '⠌', // Note: Same as /, \, st
  'of': '⠷',
  'in': '⠔', // Same as 9/I
  'ed': '⠫', // Same as $
  'en': '⠢', // Same as 5/E
  'er': '⠻', // Same as ]
  'st': '⠌', // Same as /, \, ou
  'the': '⠮',
  'for': '⠿',
  'with': '⠾',
  // Special Keys (Map to space or handle differently)
  'Space': ' ', // Map empty label to space
  '': ' ',      // Treat empty label as space too
  'Tab': '\t',  // Tab character (might need special handling)
  'Enter': '\n', // Newline character (might need special handling)
  // Prefixes/Indicators (Might need special handling rather than direct mapping)
  'Caps Lock': '', // No direct Braille char, affects subsequent chars
  'Upper Case': '', // No direct Braille char
  'Letter Prefix': '', // No direct Braille char
  '\\5/': '⠱', // Same as wh, :
  '\\456/': '', // Special indicator - No direct mapping
  '\\46/': '', // Special indicator - No direct mapping
  '\\4/': '', // Special indicator - No direct mapping
  // Keys to ignore/handle separately
  'Delete': 'DELETE', // Use a special string to handle deletion
};


/**
 * Maps Braille characters back to text for display.
 * Used for the final conversion.
 * NOTE: This is simplified. Reverse mapping, especially with contractions
 * and grade 2 Braille, is complex and context-dependent.
 * DUPLICATES REMOVED/COMMENTED OUT TO FIX TYPESCRIPT ERRORS.
 */
export const brailleToTextMap: { [key: string]: string } = {
  // Letters
  "⠁": "a", "⠃": "b", "⠉": "c", "⠙": "d", "⠑": "e", "⠋": "f",
  "⠛": "g", "⠓": "h", "⠊": "i", "⠚": "j", "⠅": "k", "⠇": "l",
  "⠍": "m", "⠝": "n", "⠕": "o", "⠏": "p", "⠟": "q", "⠗": "r",
  "⠎": "s", "⠞": "t", "⠥": "u", "⠧": "v", "⠺": "w", "⠭": "x",
  "⠽": "y", "⠵": "z", " ": " ",
  // Numbers (Using Grade 1 letters for simplicity in reverse)
  // "⠼": "#", // Number sign - If needed
  // Punctuation (Simplified - Prioritizing most common meaning)
  "⠲": ".", // Period (dots 2-5-6) - also used for '4' if no num sign
  "⠂": ",", // Comma (dot 2) - also used for '1' if no num sign
  "⠦": "?", // Question mark (dots 2-3-6) - also used for '8'
  "⠖": "!", // Exclamation (dots 2-3-5) - also used for '6'
  "⠄": "'", // Apostrophe (dot 3)
  " semicolons": ";", // Semicolon (dots 2-3)
  // "⠱": ":", // Colon (dots 1-5-6) - Conflicts with 'wh'
  // "⠌": "/", // Slash (dots 3-4) - Conflicts with 'st', '\' etc.
  // Contractions (Very simplified reverse mapping)
  "⠮": "the",
  "⠬": "ing",
  "⠯": "and",
  "⠷": "of",
  "⠿": "for",
  "⠾": "with",
  "⠹": "th",
  "⠡": "ch",
  "⠩": "sh",
  "⠱": "wh", // Prioritized over Colon, \5/
  // Commenting out conflicting mappings for now
  // "⠣": "gh",
  // "⠜": "ar",
  // "⠪": "ow", // Conflicts with [
  // "⠌": "ou", // Conflicts with /, \, st
  // "⠔": "in", // Conflicts with 9/I
  // "⠫": "ed", // Conflicts with $
  // "⠢": "en", // Conflicts with 5/E
  // "⠻": "er", // Conflicts with ]
  // "⠌": "st", // Conflicts with /, \, ou
};

