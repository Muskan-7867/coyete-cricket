
import { useState } from "react";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";

interface OtpVerificationFormProps {
  userId: string;
  email: string;
  onVerificationSuccess: () => void;
  onBackToRegister: () => void;
}

const VerifyOtpForm = ({
  userId,
  email,
  onVerificationSuccess,
  onBackToRegister,
}: OtpVerificationFormProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // const handleVerify = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setIsLoading(true);

  //   if (otp.length !== 4 || !/^\d+$/.test(otp)) {
  //     setError("OTP must be a 4-digit number");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await verifyOtp({ userId, otp });
  //     if (response.success) {
  //       onVerificationSuccess();
  //     }
  //   } catch {
  //     setError("Verification failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleResendOtp = async () => {
  //   setResendLoading(true);
  //   setError("");
  //   try {
  //     await resendOtp({ userId });
  //     setResendSuccess(true);
  //     setCountdown(60);
  //     setTimeout(() => setResendSuccess(false), 5000);
  //   } catch {
  //     setError("Failed to resend OTP. Please try again.");
  //   } finally {
  //     setResendLoading(false);
  //   }
  // };

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <button
        onClick={onBackToRegister}
        className="flex items-center text-primary hover:text-primary-dark mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Register
      </button>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <FaEnvelope className="text-3xl text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600">
          We&apos;ve sent a 4-digit verification code to{" "}
          <span className="font-semibold">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {resendSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          New OTP has been sent to your email.
        </div>
      )}

      <form  className="space-y-6">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter Verification Code
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/[^0-9]/g, ""));
              setError("");
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-xl tracking-widest"
            placeholder="0000"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-70"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Didn&apos;t receive the code?{" "}
          <button
            
            disabled={resendLoading || countdown > 0}
            className={`text-primary hover:underline ${
              (resendLoading || countdown > 0) && "opacity-70"
            }`}
          >
            {resendLoading
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpForm;