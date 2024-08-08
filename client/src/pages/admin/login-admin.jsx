import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authentication";

function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { adminLogin } = useAuth();

  const [state, setState] = useState({
    loading: false,
    error: null,
    user: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, loading: true, error: null });

    try {
      if (password.length < 12) {
        return setState({
          ...state,
          loading: false,
          error: "Password should be 12 characters or more",
        });
      }

      await adminLogin({ email, password });

      // If adminLogin is successful, user will be redirected to /admin/courselist
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error.message || "An error occurred",
      });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <CustomSnackbar open={open} handleClose={handleClose} alert={alert} />

      <section className="bg-gradient-to-r from-blue-700 to-blue-400 h-screen overflow-hidden flex items-center justify-center">
        <div className="max-w-[566px] w-full md:max-w-[568px] p-6 shadow-lg bg-white rounded-md">
          <div>
            <h1 className="mt-6 text-6xl md:text-6xl lg:text-6xl font-bold bg-gradient-to-l from-blue-700 to-blue-200 bg-clip-text text-transparent flex items-center justify-center">
              CourseFlow
            </h1>
            <h2 className="mt-2 text-slate-500 font-medium text-base md:text-lg lg:text-xl xl:text-24 flex items-center justify-center">
              Admin Panel Control
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="mx-8 mt-10 block text-base mb-2 text-black"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="mx-8 bg-white box-border border-2 w-[446px] h-[48px] text-base px-2 py-1 rounded-md flex items-center focus:text-black text-black"
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  className="mx-8 mt-10 block text-base mb-2 text-black"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="mx-8 bg-white box-border border-2 w-[446px] h-[48px] text-base px-2 py-1 rounded-md flex items-center focus:text-black text-black"
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {state.error && (
                  <div className="text-red-500 text-sm flex justify-start items-start pt-4 pl-8">
                    {state.error}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="mx-8 mb-6 bg-blue-500 hover:bg-blue-700 text-white w-[446px] h-[60px] font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {state.loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginAdmin;
