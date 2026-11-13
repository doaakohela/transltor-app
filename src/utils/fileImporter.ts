import JSZip from 'jszip';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export interface ParsedWordEntry {
  sourceText: string;
  targetText: string;
}

export interface EncodingChoice {
  id: string;
  label: string;
}

export const ENCODING_CHOICES: EncodingChoice[] = [
  { id: 'auto', label: 'Auto-Detect (All Languages)' },
  { id: 'utf-8', label: 'UTF-8 (Universal)' },
  { id: 'utf-16le', label: 'UTF-16 LE (Unicode Excel/Windows)' },
  { id: 'utf-16be', label: 'UTF-16 BE' },
  { id: 'windows-1256', label: 'Windows-1256 (Arabic / Persian / Urdu)' },
  { id: 'iso-8859-6', label: 'ISO-8859-6 (Arabic ISO)' },
  { id: 'windows-1252', label: 'Windows-1252 (English / French / Spanish / German)' },
  { id: 'windows-1251', label: 'Windows-1251 (Russian / Ukrainian / Cyrillic)' },
  { id: 'windows-1254', label: 'Windows-1254 (Turkish)' },
  { id: 'windows-1250', label: 'Windows-1250 (Polish / Czech / Central Europe)' },
  { id: 'windows-1253', label: 'Windows-1253 (Greek)' },
  { id: 'windows-1255', label: 'Windows-1255 (Hebrew)' },
  { id: 'windows-874', label: 'Windows-874 (Thai)' },
  { id: 'shift_jis', label: 'Shift_JIS (Japanese)' },
  { id: 'euc-jp', label: 'EUC-JP (Japanese)' },
  { id: 'euc-kr', label: 'EUC-KR (Korean)' },
  { id: 'gb18030', label: 'GB18030 / GBK (Chinese Simplified)' },
  { id: 'big5', label: 'Big5 (Chinese Traditional)' },
];

export interface ImportedFileResult {
  fileName: string;
  fileSize: number;
  formatLabel: string;
  detectedEncoding: string;
  supportsEncodingOverride: boolean;
  items: ParsedWordEntry[];
  previewText: string;
  skippedLines: number;
  warnings: string[];
}

export interface ImportParseOptions {
  manualEncoding?: string;
  preferredLangs?: string[];
  onProgress?: (percent: number, stage: string) => void;
}

// ============================================================================
// STRICT FILE UPLOAD SECURITY CONSTANTS & VALIDATORS
// ============================================================================

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB DoS cap
export const MAX_ZIP_ENTRIES = 1000;
export const MAX_DECOMPRESSED_XML_BYTES = 40 * 1024 * 1024; // 40 MB Zip-bomb cap
export const MAX_WORDS_LIMIT = 25000;
export const MAX_LINE_LENGTH = 2000;

export const ALLOWED_TEXT_AND_DOC_EXTENSIONS = new Set([
  'txt', 'text', 'csv', 'tsv', 'json', 'jsonl', 'ndjson', 'md', 'markdown',
  'srt', 'vtt', 'sub', 'rtf', 'doc', 'docx', 'odt', 'xls', 'xlsx', 'ods',
  'pdf', 'xml', 'tmx', 'xliff', 'xlf', 'tbx',
]);

export const PLAIN_TEXT_ONLY_EXTENSIONS = new Set([
  'txt', 'text', 'csv', 'tsv', 'json', 'jsonl', 'ndjson', 'md', 'markdown',
  'srt', 'vtt', 'sub', 'xml', 'tmx', 'xliff', 'xlf', 'tbx',
]);

export const BLOCKED_IMAGE_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'jpe', 'jfif', 'pjpeg', 'pjp', 'png', 'apng', 'gif', 'webp',
  'bmp', 'dib', 'ico', 'cur', 'tif', 'tiff', 'svg', 'svgz', 'heic', 'heif',
  'avif', 'psd', 'ai', 'eps', 'raw', 'cr2', 'cr3', 'nef', 'arw', 'orf', 'rw2',
  'dng', 'tga', 'pcx', 'exr', 'hdr', 'jxl',
]);

export const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'msi', 'msp', 'mst', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'vbe',
  'js', 'jse', 'mjs', 'cjs', 'ts', 'tsx', 'jsx', 'ws', 'wsf', 'wsh', 'ps1',
  'ps1xml', 'psc1', 'psd1', 'psm1', 'sh', 'bash', 'zsh', 'csh', 'ksh', 'php',
  'php3', 'php4', 'php5', 'phtml', 'py', 'pyc', 'pl', 'rb', 'jar', 'war', 'ear',
  'apk', 'xap', 'ipa', 'deb', 'rpm', 'app', 'dmg', 'iso', 'img', 'dll', 'sys',
  'drv', 'ocx', 'cpl', 'lnk', 'url', 'inf', 'reg', 'hta', 'html', 'htm', 'xhtml',
  'mht', 'mhtml', 'chm', 'docm', 'dotm', 'xlsm', 'xltm', 'xlam', 'xlsb', 'pptm',
  'potm', 'ppam', 'ppsm', 'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'wasm',
  'swf', 'fla', 'torrent',
]);

/**
 * HTML <input accept="..."> filter strictly allowing Text & Safe Vocabulary Documents only
 * (Excludes all images, videos, audio, HTML/SVG, executables, macros, and raw archives)
 */
export const SAFE_VOCAB_FILE_ACCEPT = [
  '.txt', '.text', '.csv', '.tsv', '.json', '.jsonl', '.ndjson', '.md', '.markdown',
  '.srt', '.vtt', '.sub', '.rtf', '.doc', '.docx', '.odt', '.xls', '.xlsx', '.ods',
  '.pdf', '.xml', '.tmx', '.xliff', '.xlf', '.tbx',
  'text/plain', 'text/csv', 'text/tab-separated-values', 'text/markdown',
  'application/json', 'application/pdf', 'application/rtf', 'text/rtf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.spreadsheet',
].join(',');

export class FileSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileSecurityError';
  }
}

function getFileExtension(fileName: string): string {
  const cleanName = (fileName || '').trim();
  const lastDot = cleanName.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === cleanName.length - 1) return '';
  return cleanName.slice(lastDot + 1).toLowerCase();
}

/**
 * Layer 1 Metadata Validation: blocks images, media, executables, macro-enabled Office files,
 * HTML/SVG files, oversized files, and suspicious double extensions BEFORE reading bytes.
 */
export function validateFileSecurity(file: Pick<File, 'name' | 'size' | 'type'>): void {
  if (!file || !file.name) {
    throw new FileSecurityError('Blocked: Invalid or missing file name.');
  }

  const fileName = file.name.trim();
  if (/[\x00-\x1f]/.test(fileName) || fileName.includes('..') || /[\\/]/.test(fileName) || fileName.length > 255) {
    throw new FileSecurityError('Security Alert: Suspicious or malformed file path detected and blocked.');
  }

  if (file.size === 0) {
    throw new FileSecurityError('Blocked: Empty file (0 bytes).');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new FileSecurityError(
      `Security Limit: File exceeds maximum safe size of ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))} MB.`
    );
  }

  const mime = (file.type || '').toLowerCase().trim();
  const ext = getFileExtension(fileName);

  // 1. Explicitly block ALL images regardless of extension
  if (mime.startsWith('image/') || BLOCKED_IMAGE_EXTENSIONS.has(ext)) {
    throw new FileSecurityError(
      'Images are not allowed (.jpg, .png, .webp, .gif, .svg, etc.). Please upload text or vocabulary document files only.'
    );
  }

  // 2. Block audio / video / HTML / scripts / executables by MIME
  if (
    mime.startsWith('video/') ||
    mime.startsWith('audio/') ||
    mime === 'text/html' ||
    mime === 'application/xhtml+xml' ||
    mime.includes('javascript') ||
    mime.includes('ecmascript') ||
    mime.includes('x-msdownload') ||
    mime.includes('x-executable') ||
    mime.includes('x-sh') ||
    mime.includes('x-httpd-php') ||
    mime === 'application/x-dosexec'
  ) {
    throw new FileSecurityError(
      `Security Alert: File MIME type (${mime}) is blocked. Only safe text and vocabulary documents are permitted.`
    );
  }

  // 3. Block dangerous / executable / macro / archive extensions
  if (ext && DANGEROUS_EXTENSIONS.has(ext)) {
    throw new FileSecurityError(
      `Security Alert: ".${ext}" files are blocked for your protection (executables, scripts, HTML, macros, and archives are not allowed).`
    );
  }

  // 4. Detect dangerous double extensions like "list.exe.txt" or "photo.png.csv"
  const segments = fileName.toLowerCase().split('.');
  if (segments.length > 2) {
    const innerSegments = segments.slice(1, -1);
    for (const seg of innerSegments) {
      if (BLOCKED_IMAGE_EXTENSIONS.has(seg)) {
        throw new FileSecurityError(
          `Security Alert: Suspicious double extension (.${seg}.${ext}) referencing an image was blocked.`
        );
      }
      if (DANGEROUS_EXTENSIONS.has(seg)) {
        throw new FileSecurityError(
          `Security Alert: Suspicious double extension (.${seg}.${ext}) was blocked.`
        );
      }
    }
  }

  // 5. Enforce strict allowlist if an extension is present
  if (ext && !ALLOWED_TEXT_AND_DOC_EXTENSIONS.has(ext)) {
    throw new FileSecurityError(
      `Unsupported file format ".${ext}". Allowed: TXT, CSV, TSV, JSON, Word (.docx/.doc/.rtf), Excel (.xlsx/.xls), PDF, XML.`
    );
  }
}

function bytesMatchAscii(bytes: Uint8Array, offset: number, ascii: string): boolean {
  if (offset < 0 || offset + ascii.length > bytes.length) return false;
  for (let i = 0; i < ascii.length; i++) {
    if (bytes[offset + i] !== ascii.charCodeAt(i)) return false;
  }
  return true;
}

function hasLikelyUtf16TextPattern(bytes: Uint8Array): boolean {
  if (bytes.length >= 2 && ((bytes[0] === 0xff && bytes[1] === 0xfe) || (bytes[0] === 0xfe && bytes[1] === 0xff))) {
    return true;
  }
  const len = Math.min(bytes.length, 2048);
  if (len < 8) return false;
  let evenNulls = 0;
  let oddNulls = 0;
  for (let i = 0; i < len; i++) {
    if (bytes[i] === 0) {
      if (i % 2 === 0) evenNulls++;
      else oddNulls++;
    }
  }
  const half = len / 2;
  return (oddNulls / half > 0.25 && evenNulls / half < 0.05) || (evenNulls / half > 0.25 && oddNulls / half < 0.05);
}

/**
 * Layer 2 Deep Binary Magic-Byte & Spoofed-File Inspector:
 * Prevents renamed images (photo.png -> words.txt), disguised executables (trojan.exe -> list.doc),
 * compiled binaries, archives, and active script/HTML payloads.
 */
function assertSafeBinaryPayload(bytes: Uint8Array, ext: string): {
  isZip: boolean;
  isPdf: boolean;
  isOle2: boolean;
  isRtf: boolean;
} {
  if (bytes.length === 0) {
    throw new FileSecurityError('Blocked: Empty file (0 bytes).');
  }

  // --- A. Unconditional Image Signature Checks ---
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    throw new FileSecurityError('Security Alert: Image file (JPEG) detected behind filename and blocked.');
  }
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    throw new FileSecurityError('Security Alert: Image file (PNG) detected behind filename and blocked.');
  }
  if (bytesMatchAscii(bytes, 0, 'GIF87a') || bytesMatchAscii(bytes, 0, 'GIF89a')) {
    throw new FileSecurityError('Security Alert: Image file (GIF) detected behind filename and blocked.');
  }
  if (bytesMatchAscii(bytes, 0, 'RIFF') && bytesMatchAscii(bytes, 8, 'WEBP')) {
    throw new FileSecurityError('Security Alert: Image file (WebP) detected behind filename and blocked.');
  }
  if (
    bytes.length >= 14 &&
    bytes[0] === 0x42 &&
    bytes[1] === 0x4d &&
    bytes[6] === 0x00 &&
    bytes[7] === 0x00 &&
    bytes[8] === 0x00 &&
    bytes[9] === 0x00
  ) {
    throw new FileSecurityError('Security Alert: Image file (BMP) detected behind filename and blocked.');
  }
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x00 &&
    bytes[1] === 0x00 &&
    (bytes[2] === 0x01 || bytes[2] === 0x02) &&
    bytes[3] === 0x00 &&
    bytes[4] > 0 &&
    bytes[5] === 0x00
  ) {
    throw new FileSecurityError('Security Alert: Image file (ICO/CUR) detected behind filename and blocked.');
  }
  if (
    (bytes.length >= 4 && bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00) ||
    (bytes.length >= 4 && bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a)
  ) {
    throw new FileSecurityError('Security Alert: Image file (TIFF) detected behind filename and blocked.');
  }
  if (bytesMatchAscii(bytes, 0, '8BPS')) {
    throw new FileSecurityError('Security Alert: Image file (PSD) detected behind filename and blocked.');
  }
  if (bytesMatchAscii(bytes, 4, 'ftyp')) {
    throw new FileSecurityError('Security Alert: Image/Media container (HEIC/AVIF/MP4) detected and blocked.');
  }
  if (
    (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0x0a) ||
    (bytes.length >= 12 && bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x00 && bytes[3] === 0x0c && bytesMatchAscii(bytes, 4, 'JXL '))
  ) {
    throw new FileSecurityError('Security Alert: Image file (JPEG XL) detected and blocked.');
  }

  // --- B. Unconditional Executable / Binary Malware Signatures ---
  if (bytes.length >= 4 && bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46) {
    throw new FileSecurityError('Security Alert: Executable binary (ELF) blocked.');
  }
  if (bytes.length >= 4 && bytes[0] === 0x00 && bytes[1] === 0x61 && bytes[2] === 0x73 && bytes[3] === 0x6d) {
    throw new FileSecurityError('Security Alert: Compiled WebAssembly binary blocked.');
  }
  if (
    bytes.length >= 4 &&
    ((bytes[0] === 0xfe && bytes[1] === 0xed && bytes[2] === 0xfa && (bytes[3] === 0xce || bytes[3] === 0xcf)) ||
      ((bytes[0] === 0xce || bytes[0] === 0xcf) && bytes[1] === 0xfa && bytes[2] === 0xed && bytes[3] === 0xfe) ||
      (bytes[0] === 0xca && bytes[1] === 0xfe && bytes[2] === 0xba && bytes[3] === 0xbe))
  ) {
    throw new FileSecurityError('Security Alert: Executable binary (Mach-O / Java Class) blocked.');
  }
  if (bytesMatchAscii(bytes, 0, 'dex\n')) {
    throw new FileSecurityError('Security Alert: Android Dalvik executable (.dex) blocked.');
  }
  if (bytesMatchAscii(bytes, 0, 'Rar!') || bytesMatchAscii(bytes, 0, '7z\xBC\xAF') || (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b)) {
    throw new FileSecurityError('Security Alert: Compressed archive binary blocked. Please extract and upload the vocabulary text/document directly.');
  }
  if (bytesMatchAscii(bytes, 0, 'SQLite format 3\0')) {
    throw new FileSecurityError('Security Alert: Raw database binary blocked.');
  }
  // Windows PE / MZ header check (avoid false positive on literal plain text "MZ..." by verifying non-printable control bytes)
  if (bytes.length >= 64 && bytes[0] === 0x4d && bytes[1] === 0x5a) {
    let hasBinaryNull = false;
    for (let i = 2; i < Math.min(bytes.length, 256); i++) {
      if (bytes[i] === 0x00 || (bytes[i] < 0x09)) {
        hasBinaryNull = true;
        break;
      }
    }
    if (hasBinaryNull) {
      throw new FileSecurityError('Security Alert: Windows executable binary (PE/EXE/DLL) blocked.');
    }
  }

  // --- C. Known Safe Container Signatures ---
  const isZip = bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
  const isPdf = bytesMatchAscii(bytes, 0, '%PDF-');
  const isOle2 =
    bytes.length >= 8 &&
    bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0 &&
    bytes[4] === 0xa1 && bytes[5] === 0xb1 && bytes[6] === 0x1a && bytes[7] === 0xe1;

  const headSampleLen = Math.min(bytes.length, 4096);
  const headAscii = new TextDecoder('ascii', { fatal: false }).decode(bytes.subarray(0, headSampleLen));
  const headTrimmedLower = headAscii.trimStart().toLowerCase();
  const isRtf = ext === 'rtf' || headTrimmedLower.startsWith('{\\rtf');

  // --- D. SVG / HTML / Script / Shebang Payload Scan in Header ---
  if (
    headTrimmedLower.startsWith('#!') ||
    headTrimmedLower.includes('<?php') ||
    headTrimmedLower.includes('<?=') ||
    headTrimmedLower.includes('<svg') ||
    headTrimmedLower.includes('http://www.w3.org/2000/svg') ||
    headTrimmedLower.includes('<script') ||
    headTrimmedLower.includes('<!doctype html') ||
    headTrimmedLower.startsWith('<html')
  ) {
    throw new FileSecurityError(
      'Security Alert: Blocked active script, SVG image, PHP shell, or HTML payload inside uploaded file.'
    );
  }

  // --- E. Extension-vs-Content Verification ---
  if (PLAIN_TEXT_ONLY_EXTENSIONS.has(ext)) {
    if (isZip || isPdf || isOle2) {
      throw new FileSecurityError(
        `Security Alert: File ".${ext}" actually contains a hidden binary container instead of plain text.`
      );
    }

    // Verify plain text files do not contain random raw binary bytes (when not UTF-16)
    if (!hasLikelyUtf16TextPattern(bytes)) {
      let binaryControlCount = 0;
      const checkN = Math.min(bytes.length, 4096);
      for (let i = 0; i < checkN; i++) {
        const b = bytes[i];
        if (b === 0x00 || (b >= 0x01 && b <= 0x08) || b === 0x0b || b === 0x0c || (b >= 0x0e && b <= 0x1f)) {
          binaryControlCount++;
        }
      }
      if (binaryControlCount > Math.max(2, checkN * 0.02)) {
        throw new FileSecurityError(
          `Security Alert: File ".${ext}" contains non-text binary data and was blocked.`
        );
      }
    }
  } else if (ext === 'pdf' && !isPdf) {
    throw new FileSecurityError('Security Alert: Invalid or spoofed PDF signature.');
  } else if (['docx', 'xlsx', 'odt', 'ods'].includes(ext) && !isZip) {
    throw new FileSecurityError(`Security Alert: File ".${ext}" is not a valid OpenXML/OpenDocument container.`);
  } else if (ext === 'rtf' && !headTrimmedLower.startsWith('{\\rtf')) {
    throw new FileSecurityError('Security Alert: Invalid or spoofed RTF file.');
  } else if (!ext) {
    // Extensionless mobile content-provider file: must be ZIP (Office), PDF, OLE2, RTF, or clean text
    if (!isZip && !isPdf && !isOle2 && !isRtf && !hasLikelyUtf16TextPattern(bytes)) {
      let binaryControlCount = 0;
      const checkN = Math.min(bytes.length, 4096);
      for (let i = 0; i < checkN; i++) {
        const b = bytes[i];
        if (b === 0x00 || (b >= 0x01 && b <= 0x08) || b === 0x0b || b === 0x0c || (b >= 0x0e && b <= 0x1f)) {
          binaryControlCount++;
        }
      }
      if (binaryControlCount > 2) {
        throw new FileSecurityError('Security Alert: Unrecognized binary file blocked.');
      }
    }
  }

  return { isZip, isPdf, isOle2, isRtf };
}

/**
 * Layer 3 Text / XML Payload Scanner & Sanitizer:
 * Detects XSS, XXE, Billion-Laughs entity attacks, shell commands, and Trojan Source BiDi overrides.
 */
export function assertNoMaliciousTextPayload(text: string, isXmlContext = false): void {
  if (!text) return;

  const sample = text.length > 500000 ? text.slice(0, 500000) : text;
  const lower = sample.toLowerCase();

  // XML / XXE / Billion-Laughs defense
  if (lower.includes('<!entity') || (isXmlContext && lower.includes('<!doctype'))) {
    throw new FileSecurityError('Security Alert: Unsafe XML DTD/ENTITY declaration blocked (XXE protection).');
  }

  // Active web/script exploit patterns
  if (
    /<script[\s>]/i.test(sample) ||
    /<\/script>/i.test(sample) ||
    /<svg[\s>]/i.test(sample) ||
    /<iframe[\s>]/i.test(sample) ||
    /<object[\s>]/i.test(sample) ||
    /<embed[\s>]/i.test(sample) ||
    /<\?php\b/i.test(sample) ||
    /\b(?:javascript|vbscript):/i.test(sample) ||
    /data:text\/html/i.test(sample) ||
    /wscript\.shell|mshta\s+http|powershell\s+-(?:enc|w\s+hidden)/i.test(sample)
  ) {
    throw new FileSecurityError(
      'Security Alert: Malicious script, active tag, or exploit payload detected and blocked.'
    );
  }
}

export function sanitizeExtractedText(input: string): string {
  if (!input) return '';
  let out = input
    // Remove NUL and dangerous control characters (keep tab \t, LF \n, CR \r)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove Trojan-Source BiDi override characters & zero-width obfuscators
    .replace(/[\u202A-\u202E\u2066-\u2069\u200B-\u200D\uFEFF]/g, '')
    // Strip active script/iframe/svg blocks if any fragment appeared inside cells/RTF
    .replace(/<\s*(?:script|iframe|object|embed|svg|style)[^>]*>[\s\S]*?<\/\s*(?:script|iframe|object|embed|svg|style)\s*>/gi, '')
    .replace(/<\s*\/?\s*(?:script|iframe|object|embed|svg)\b[^>]*>/gi, '')
    // Neutralize inline JS event handlers & script URI schemes
    .replace(/\bon[a-z]{2,20}\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\b(?:javascript|vbscript|data:text\/html)\s*:/gi, '');

  // Neutralize Excel CSV Formula Injection payloads (=cmd|..., +cmd|..., @SUM(...), =HYPERLINK(...))
  if (/^\s*[=+\-@](?:cmd|powershell|wscript|mshta|hyperlink|importxml|webservice|call|register)\b/i.test(out)) {
    out = out.replace(/^\s*[=+\-@]+/, '').trim();
  }

  if (out.length > MAX_LINE_LENGTH) {
    out = out.slice(0, MAX_LINE_LENGTH);
  }
  return out;
}

/**
 * Inspect ZIP container (used by DOCX/XLSX/ODT/ODS) for macros, ZIP-bombs, path traversal, and embedded executables
 */
function inspectSafeOfficeZip(zip: JSZip): {
  hasWordXml: boolean;
  hasExcelXml: boolean;
  isOdf: boolean;
} {
  const entries = Object.entries(zip.files);
  if (entries.length > MAX_ZIP_ENTRIES) {
    throw new FileSecurityError('Security Alert: Document archive contains too many entries (Zip-bomb protection).');
  }

  let hasWordXml = false;
  let hasExcelXml = false;
  let isOdf = false;

  for (const [rawName, entry] of entries) {
    const name = rawName.replace(/\\/g, '/');
    const lower = name.toLowerCase();

    if (name.startsWith('/') || name.includes('../')) {
      throw new FileSecurityError('Security Alert: Unsafe path traversal entry inside document archive blocked.');
    }

    // Block VBA Macros, ActiveX controls, and embedded executables/scripts inside Office docs
    if (
      lower.includes('vbaproject.bin') ||
      lower.includes('vbadata.xml') ||
      lower.includes('activex/') ||
      /\.(?:exe|dll|bat|cmd|vbs|vbe|js|jse|ps1|sh|scr|hta|msi|com|pif|jar|apk|wasm)$/.test(lower)
    ) {
      throw new FileSecurityError(
        'Security Alert: Macro-enabled or executable payload detected inside Office document and blocked.'
      );
    }

    if (lower === 'word/document.xml') hasWordXml = true;
    if (lower === 'xl/workbook.xml') hasExcelXml = true;
    if (lower === 'content.xml' || lower === 'mimetype') isOdf = true;
  }

  return { hasWordXml, hasExcelXml, isOdf };
}

const yieldToMain = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

function cleanTerm(str: string): string {
  return sanitizeExtractedText(str)
    .replace(/^[\s\t"'\`\-=:;,|\\\/\[\](){}.?!،؛؟]+/, '')
    .replace(/[\s\t"'\`\-=:;,|\\\/\[\](){}.?!،؛؟]+$/, '')
    .trim();
}

function stripLeadingListMarker(line: string): string {
  // Strip patterns like "1. word" or "12) word" or "• word" only when followed by non-digit content
  return line
    .replace(/^\s*(?:\d{1,6}[\.\)\]]\s+|[\u2022\u25CF\u25AA\u25AB\u2023\-–—\*]\s+)(?=\S)/, '')
    .trim();
}

/**
 * Universal single-line parser supporting Tab, Arrows, Delimiters, CSV/TSV, Double-Space, and Cross-Script boundaries
 */
export function parseUniversalLine(line: string): ParsedWordEntry | null {
  let trimmed = sanitizeExtractedText(line).trim();
  if (!trimmed) return null;

  // Ignore Anki export metadata headers
  if (/^#(separator|html|columns|deck|notetype|tags column):/i.test(trimmed)) {
    return null;
  }

  trimmed = stripLeadingListMarker(trimmed);
  if (!trimmed) return null;

  // 1. Separated by TAB (\t)
  if (trimmed.includes('\t')) {
    const parts = trimmed.split('\t').map((p) => cleanTerm(p)).filter(Boolean);
    if (parts.length >= 2) {
      return { sourceText: parts[0], targetText: parts.slice(1).join(' ') };
    }
    if (parts.length === 1) {
      return { sourceText: parts[0], targetText: '' };
    }
    return null;
  }

  // 2. Explicit arrows (➔, →, ⇒, =>, ->)
  const arrowMatch = trimmed.match(/^(.+?)\s*(?:➔|→|⇒|=>|->)\s*(.+)$/);
  if (arrowMatch) {
    const p1 = cleanTerm(arrowMatch[1]);
    const p2 = cleanTerm(arrowMatch[2]);
    if (p1) return { sourceText: p1, targetText: p2 };
  }

  // 3. Separated by spaced dash ( - , – , — )
  const dashMatch = trimmed.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (dashMatch) {
    const p1 = cleanTerm(dashMatch[1]);
    const p2 = cleanTerm(dashMatch[2]);
    if (p1) return { sourceText: p1, targetText: p2 };
  }

  // 4. Pipe, Equal, Colon, Semicolon (skip splitting timestamps like 0:07 or URLs like https://)
  const delimMatch = trimmed.match(/^(.+?)\s*([|=:：;؛])\s*(.+)$/);
  if (delimMatch) {
    const rawLeft = delimMatch[1];
    const delim = delimMatch[2];
    const rawRight = delimMatch[3];
    const isTimestampOrUrlColon =
      delim === ':' &&
      ((/\d$/.test(rawLeft) && /^\d/.test(rawRight)) ||
        (/^https?$/i.test(rawLeft) && rawRight.startsWith('//')));
    if (!isTimestampOrUrlColon) {
      const p1 = cleanTerm(rawLeft);
      const p2 = cleanTerm(rawRight);
      if (p1) return { sourceText: p1, targetText: p2 };
    }
  }

  // 5. Comma separator (prefer first comma if two-part list)
  const commaMatch = trimmed.match(/^([^,،]+)[,،]\s*(.+)$/);
  if (commaMatch) {
    const p1 = cleanTerm(commaMatch[1]);
    const p2 = cleanTerm(commaMatch[2]);
    if (p1) return { sourceText: p1, targetText: p2 };
  }

  // 6. Multiple spaces (2+ spaces)
  const spaceCols = trimmed.split(/\s{2,}/);
  if (spaceCols.length >= 2) {
    const p1 = cleanTerm(spaceCols[0]);
    const p2 = cleanTerm(spaceCols.slice(1).join(' '));
    if (p1) return { sourceText: p1, targetText: p2 };
  }

  // 7. Script transition: Latin phrase followed by Non-Latin translation
  const scriptMatch = trimmed.match(
    /^([a-zA-Z0-9\u00C0-\u024F\s'-]+?)\s+([\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0900-\u097F\u0E00-\u0E7F\u0370-\u03FF].+)$/
  );
  if (scriptMatch) {
    const p1 = cleanTerm(scriptMatch[1]);
    const p2 = cleanTerm(scriptMatch[2]);
    if (p1 && p2) return { sourceText: p1, targetText: p2 };
  }

  // 8. Reverse script transition: Non-Latin phrase followed by Latin translation
  const reverseMatch = trimmed.match(
    /^([\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0900-\u097F\u0E00-\u0E7F\u0370-\u03FF\s'-]+?)\s+([a-zA-Z0-9\u00C0-\u024F].+)$/
  );
  if (reverseMatch) {
    const p1 = cleanTerm(reverseMatch[1]);
    const p2 = cleanTerm(reverseMatch[2]);
    if (p1 && p2) return { sourceText: p1, targetText: p2 };
  }

  // Single word/phrase fallback
  const single = cleanTerm(trimmed);
  return single ? { sourceText: single, targetText: '' } : null;
}

function isLikelyHeaderRow(col1: string, col2: string): boolean {
  const a = col1.toLowerCase().trim();
  const b = col2.toLowerCase().trim();
  const srcHeaders = new Set([
    'word', 'words', 'term', 'terms', 'source', 'original', 'english', 'vocab', 'vocabulary',
    'front', 'phrase', 'text', 'الكلمة', 'الكلمه', 'النص', 'المصطلح', 'الأصل', 'الاصل', 'انجليزي', 'إنجليزي',
  ]);
  const tgtHeaders = new Set([
    'translation', 'translations', 'meaning', 'meanings', 'target', 'translated', 'arabic',
    'definition', 'back', 'الترجمة', 'الترجمه', 'المعنى', 'عربي', 'العربية', 'الشرح',
  ]);
  return srcHeaders.has(a) && (tgtHeaders.has(b) || b === '');
}

/**
 * Score decoded text quality across world scripts so legacy encodings (Windows-1256 Arabic, 1251 Cyrillic, Shift_JIS, etc.) decode accurately
 */
function scoreDecodedSample(text: string, encoding: string, preferredLangs: string[] = []): number {
  let score = 0;
  let replacementCount = 0;
  let controlCount = 0;
  let arabicCount = 0;
  let cyrillicCount = 0;
  let latinExtendedCount = 0;
  let asciiLetterCount = 0;
  let cjkCount = 0;
  let hebrewCount = 0;
  let greekCount = 0;
  let thaiCount = 0;
  let weirdSymbolCount = 0;

  const len = Math.min(text.length, 8000);
  for (let i = 0; i < len; i++) {
    const code = text.charCodeAt(i);
    if (code === 0xfffd) {
      replacementCount++;
    } else if ((code >= 0x00 && code < 0x09) || (code >= 0x0e && code < 0x20) || (code >= 0x7f && code <= 0x9f)) {
      controlCount++;
    } else if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
      asciiLetterCount++;
    } else if (code >= 0x0621 && code <= 0x064a) {
      arabicCount++;
    } else if (code >= 0x0600 && code <= 0x06ff) {
      arabicCount += 0.6;
    } else if (code >= 0x0400 && code <= 0x04ff) {
      cyrillicCount++;
    } else if (code >= 0x00c0 && code <= 0x017f) {
      latinExtendedCount++;
    } else if (code >= 0x0590 && code <= 0x05ff) {
      hebrewCount++;
    } else if (code >= 0x0370 && code <= 0x03ff) {
      greekCount++;
    } else if (code >= 0x0e00 && code <= 0x0e7f) {
      thaiCount++;
    } else if (
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3040 && code <= 0x30ff) ||
      (code >= 0xac00 && code <= 0xd7af)
    ) {
      cjkCount++;
    } else if (code >= 0x2500 && code <= 0x259f) {
      weirdSymbolCount++;
    }
  }

  score -= replacementCount * 25;
  score -= controlCount * 15;
  score -= weirdSymbolCount * 8;
  score += asciiLetterCount * 1;
  score += arabicCount * 3.5;
  score += cyrillicCount * 3.2;
  score += hebrewCount * 3.2;
  score += greekCount * 3.2;
  score += thaiCount * 3.2;
  score += cjkCount * 3.0;

  const prevCharAccentedRatio = len > 0 ? latinExtendedCount / len : 0;
  if (encoding === 'windows-1252' || encoding === 'iso-8859-1') {
    score += prevCharAccentedRatio > 0.28 ? -latinExtendedCount * 2 : latinExtendedCount * 1.4;
  } else {
    score += latinExtendedCount * 1.8;
  }

  const pref = preferredLangs.join(',').toLowerCase();
  if ((pref.includes('ar') || pref.includes('fa') || pref.includes('ur')) && encoding === 'windows-1256') {
    score += 40;
  }
  if ((pref.includes('ru') || pref.includes('uk') || pref.includes('bg')) && encoding === 'windows-1251') {
    score += 40;
  }
  if (pref.includes('tr') && encoding === 'windows-1254') score += 40;
  if (pref.includes('el') && encoding === 'windows-1253') score += 40;
  if (pref.includes('he') && encoding === 'windows-1255') score += 40;
  if (pref.includes('th') && encoding === 'windows-874') score += 40;
  if (pref.includes('ja') && (encoding === 'shift_jis' || encoding === 'euc-jp')) score += 40;
  if (pref.includes('ko') && encoding === 'euc-kr') score += 40;
  if (pref.includes('zh') && (encoding === 'gb18030' || encoding === 'big5')) score += 40;

  return score;
}

/**
 * Multi-encoding smart binary-to-text decoder supporting UTF-8, UTF-16LE/BE, Windows-1256 (Arabic), CJK, Cyrillic, European, etc.
 */
export function decodeBytesSmart(
  bytes: Uint8Array,
  options?: { manualEncoding?: string; preferredLangs?: string[] }
): { text: string; encoding: string } {
  if (bytes.length === 0) return { text: '', encoding: 'UTF-8' };

  const manual = options?.manualEncoding;
  if (manual && manual !== 'auto') {
    try {
      const dec = new TextDecoder(manual, { fatal: false });
      return {
        text: dec.decode(bytes).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'),
        encoding: manual.toUpperCase(),
      };
    } catch {
      // Fallback to auto
    }
  }

  // 1. BOM Detection
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    const text = new TextDecoder('utf-8').decode(bytes.subarray(3));
    return { text: text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'), encoding: 'UTF-8 (BOM)' };
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    const text = new TextDecoder('utf-16le').decode(bytes.subarray(2));
    return { text: text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'), encoding: 'UTF-16LE' };
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    const text = new TextDecoder('utf-16be').decode(bytes.subarray(2));
    return { text: text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'), encoding: 'UTF-16BE' };
  }

  // 2. BOM-less UTF-16 heuristic on first 2KB
  const checkLen = Math.min(bytes.length, 2048);
  if (checkLen >= 8) {
    let evenNulls = 0;
    let oddNulls = 0;
    for (let i = 0; i < checkLen; i++) {
      if (bytes[i] === 0) {
        if (i % 2 === 0) evenNulls++;
        else oddNulls++;
      }
    }
    const half = checkLen / 2;
    if (oddNulls / half > 0.25 && evenNulls / half < 0.05) {
      const text = new TextDecoder('utf-16le').decode(bytes);
      return { text: text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'), encoding: 'UTF-16LE' };
    }
    if (evenNulls / half > 0.25 && oddNulls / half < 0.05) {
      const text = new TextDecoder('utf-16be').decode(bytes);
      return { text: text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'), encoding: 'UTF-16BE' };
    }
  }

  // 3. Strict UTF-8 validation
  try {
    const utf8Text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return {
      text: utf8Text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'),
      encoding: 'UTF-8',
    };
  } catch {
    // Non-UTF-8 file: proceed to codepage scoring
  }

  // 4. Score candidate legacy encodings on a 16KB sample
  const sampleBytes = bytes.subarray(0, Math.min(bytes.length, 16384));
  const candidates = [
    'windows-1256',
    'iso-8859-6',
    'windows-1252',
    'windows-1251',
    'windows-1254',
    'windows-1250',
    'windows-1253',
    'windows-1255',
    'windows-874',
    'shift_jis',
    'euc-jp',
    'euc-kr',
    'gb18030',
    'big5',
  ];

  let bestEncoding = 'windows-1256';
  let bestScore = -Infinity;

  for (const enc of candidates) {
    try {
      const sampleText = new TextDecoder(enc, { fatal: false }).decode(sampleBytes);
      const sc = scoreDecodedSample(sampleText, enc, options?.preferredLangs);
      if (sc > bestScore) {
        bestScore = sc;
        bestEncoding = enc;
      }
    } catch {
      // Encoding unsupported in this browser runtime; skip
    }
  }

  try {
    const decoded = new TextDecoder(bestEncoding, { fatal: false }).decode(bytes);
    return {
      text: decoded.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'),
      encoding: bestEncoding.toUpperCase(),
    };
  } catch {
    const fallback = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return {
      text: fallback.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC'),
      encoding: 'UTF-8 (Fallback)',
    };
  }
}

/**
 * Parse lines asynchronously in chunks of 800 lines so 9,000+ words never freeze Mobile/Tablet UI
 */
async function parseLinesAsync(
  lines: string[],
  onProgress?: (percent: number, stage: string) => void,
  startPct = 40,
  endPct = 95
): Promise<{ items: ParsedWordEntry[]; skippedLines: number; sampleLines: string[] }> {
  const items: ParsedWordEntry[] = [];
  const sampleLines: string[] = [];
  let skippedLines = 0;
  const CHUNK = 800;
  const total = lines.length;

  for (let i = 0; i < total; i += CHUNK) {
    if (items.length >= MAX_WORDS_LIMIT) break;
    const end = Math.min(total, i + CHUNK);
    for (let j = i; j < end; j++) {
      if (items.length >= MAX_WORDS_LIMIT) break;
      const raw = lines[j];
      if (!raw || !raw.trim()) continue;
      const parsed = parseUniversalLine(raw);
      if (parsed && parsed.sourceText) {
        if (items.length === 0 && isLikelyHeaderRow(parsed.sourceText, parsed.targetText)) {
          skippedLines++;
          continue;
        }
        items.push(parsed);
        if (sampleLines.length < 300) {
          sampleLines.push(parsed.targetText ? `${parsed.sourceText}\t${parsed.targetText}` : parsed.sourceText);
        }
      } else {
        skippedLines++;
      }
    }

    if (onProgress && total > 0) {
      const pct = Math.round(startPct + ((end / total) * (endPct - startPct)));
      onProgress(pct, `Parsing words (${end.toLocaleString()} / ${total.toLocaleString()})...`);
    }
    await yieldToMain();
  }

  return { items, skippedLines, sampleLines };
}

/**
 * RFC-4180 aware CSV / TSV parser supporting quoted multi-line cells, BOM, Excel sep=, directive & all delimiters
 */
async function parseCsvOrTsvAsync(
  text: string,
  preferredDelimiter?: string,
  onProgress?: (percent: number, stage: string) => void
): Promise<{ items: ParsedWordEntry[]; skippedLines: number; sampleLines: string[] }> {
  let body = text;
  let delimiter = preferredDelimiter;

  const firstNewline = body.indexOf('\n');
  const firstLine = (firstNewline === -1 ? body : body.slice(0, firstNewline)).trim();
  const sepDirective = firstLine.match(/^sep=(.)$/i);
  if (sepDirective) {
    delimiter = sepDirective[1];
    body = firstNewline === -1 ? '' : body.slice(firstNewline + 1);
  }

  if (!delimiter) {
    const sampleLines = body.split('\n').slice(0, 25).filter((l) => l.trim());
    const counts = { '\t': 0, ';': 0, ',': 0, '|': 0 };
    for (const l of sampleLines) {
      for (const ch of Object.keys(counts) as Array<keyof typeof counts>) {
        counts[ch] += l.split(ch).length - 1;
      }
    }
    const sorted = (Object.entries(counts) as Array<[string, number]>).sort((a, b) => b[1] - a[1]);
    delimiter = sorted[0] && sorted[0][1] > 0 ? sorted[0][0] : ',';
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (inQuotes) {
      if (ch === '"') {
        if (body[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }

    if (i > 0 && i % 60000 === 0) {
      if (onProgress) onProgress(Math.min(60, Math.round(25 + (i / body.length) * 35)), 'Reading spreadsheet rows...');
      await yieldToMain();
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const items: ParsedWordEntry[] = [];
  const sampleLines: string[] = [];
  let skippedLines = 0;
  const CHUNK = 800;

  for (let i = 0; i < rows.length; i += CHUNK) {
    if (items.length >= MAX_WORDS_LIMIT) break;
    const end = Math.min(rows.length, i + CHUNK);
    for (let r = i; r < end; r++) {
      if (items.length >= MAX_WORDS_LIMIT) break;
      const cells = rows[r].map((c) => cleanTerm(c.replace(/\n+/g, ' '))).filter(Boolean);
      if (cells.length === 0) continue;

      if (cells.length >= 2) {
        if (items.length === 0 && isLikelyHeaderRow(cells[0], cells[1])) {
          skippedLines++;
          continue;
        }
        items.push({ sourceText: cells[0], targetText: cells.slice(1).join(' ') });
        if (sampleLines.length < 300) sampleLines.push(`${cells[0]}\t${cells.slice(1).join(' ')}`);
      } else {
        const parsed = parseUniversalLine(cells[0]);
        if (parsed && parsed.sourceText) {
          items.push(parsed);
          if (sampleLines.length < 300) {
            sampleLines.push(parsed.targetText ? `${parsed.sourceText}\t${parsed.targetText}` : parsed.sourceText);
          }
        } else {
          skippedLines++;
        }
      }
    }
    if (onProgress && rows.length > 0) {
      onProgress(Math.round(60 + (end / rows.length) * 35), `Preparing ${end.toLocaleString()} / ${rows.length.toLocaleString()} rows...`);
    }
    await yieldToMain();
  }

  return { items, skippedLines, sampleLines };
}

/**
 * Safely extract plain text rows from internal HTML (ONLY used for internal Mammoth/XLS table parsing; never accepts raw .html uploads)
 */
function extractSafeLinesFromInternalHtml(html: string): string[] {
  assertNoMaliciousTextPayload(html, false);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, noscript, svg, iframe, object, embed').forEach((el) => el.remove());
  const lines: string[] = [];

  doc.querySelectorAll('tr').forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll('td, th'))
      .map((td) => sanitizeExtractedText(td.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    if (cells.length >= 2) {
      lines.push(`${cells[0]}\t${cells.slice(1).join(' ')}`);
    } else if (cells.length === 1) {
      lines.push(cells[0]);
    }
    tr.remove();
  });

  doc.querySelectorAll('dl').forEach((dl) => {
    const dts = Array.from(dl.querySelectorAll('dt'));
    const dds = Array.from(dl.querySelectorAll('dd'));
    for (let i = 0; i < dts.length; i++) {
      const k = sanitizeExtractedText(dts[i]?.textContent || '').trim();
      const v = sanitizeExtractedText(dds[i]?.textContent || '').trim();
      if (k) lines.push(v ? `${k}\t${v}` : k);
    }
    dl.remove();
  });

  const blockText = sanitizeExtractedText(doc.body?.innerText || doc.body?.textContent || '').trim();
  if (blockText) {
    blockText.split('\n').forEach((l) => {
      const t = l.trim();
      if (t) lines.push(t);
    });
  }

  return lines;
}

/**
 * Parse safe Excel spreadsheets (.xlsx, .xls, .ods)
 */
async function parseSpreadsheetBytes(
  bytes: Uint8Array,
  ext: string,
  options: ImportParseOptions
): Promise<{ lines: string[]; formatLabel: string; encoding: string }> {
  options.onProgress?.(20, 'Loading Excel engine...');
  const XLSX = await import('xlsx');

  const headAscii = new TextDecoder('ascii', { fatal: false }).decode(bytes.subarray(0, 512)).toLowerCase();
  if (headAscii.includes('<html') || headAscii.includes('<table') || headAscii.includes('<?xml')) {
    const { text, encoding } = decodeBytesSmart(bytes, {
      manualEncoding: options.manualEncoding,
      preferredLangs: options.preferredLangs,
    });
    assertNoMaliciousTextPayload(text, headAscii.includes('<?xml'));
    if (headAscii.includes('<html') || headAscii.includes('<table')) {
      return { lines: extractSafeLinesFromInternalHtml(text), formatLabel: `Excel Table (.${ext || 'xls'})`, encoding };
    }
  }

  options.onProgress?.(35, 'Reading Excel workbook...');
  const workbook = XLSX.read(bytes, { type: 'array', raw: false, cellFormula: false, cellHTML: false });
  const lines: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
    const CHUNK = 1000;
    for (let i = 0; i < rows.length; i += CHUNK) {
      if (lines.length >= MAX_WORDS_LIMIT * 2) break;
      const end = Math.min(rows.length, i + CHUNK);
      for (let r = i; r < end; r++) {
        const rawRow = rows[r];
        if (!Array.isArray(rawRow)) continue;
        const cells = rawRow
          .map((val) => (val === null || val === undefined ? '' : sanitizeExtractedText(String(val)).replace(/[\r\n]+/g, ' ').trim()))
          .filter(Boolean);
        if (cells.length === 0) continue;
        if (cells.length >= 2) {
          lines.push(`${cells[0]}\t${cells.slice(1).join(' ')}`);
        } else {
          lines.push(cells[0]);
        }
      }
      options.onProgress?.(35 + Math.round((end / Math.max(1, rows.length)) * 20), `Reading sheet "${sheetName}"...`);
      await yieldToMain();
    }
  }

  return {
    lines,
    formatLabel: ext === 'ods' ? 'OpenDocument Spreadsheet (.ods)' : `Excel (.${ext || 'xlsx'})`,
    encoding: 'Workbook Unicode',
  };
}

/**
 * Parse Word .docx / .odt safely via ZIP XML with Zip-bomb, Macro & XXE checks
 */
async function parseDocxOrOdtBytes(
  bytes: Uint8Array,
  ext: string,
  options: ImportParseOptions,
  preloadedZip?: JSZip
): Promise<{ lines: string[]; formatLabel: string; encoding: string }> {
  options.onProgress?.(25, 'Extracting Word document safely...');
  const zip = preloadedZip || (await JSZip.loadAsync(bytes));
  inspectSafeOfficeZip(zip);

  const wordXmlFile = zip.file('word/document.xml');
  if (wordXmlFile) {
    const xmlStr = await wordXmlFile.async('string');
    if (xmlStr.length > MAX_DECOMPRESSED_XML_BYTES) {
      throw new FileSecurityError('Security Alert: Decompressed Word XML exceeds safe limits (Zip-bomb protection).');
    }
    assertNoMaliciousTextPayload(xmlStr, true);

    const doc = new DOMParser().parseFromString(xmlStr, 'application/xml');
    const lines: string[] = [];

    const extractParagraphText = (pNode: Element): string => {
      let out = '';
      const walker = doc.createTreeWalker(pNode, NodeFilter.SHOW_ELEMENT);
      let node = walker.nextNode() as Element | null;
      while (node) {
        const ln = node.localName;
        if (ln === 't' || ln === 'delText') {
          out += node.textContent || '';
        } else if (ln === 'tab') {
          out += '\t';
        } else if (ln === 'br' || ln === 'cr') {
          out += '\n';
        }
        node = walker.nextNode() as Element | null;
      }
      return sanitizeExtractedText(out).trim();
    };

    const body = doc.getElementsByTagNameNS('*', 'body')[0] || doc.documentElement;
    const children = Array.from(body.children);

    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      if (el.localName === 'tbl') {
        const rows = Array.from(el.getElementsByTagNameNS('*', 'tr'));
        for (const tr of rows) {
          const cells = Array.from(tr.getElementsByTagNameNS('*', 'tc')).map((tc) => {
            const ps = Array.from(tc.getElementsByTagNameNS('*', 'p')).map(extractParagraphText).filter(Boolean);
            return ps.join(' ').replace(/\s+/g, ' ').trim();
          }).filter(Boolean);
          if (cells.length >= 2) {
            lines.push(`${cells[0]}\t${cells.slice(1).join(' ')}`);
          } else if (cells.length === 1) {
            lines.push(...cells[0].split('\n'));
          }
        }
      } else if (el.localName === 'p') {
        const pText = extractParagraphText(el);
        if (pText) lines.push(...pText.split('\n'));
      } else {
        const nestedPs = Array.from(el.getElementsByTagNameNS('*', 'p'));
        for (const p of nestedPs) {
          const pText = extractParagraphText(p);
          if (pText) lines.push(...pText.split('\n'));
        }
      }
      if (i > 0 && i % 500 === 0) await yieldToMain();
    }

    if (lines.length > 0) {
      return { lines, formatLabel: `Word (.${ext || 'docx'})`, encoding: 'DOCX XML UTF-8' };
    }

    try {
      const mammothModule: any = await import('mammoth/mammoth.browser.min.js');
      const mammoth = mammothModule?.default || mammothModule;
      if (mammoth?.convertToHtml) {
        const res = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) });
        if (res?.value) {
          return {
            lines: extractSafeLinesFromInternalHtml(res.value),
            formatLabel: `Word (.${ext || 'docx'})`,
            encoding: 'DOCX UTF-8',
          };
        }
      }
    } catch {
      // Ignore fallback error
    }
  }

  // OpenDocument Text (.odt)
  const odtXmlFile = zip.file('content.xml');
  if (odtXmlFile) {
    const xmlStr = await odtXmlFile.async('string');
    if (xmlStr.length > MAX_DECOMPRESSED_XML_BYTES) {
      throw new FileSecurityError('Security Alert: Decompressed ODT XML exceeds safe limits.');
    }
    assertNoMaliciousTextPayload(xmlStr, true);
    const doc = new DOMParser().parseFromString(xmlStr, 'application/xml');
    const lines: string[] = [];
    const rows = Array.from(doc.getElementsByTagNameNS('*', 'table-row'));
    for (const tr of rows) {
      const cells = Array.from(tr.getElementsByTagNameNS('*', 'table-cell'))
        .map((tc) => sanitizeExtractedText(tc.textContent || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      if (cells.length >= 2) lines.push(`${cells[0]}\t${cells.slice(1).join(' ')}`);
    }
    const ps = Array.from(doc.getElementsByTagNameNS('*', 'p'));
    for (const p of ps) {
      if (p.closest && p.closest('table-cell')) continue;
      const t = sanitizeExtractedText(p.textContent || '').trim();
      if (t) lines.push(t);
    }
    return { lines, formatLabel: 'OpenDocument Text (.odt)', encoding: 'ODT UTF-8' };
  }

  return { lines: [], formatLabel: `Word (.${ext || 'docx'})`, encoding: 'UTF-8' };
}

/**
 * Parse RTF documents safely (supports \ansicpg Arabic 1256 / European 1252 / Cyrillic 1251, \uN Unicode, \'hh hex, and tables)
 */
function parseRtfBytes(bytes: Uint8Array): { lines: string[]; formatLabel: string; encoding: string } {
  const raw = new TextDecoder('latin1').decode(bytes);
  // Block suspicious RTF object/DDE exploits (\objdata, \objupdate, DDEAUTO)
  if (/\\(?:objdata|objupdate|objautlink)\b/i.test(raw) || /\bddeauto\b/i.test(raw)) {
    throw new FileSecurityError('Security Alert: Embedded OLE object / DDE exploit inside RTF blocked.');
  }

  const cpgMatch = raw.match(/\\ansicpg(\d+)/);
  const cpgNum = cpgMatch ? Number(cpgMatch[1]) : 1252;
  const cpgMap: Record<number, string> = {
    1256: 'windows-1256',
    1252: 'windows-1252',
    1251: 'windows-1251',
    1254: 'windows-1254',
    1250: 'windows-1250',
    1253: 'windows-1253',
    1255: 'windows-1255',
    874: 'windows-874',
    932: 'shift_jis',
    936: 'gb18030',
    949: 'euc-kr',
    950: 'big5',
  };
  const codepage = cpgMap[cpgNum] || 'windows-1252';
  const decoder = new TextDecoder(codepage, { fatal: false });

  const skipDestinations = new Set([
    'fonttbl', 'colortbl', 'stylesheet', 'info', 'pict', 'object', 'fldinst',
    'header', 'footer', 'headerl', 'headerr', 'headerf', 'footerl', 'footerr', 'footerf',
    'listtable', 'listoverridetable', 'revtbl', 'rsidtbl', 'generator', 'xmlnstbl',
  ]);

  let out = '';
  const stack: Array<{ uc: number; skip: boolean }> = [{ uc: 1, skip: false }];
  let hexBuffer: number[] = [];

  const flushHex = () => {
    if (hexBuffer.length > 0) {
      out += decoder.decode(new Uint8Array(hexBuffer));
      hexBuffer = [];
    }
  };

  let i = 0;
  while (i < raw.length) {
    const ch = raw[i];
    const top = stack[stack.length - 1] || { uc: 1, skip: false };

    if (ch === '{') {
      flushHex();
      stack.push({ uc: top.uc, skip: top.skip });
      i++;
    } else if (ch === '}') {
      flushHex();
      if (stack.length > 1) stack.pop();
      i++;
    } else if (ch === '\\') {
      i++;
      if (i >= raw.length) break;
      const next = raw[i];
      if (next === '\\' || next === '{' || next === '}') {
        flushHex();
        if (!top.skip) out += next;
        i++;
      } else if (next === "'") {
        const hex = raw.slice(i + 1, i + 3);
        if (/^[0-9a-fA-F]{2}$/.test(hex) && !top.skip) {
          hexBuffer.push(parseInt(hex, 16));
        }
        i += 3;
      } else if (next === '\r' || next === '\n') {
        flushHex();
        if (!top.skip) out += '\n';
        i++;
      } else if (next === '*') {
        flushHex();
        top.skip = true;
        i++;
      } else if (next === '~') {
        flushHex();
        if (!top.skip) out += ' ';
        i++;
      } else {
        flushHex();
        const m = raw.slice(i).match(/^([a-zA-Z]+)(-?\d+)? ?/);
        if (m) {
          const word = m[1];
          const param = m[2] !== undefined ? Number(m[2]) : undefined;
          i += m[0].length;

          if (skipDestinations.has(word)) {
            top.skip = true;
          } else if (word === 'uc' && param !== undefined) {
            top.uc = param;
          } else if (word === 'u' && param !== undefined) {
            const codeUnit = param < 0 ? param + 65536 : param;
            if (!top.skip) out += String.fromCharCode(codeUnit);
            let toSkip = top.uc;
            while (toSkip > 0 && i < raw.length) {
              if (raw[i] === '\\' && raw[i + 1] === "'") {
                i += 4;
                toSkip--;
              } else if (raw[i] === '{' || raw[i] === '}') {
                break;
              } else {
                i++;
                toSkip--;
              }
            }
          } else if (!top.skip) {
            if (word === 'par' || word === 'line' || word === 'row') out += '\n';
            else if (word === 'tab' || word === 'cell') out += '\t';
          }
        } else {
          i++;
        }
      }
    } else if (ch === '\r' || ch === '\n') {
      i++;
    } else {
      flushHex();
      if (!top.skip) out += ch;
      i++;
    }
  }
  flushHex();

  return {
    lines: out.split('\n').map((l) => sanitizeExtractedText(l).trim()).filter(Boolean),
    formatLabel: 'Rich Text Document (.rtf)',
    encoding: `RTF (${codepage.toUpperCase()})`,
  };
}

/**
 * Extract readable lines from legacy binary Word 97-2003 (.doc) with Macro/Script Checks
 */
async function parseLegacyDocBytes(
  bytes: Uint8Array,
  options: ImportParseOptions
): Promise<{ lines: string[]; formatLabel: string; encoding: string }> {
  const headText = new TextDecoder('latin1', { fatal: false }).decode(bytes.subarray(0, 1024));
  const headLower = headText.toLowerCase();

  if (headText.trimStart().startsWith('{\\rtf')) {
    return parseRtfBytes(bytes);
  }
  if (headLower.includes('<html') || headLower.includes('<!doctype html') || headLower.includes('<table')) {
    const { text, encoding } = decodeBytesSmart(bytes, options);
    assertNoMaliciousTextPayload(text, false);
    return { lines: extractSafeLinesFromInternalHtml(text), formatLabel: 'Word Table (.doc)', encoding };
  }
  if (headLower.includes('<?xml') || headLower.includes('<w:worddocument')) {
    const { text, encoding } = decodeBytesSmart(bytes, options);
    assertNoMaliciousTextPayload(text, true);
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    const lines = Array.from(doc.getElementsByTagName('*'))
      .filter((el) => el.localName === 'p')
      .map((p) => sanitizeExtractedText(p.textContent || '').trim())
      .filter(Boolean);
    return { lines, formatLabel: 'Word XML (.doc)', encoding };
  }

  options.onProgress?.(30, 'Extracting legacy Word (.doc) stream...');
  const XLSX = await import('xlsx');
  let streamBytes: Uint8Array = bytes;

  try {
    const cfb = XLSX.CFB.read(bytes, { type: 'array' });
    // Block OLE2 Word files with VBA Macro storage
    if (XLSX.CFB.find(cfb, '/Macros') || XLSX.CFB.find(cfb, '/_VBA_PROJECT_CUR')) {
      throw new FileSecurityError('Security Alert: Legacy Word (.doc) file contains VBA macros and was blocked.');
    }
    const entry = XLSX.CFB.find(cfb, '/WordDocument');
    if (entry && entry.content) {
      streamBytes = new Uint8Array(entry.content);
    }
  } catch (err) {
    if (err instanceof FileSecurityError) throw err;
  }

  const unicodeRuns: string[] = [];
  let current = '';
  for (let offset = 0; offset + 1 < streamBytes.length; offset += 2) {
    const code = streamBytes[offset] | (streamBytes[offset + 1] << 8);
    const isLineBreak = code === 0x000d || code === 0x000a || code === 0x000b || code === 0x0007;
    const isTab = code === 0x0009;
    const isReadable =
      code === 0x0020 ||
      (code >= 0x0021 && code <= 0x007e) ||
      (code >= 0x00a0 && code <= 0x024f) ||
      (code >= 0x0370 && code <= 0x06ff) ||
      (code >= 0x0750 && code <= 0x097f) ||
      (code >= 0x0e00 && code <= 0x0e7f) ||
      (code >= 0x3040 && code <= 0x9fff) ||
      (code >= 0xac00 && code <= 0xd7af);

    if (isLineBreak) {
      if (current.trim().length >= 2) unicodeRuns.push(sanitizeExtractedText(current).trim());
      current = '';
    } else if (isTab) {
      current += '\t';
    } else if (isReadable) {
      current += String.fromCharCode(code);
    } else {
      if (current.trim().length >= 3) unicodeRuns.push(sanitizeExtractedText(current).trim());
      current = '';
    }
  }
  if (current.trim().length >= 2) unicodeRuns.push(sanitizeExtractedText(current).trim());

  const noiseRegex = /^(?:Normal|Default Paragraph Font|Table Normal|Times New Roman|Calibri|Arial|Tahoma|Microsoft Word|Root Entry|WordDocument|SummaryInformation)$/i;
  const cleanedUnicode = unicodeRuns.filter((l) => !noiseRegex.test(l) && /[a-zA-Z\u0600-\u06FF\u0400-\u04FF\u4E00-\u9FFF]/.test(l));

  if (cleanedUnicode.length >= 2) {
    return {
      lines: cleanedUnicode,
      formatLabel: 'Word 97-2003 (.doc)',
      encoding: 'DOC UTF-16LE',
    };
  }

  const { text, encoding } = decodeBytesSmart(streamBytes, options);
  const ansiLines = text
    .split(/[\r\n\x07]+/)
    .map((l) => sanitizeExtractedText(l).trim())
    .filter((l) => l.length >= 2 && !noiseRegex.test(l) && /[a-zA-Z\u0600-\u06FF\u0400-\u04FF]/.test(l));

  return {
    lines: ansiLines,
    formatLabel: 'Word 97-2003 (.doc)',
    encoding: `DOC (${encoding})`,
  };
}

/**
 * Parse PDF documents safely with action/launch/script scanning
 */
async function parsePdfBytes(
  bytes: Uint8Array,
  options: ImportParseOptions
): Promise<{ lines: string[]; formatLabel: string; encoding: string }> {
  // Block PDFs containing dangerous /Launch or /JavaScript catalog actions
  const rawAsciiSample = new TextDecoder('latin1', { fatal: false }).decode(
    bytes.subarray(0, Math.min(bytes.length, 512 * 1024))
  );
  if (/\/S\s*\/Launch\b/i.test(rawAsciiSample) || /\/S\s*\/JavaScript\b/i.test(rawAsciiSample)) {
    throw new FileSecurityError('Security Alert: PDF contains active /Launch or /JavaScript action and was blocked.');
  }

  options.onProgress?.(15, 'Loading PDF engine...');
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const loadingTask = pdfjs.getDocument({ data: bytes });
  const pdfDoc = await loadingTask.promise;
  const totalPages = Math.min(pdfDoc.numPages, 500);
  const lines: string[] = [];

  for (let p = 1; p <= totalPages; p++) {
    options.onProgress?.(
      15 + Math.round((p / Math.max(1, totalPages)) * 45),
      `Reading PDF page ${p} / ${totalPages}...`
    );
    const page = await pdfDoc.getPage(p);
    const textContent = await page.getTextContent();

    interface PdfSpan {
      str: string;
      x: number;
      y: number;
      w: number;
    }

    const spans: PdfSpan[] = [];
    for (const item of textContent.items as any[]) {
      if (!item || typeof item.str !== 'string' || !item.str.trim()) continue;
      const transform = item.transform || [1, 0, 0, 1, 0, 0];
      spans.push({
        str: sanitizeExtractedText(item.str),
        x: transform[4] || 0,
        y: transform[5] || 0,
        w: item.width || 0,
      });
    }

    spans.sort((a, b) => b.y - a.y || a.x - b.x);
    const rowBuckets: PdfSpan[][] = [];

    for (const sp of spans) {
      const lastRow = rowBuckets[rowBuckets.length - 1];
      if (lastRow && Math.abs(lastRow[0].y - sp.y) <= 4.5) {
        lastRow.push(sp);
      } else {
        rowBuckets.push([sp]);
      }
    }

    for (const bucket of rowBuckets) {
      bucket.sort((a, b) => a.x - b.x);
      let lineStr = '';
      for (let k = 0; k < bucket.length; k++) {
        const cur = bucket[k];
        if (k > 0) {
          const prev = bucket[k - 1];
          const gap = cur.x - (prev.x + prev.w);
          lineStr += gap > 14 ? '\t' : gap > 2 ? ' ' : '';
        }
        lineStr += cur.str;
      }
      const cleaned = sanitizeExtractedText(lineStr).trim();
      if (cleaned) lines.push(cleaned);
    }

    await yieldToMain();
  }

  return { lines, formatLabel: `PDF (${pdfDoc.numPages} pages)`, encoding: 'PDF Unicode' };
}

function extractLinesFromXml(xml: string): string[] {
  assertNoMaliciousTextPayload(xml, true);
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const lines: string[] = [];

  // Translation Memory (.tmx)
  const tus = Array.from(doc.getElementsByTagName('tu'));
  if (tus.length > 0) {
    for (const tu of tus) {
      const segs = Array.from(tu.getElementsByTagName('seg'))
        .map((s) => sanitizeExtractedText(s.textContent || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      if (segs.length >= 2) lines.push(`${segs[0]}\t${segs[1]}`);
      else if (segs.length === 1) lines.push(segs[0]);
    }
    return lines;
  }

  // XLIFF (.xliff / .xlf)
  const units = Array.from(doc.getElementsByTagName('trans-unit'));
  if (units.length > 0) {
    for (const u of units) {
      const src = sanitizeExtractedText(u.getElementsByTagName('source')[0]?.textContent || '').trim();
      const tgt = sanitizeExtractedText(u.getElementsByTagName('target')[0]?.textContent || '').trim();
      if (src) lines.push(tgt ? `${src}\t${tgt}` : src);
    }
    return lines;
  }

  const rawText = sanitizeExtractedText(doc.documentElement?.textContent || '').trim();
  return rawText.split('\n').map((l) => l.trim()).filter(Boolean);
}

function extractLinesFromSubtitles(text: string): string[] {
  const lines: string[] = [];
  for (const raw of text.split('\n')) {
    const t = raw.trim();
    if (!t) continue;
    if (/^WEBVTT/i.test(t) || /^NOTE\b/i.test(t) || /^\d+$/.test(t)) continue;
    if (/^\d{1,2}:\d{2}:\d{2}[.,]\d{3}\s*-->/.test(t)) continue;
    if (/^\d{1,2}:\d{2}[.,]\d{3}\s*-->/.test(t)) continue;
    const stripped = sanitizeExtractedText(t.replace(/<[^>]+>/g, '')).trim();
    if (stripped) lines.push(stripped);
  }
  return lines;
}

function extractLinesFromJson(text: string): string[] {
  const lines: string[] = [];
  try {
    const parsed = JSON.parse(text);
    const processRecord = (item: any) => {
      if (typeof item === 'string') {
        const s = sanitizeExtractedText(item).trim();
        if (s) lines.push(s);
      } else if (Array.isArray(item)) {
        const parts = item.map((v) => sanitizeExtractedText(String(v ?? '')).trim()).filter(Boolean);
        if (parts.length >= 2) lines.push(`${parts[0]}\t${parts.slice(1).join(' ')}`);
        else if (parts.length === 1) lines.push(parts[0]);
      } else if (item && typeof item === 'object') {
        const src = sanitizeExtractedText(
          String(item.source ?? item.sourceText ?? item.english ?? item.word ?? item.term ?? item.front ?? item.original ?? item.question ?? '')
        ).trim();
        const tgt = sanitizeExtractedText(
          String(item.target ?? item.targetText ?? item.arabic ?? item.translation ?? item.meaning ?? item.back ?? item.answer ?? item.definition ?? '')
        ).trim();
        if (src) {
          lines.push(tgt ? `${src}\t${tgt}` : src);
        }
      }
    };

    if (Array.isArray(parsed)) {
      parsed.forEach(processRecord);
    } else if (parsed && typeof parsed === 'object') {
      const nestedArray = parsed.words || parsed.items || parsed.vocabulary || parsed.entries || parsed.data || parsed.cards;
      if (Array.isArray(nestedArray)) {
        nestedArray.forEach(processRecord);
      } else {
        Object.entries(parsed).forEach(([k, v]) => {
          if (Object.prototype.hasOwnProperty.call(parsed, k) && k !== '__proto__' && k !== 'constructor') {
            const ks = sanitizeExtractedText(k).trim();
            if (ks && (typeof v === 'string' || typeof v === 'number')) {
              lines.push(`${ks}\t${sanitizeExtractedText(String(v)).trim()}`);
            }
          }
        });
      }
    }
  } catch {
    for (const raw of text.split('\n')) {
      const t = raw.trim();
      if (!t) continue;
      try {
        const obj = JSON.parse(t);
        if (typeof obj === 'string') {
          const s = sanitizeExtractedText(obj).trim();
          if (s) lines.push(s);
        } else if (obj && typeof obj === 'object') {
          const src = sanitizeExtractedText(String(obj.source ?? obj.sourceText ?? obj.english ?? obj.word ?? obj.term ?? '')).trim();
          const tgt = sanitizeExtractedText(String(obj.target ?? obj.targetText ?? obj.arabic ?? obj.translation ?? obj.meaning ?? '')).trim();
          if (src) lines.push(tgt ? `${src}\t${tgt}` : src);
        }
      } catch {
        const s = sanitizeExtractedText(t).trim();
        if (s) lines.push(s);
      }
    }
  }
  return lines;
}

/**
 * Main Hardened File Importer:
 * Allows ONLY Text & Safe Vocabulary Documents (TXT, CSV, TSV, JSON, MD, SRT, Word .docx/.doc/.rtf/.odt, Excel .xlsx/.xls/.ods, PDF, safe XML/TMX/XLIFF).
 * Blocks ALL image formats (even renamed) and defends against executables, VBA macros, XXE, ZIP bombs, HTML/SVG/XSS, and CSV formula injection.
 */
export async function importFileUniversal(
  file: File,
  options: ImportParseOptions = {}
): Promise<ImportedFileResult> {
  const warnings: string[] = [];

  // Security Gate 1: Metadata, MIME, Extension, Double-Extension, Size
  validateFileSecurity(file);

  options.onProgress?.(5, `Scanning & reading ${file.name}...`);
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const ext = getFileExtension(file.name);

  // Security Gate 2: Deep Magic-Byte & Binary Spoofing Inspection
  const { isZip, isPdf, isOle2, isRtf } = assertSafeBinaryPayload(bytes, ext);

  // 1. PDF
  if (ext === 'pdf' || isPdf) {
    const res = await parsePdfBytes(bytes, options);
    const parsed = await parseLinesAsync(res.lines, options.onProgress, 65, 98);
    return {
      fileName: file.name,
      fileSize: file.size,
      formatLabel: res.formatLabel,
      detectedEncoding: res.encoding,
      supportsEncodingOverride: false,
      items: parsed.items,
      previewText: parsed.sampleLines.join('\n'),
      skippedLines: parsed.skippedLines,
      warnings,
    };
  }

  // 2. RTF
  if (isRtf) {
    const res = parseRtfBytes(bytes);
    const parsed = await parseLinesAsync(res.lines, options.onProgress, 45, 98);
    return {
      fileName: file.name,
      fileSize: file.size,
      formatLabel: res.formatLabel,
      detectedEncoding: res.encoding,
      supportsEncodingOverride: false,
      items: parsed.items,
      previewText: parsed.sampleLines.join('\n'),
      skippedLines: parsed.skippedLines,
      warnings,
    };
  }

  // 3. ZIP-based Safe Office Containers (.docx, .odt, .xlsx, .ods only — NO generic .zip or .docm/.xlsm!)
  if (isZip || ['docx', 'odt', 'xlsx', 'ods'].includes(ext)) {
    if (isZip) {
      const zip = await JSZip.loadAsync(bytes);
      const { hasWordXml, hasExcelXml, isOdf } = inspectSafeOfficeZip(zip);
      const mimeFile = zip.file('mimetype');
      const mimeVal = mimeFile ? (await mimeFile.async('string')).trim() : '';

      if (hasWordXml || ext === 'docx' || mimeVal.includes('opendocument.text') || ext === 'odt') {
        const res = await parseDocxOrOdtBytes(bytes, ext, options, zip);
        const parsed = await parseLinesAsync(res.lines, options.onProgress, 45, 98);
        return {
          fileName: file.name,
          fileSize: file.size,
          formatLabel: res.formatLabel,
          detectedEncoding: res.encoding,
          supportsEncodingOverride: false,
          items: parsed.items,
          previewText: parsed.sampleLines.join('\n'),
          skippedLines: parsed.skippedLines,
          warnings,
        };
      }

      if (hasExcelXml || ['xlsx', 'ods'].includes(ext) || mimeVal.includes('spreadsheet') || isOdf) {
        const res = await parseSpreadsheetBytes(bytes, ext, options);
        const parsed = await parseLinesAsync(res.lines, options.onProgress, 55, 98);
        return {
          fileName: file.name,
          fileSize: file.size,
          formatLabel: res.formatLabel,
          detectedEncoding: res.encoding,
          supportsEncodingOverride: false,
          items: parsed.items,
          previewText: parsed.sampleLines.join('\n'),
          skippedLines: parsed.skippedLines,
          warnings,
        };
      }

      throw new FileSecurityError(
        'Security Alert: Arbitrary ZIP archives are blocked. Please upload Word (.docx), Excel (.xlsx), or text files directly.'
      );
    }

    if (['xlsx', 'ods', 'xls'].includes(ext)) {
      const res = await parseSpreadsheetBytes(bytes, ext, options);
      const parsed = await parseLinesAsync(res.lines, options.onProgress, 55, 98);
      return {
        fileName: file.name,
        fileSize: file.size,
        formatLabel: res.formatLabel,
        detectedEncoding: res.encoding,
        supportsEncodingOverride: false,
        items: parsed.items,
        previewText: parsed.sampleLines.join('\n'),
        skippedLines: parsed.skippedLines,
        warnings,
      };
    }
  }

  // 4. Legacy Word .doc OR OLE2 Legacy Excel .xls
  if (ext === 'doc' || isOle2) {
    if (isOle2 && ext !== 'doc') {
      const XLSX = await import('xlsx');
      try {
        const cfb = XLSX.CFB.read(bytes, { type: 'array' });
        if (XLSX.CFB.find(cfb, '/Macros') || XLSX.CFB.find(cfb, '/_VBA_PROJECT_CUR')) {
          throw new FileSecurityError('Security Alert: Legacy Office file contains VBA macros and was blocked.');
        }
        const hasWord = Boolean(XLSX.CFB.find(cfb, '/WordDocument'));
        if (!hasWord) {
          const res = await parseSpreadsheetBytes(bytes, ext || 'xls', options);
          const parsed = await parseLinesAsync(res.lines, options.onProgress, 55, 98);
          return {
            fileName: file.name,
            fileSize: file.size,
            formatLabel: res.formatLabel,
            detectedEncoding: res.encoding,
            supportsEncodingOverride: false,
            items: parsed.items,
            previewText: parsed.sampleLines.join('\n'),
            skippedLines: parsed.skippedLines,
            warnings,
          };
        }
      } catch (err) {
        if (err instanceof FileSecurityError) throw err;
      }
    }

    const res = await parseLegacyDocBytes(bytes, options);
    const parsed = await parseLinesAsync(res.lines, options.onProgress, 50, 98);
    return {
      fileName: file.name,
      fileSize: file.size,
      formatLabel: res.formatLabel,
      detectedEncoding: res.encoding,
      supportsEncodingOverride: false,
      items: parsed.items,
      previewText: parsed.sampleLines.join('\n'),
      skippedLines: parsed.skippedLines,
      warnings,
    };
  }

  if (ext === 'xls') {
    const res = await parseSpreadsheetBytes(bytes, ext, options);
    const parsed = await parseLinesAsync(res.lines, options.onProgress, 55, 98);
    return {
      fileName: file.name,
      fileSize: file.size,
      formatLabel: res.formatLabel,
      detectedEncoding: res.encoding,
      supportsEncodingOverride: false,
      items: parsed.items,
      previewText: parsed.sampleLines.join('\n'),
      skippedLines: parsed.skippedLines,
      warnings,
    };
  }

  // 5. Text & Structured Formats (with Full Multi-Language Encoding Detection & Malicious Payload Filtering)
  options.onProgress?.(20, 'Decoding & verifying text safety...');
  const { text, encoding } = decodeBytesSmart(bytes, {
    manualEncoding: options.manualEncoding,
    preferredLangs: options.preferredLangs,
  });

  const isXml = ['xml', 'tmx', 'xliff', 'xlf', 'tbx'].includes(ext) || text.trimStart().toLowerCase().startsWith('<?xml');
  // Security Gate 3: Block HTML, SVG, PHP, <script>, XXE, and exploit strings inside text files
  assertNoMaliciousTextPayload(text, isXml);

  if (ext === 'csv' || ext === 'tsv') {
    const parsed = await parseCsvOrTsvAsync(text, ext === 'tsv' ? '\t' : undefined, options.onProgress);
    return {
      fileName: file.name,
      fileSize: file.size,
      formatLabel: ext === 'tsv' ? 'Tab-Separated (.tsv)' : 'CSV Spreadsheet (.csv)',
      detectedEncoding: encoding,
      supportsEncodingOverride: true,
      items: parsed.items,
      previewText: parsed.sampleLines.join('\n'),
      skippedLines: parsed.skippedLines,
      warnings,
    };
  }

  if (ext === 'json' || ext === 'jsonl' || ext === 'ndjson') {
    const jsonLines = extractLinesFromJson(text);
    const parsed = await parseLinesAsync(jsonLines, options.onProgress, 40, 98);
    return {
      fileName: file.name,
      fileSize: file.size,
      formatLabel: 'JSON Vocabulary',
      detectedEncoding: encoding,
      supportsEncodingOverride: true,
      items: parsed.items,
      previewText: parsed.sampleLines.join('\n'),
      skippedLines: parsed.skippedLines,
      warnings,
    };
  }

  if (isXml) {
    const xmlLines = extractLinesFromXml(text);
    const parsed = await parseLinesAsync(xmlLines, options.onProgress, 40, 98);
    return {
      fileName: file.name,
      fileSize: file.size,
      formatLabel: `XML / ${ext.toUpperCase() || 'Structured'}`,
      detectedEncoding: encoding,
      supportsEncodingOverride: true,
      items: parsed.items,
      previewText: parsed.sampleLines.join('\n'),
      skippedLines: parsed.skippedLines,
      warnings,
    };
  }

  if (['srt', 'vtt', 'sub'].includes(ext)) {
    const subLines = extractLinesFromSubtitles(text);
    const parsed = await parseLinesAsync(subLines, options.onProgress, 40, 98);
    return {
      fileName: file.name,
      fileSize: file.size,
      formatLabel: `Subtitles (.${ext})`,
      detectedEncoding: encoding,
      supportsEncodingOverride: true,
      items: parsed.items,
      previewText: parsed.sampleLines.join('\n'),
      skippedLines: parsed.skippedLines,
      warnings,
    };
  }

  const rawLines = text.split('\n');
  const parsed = await parseLinesAsync(rawLines, options.onProgress, 30, 98);
  return {
    fileName: file.name,
    fileSize: file.size,
    formatLabel: ext ? `Text / ${ext.toUpperCase()}` : 'Plain Text',
    detectedEncoding: encoding,
    supportsEncodingOverride: true,
    items: parsed.items,
    previewText: parsed.sampleLines.join('\n'),
    skippedLines: parsed.skippedLines,
    warnings,
  };
}

export async function parseRawTextAsync(
  rawText: string,
  onProgress?: (percent: number, stage: string) => void
): Promise<ParsedWordEntry[]> {
  const safeText = sanitizeExtractedText(rawText);
  const lines = safeText.split('\n');
  const { items } = await parseLinesAsync(lines, onProgress, 5, 100);
  return items;
}
