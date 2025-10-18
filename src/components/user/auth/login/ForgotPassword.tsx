

interface ForgotPasswordProps {
  setShowForgotPassword: (show: boolean) => void;
  forgotPasswordEmail: string;
  setForgotPasswordEmail: (email: string) => void;
  handleForgotPassword: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  forgotPasswordStatus: {
    success: boolean;
    message: string;
  } | null;
}

const ForgotPassword = ({
  setShowForgotPassword,
  forgotPasswordEmail,
  setForgotPasswordEmail,
  handleForgotPassword,
  isLoading,
  forgotPasswordStatus,
}: ForgotPasswordProps) => {
  return (
    <div className="w-full md:w-1/2 p-8">
      <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
      
      {forgotPasswordStatus ? (
        <div className={`mb-4 p-4 rounded ${forgotPasswordStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {forgotPasswordStatus.message}
          {forgotPasswordStatus.success && (
            <p className="mt-2">Please check your email for the reset link.</p>
          )}
        </div>
      ) : (
        <p className="mb-6">Enter your email address to receive a password reset link.</p>
      )}

      <form onSubmit={handleForgotPassword}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-primary text-white p-2 rounded  transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;