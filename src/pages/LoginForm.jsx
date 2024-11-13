import React from "react";

function LoginForm() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-green-400 to-green-700">
      <h2 className="text-3xl font-bold mb-4 text-white">Login</h2>
      <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded mb-4">
        Sign in
      </button>
      <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded border border-gray-300">
        <div className="flex items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
            className="w-4 h-4 mr-2"
          />
          Sign in with Google
        </div>
      </button>
    </div>
  );
}

export default LoginForm;
