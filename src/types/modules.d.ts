declare module 'mammoth/mammoth.browser.min.js' {
  const mammoth: {
    convertToHtml: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string; messages: any[] }>;
    extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string; messages: any[] }>;
  };
  export default mammoth;
}
