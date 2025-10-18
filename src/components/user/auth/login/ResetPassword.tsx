

import { useRouter } from 'next/navigation';
import { useState } from 'react';



const ResetPassword = () => {
// const { token } = useParams()
  const navigate = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setError('');

//   if (!password || !confirmPassword) {
//     return setError('Please fill in all fields');
//   }

//   if (password !== confirmPassword) {
//     return setError('Passwords do not match');
//   }

//   if (password.length < 8) {
//     return setError('Password must be at least 8 characters');
//   }

//   try {
//     setIsLoading(true);
//     const data = await resetPassword(token, password);
    
//     if (data.message) {
//       setSuccess(true);
//       setTimeout(() => navigate('/login'), 3000);
//     }
//   } catch (err) {
//     setError(err instanceof Error ? err.message : 'An unexpected error occurred');
//   } finally {
//     setIsLoading(false);
//   }
// };

  // if (!token) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center ">
  //       <div className="max-w-md w-full p-6 bg-white ">
  //         <h2 className="text-2xl font-bold mb-6 text-center">Invalid Token</h2>
  //         <p className="text-red-500 mb-4">
  //           The password reset link is invalid or has expired.
  //         </p>
  //         <button
  //           onClick={() => navigate('/login')}
  //           className="w-full bg-primary text-white py-2 px-4 rounded "
  //         >
  //           Request New Reset Link
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // if (success) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="max-w-md w-full p-6 bg-white ">
  //         <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
  //           Password Reset Successful!
  //         </h2>
  //         <p className="mb-4">
  //           Your password has been successfully updated. You will be redirected to the login page shortly.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full p-6 bg-white ">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form >
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border-b border-primary rounded"
              required
              minLength={8}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border-b border-primary rounded"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary text-white py-2 px-4 rounded ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
