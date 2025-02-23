export const handleErrorResponse = async (
  response: Response,
  setErrors: (messages: string[]) => void
) => {
  try {
    const errorData = await response.json();
    console.log("handleErrorResponse called with:", errorData.message);
    setErrors([errorData.message]); 
  } catch {
    console.error("Unknown API Error:", response.status);
    setErrors(["An unexpected error occurred."]);
  }
};


