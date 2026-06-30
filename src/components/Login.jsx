
const PALETTE = ["bg-primary", "bg-danger", "bg-warning", "bg-success", "bg-info", "bg-secondary"];

const Login = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/login`;
  };

  return (
      <div className="container position-relative">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-11 col-sm-9 col-md-6 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body text-center p-5">
                <div className="bg-primary rounded-4 d-inline-flex p-3 mb-3">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>

                <h1 className="fw-bold mb-1">Montage</h1>
                <p className="text-secondary mb-4">
                  Memories.<br/>
                   Organized and shared.
                </p>

                <button
                  onClick={handleLogin}
                  className="btn btn-light border w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  Continue with Google
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;