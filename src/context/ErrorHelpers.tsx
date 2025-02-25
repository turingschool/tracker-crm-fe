export const handleErrorResponse = async (
  response: Response,
  setErrors: (messages: string[]) => void
) => {
  try {
    const errorData = await response.json();
    console.log("handleErrorResponse called with:", errorData.message || errorData.error);
    setErrors([errorData.message || errorData.error || "An unexpected error occurred."]);
  } catch {
    console.error("Unknown API Error:", response.status);
    setErrors(["An unexpected error occurred."]);
  }
};
