const PasswordHint = ({
  password,
  errorMessage
}: {
  password: string;
  errorMessage: string | null;
}) => {
  return (
    <div
      className={`w-full p-3 text-sm rounded ${
        errorMessage ? "bg-red-50 text-red-600" : "bg-blue-50 text-gray-600"
      }`}
    >
      <p className="font-medium">Password must contain:</p>
      <ul className="list-disc pl-5">
        <li className={password.length >= 8 ? "text-green-500" : ""}>
          At least 8 characters {password.length >= 8 && "✓"}
        </li>
        <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
          1 uppercase letter {/[A-Z]/.test(password) && "✓"}
        </li>
        <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>
          1 lowercase letter {/[a-z]/.test(password) && "✓"}
        </li>
        <li className={/\d/.test(password) ? "text-green-500" : ""}>
          1 number {/\d/.test(password) && "✓"}
        </li>
        <li className={/[@$!%*?&#^+=]/.test(password) ? "text-green-500" : ""}>
          1 special character (@$!%*?&#^+=){" "}
          {/[@$!%*?&#^+=]/.test(password) && "✓"}
        </li>
      </ul>
    </div>
  );
};

export default PasswordHint;
