export default function getCurrentFileInfo(): string {
  try {
    throw new Error();
  } catch (error) {
    const stackLines = (error as Error).stack?.split("\n").slice(2) || [];
    const stackFrame = stackLines[0].trim();
    const matches = stackFrame.match(/at (.+?) \((.+?):(\d+):(\d+)\)/);
    let result;
    if (matches) {
      const [, functionName, fileName, lineNumber] = matches;
      result = {
        fileName: fileName,
        functionName: functionName,
        lineNumber: parseInt(lineNumber, 10),
      };
    } else {
      // Unable to parse stack trace
      result = {
        fileName: "Unknown",
        functionName: "Unknown",
        lineNumber: 0,
      };
    }
    return JSON.stringify(result);
  }
}
