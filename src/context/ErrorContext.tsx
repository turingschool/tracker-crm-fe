import { createContext, useState, useContext, ReactNode } from "react";

interface ErrorContextType {
  errorMessages: string[];
  setErrors: (messages: string[]) => void;
  clearErrors: () => void;
  ErrorMessage: ({ message }: { message: string }) => JSX.Element;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ( { children }: { children: ReactNode }) => {
  const[errorMessages, setErrorMessages] = useState<string[]>([]);

  const setErrors = (messages: string[]) => setErrorMessages(messages);

  const clearErrors = () => setErrorMessages([]);

  const ErrorMessage = ({ message }: { message: string }) => (
    <p className="text-red-700 bg-red-100 border-red-500 p-3 rounded-md text-sm font-medium">
      {message}
    </p>
  );

  return (
    <ErrorContext.Provider value={{ errorMessages, setErrors, clearErrors, ErrorMessage }}>
      {children}

      {errorMessages.length > 0 && (
        <div>
          {errorMessages.map((msg, index) => (
            <ErrorMessage key={index} message={msg} />
          ))}
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
}


