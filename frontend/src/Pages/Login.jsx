import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { FaUserCircle, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Input validation
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(
                "/user/login",
                { email, password, role: "Patient" },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (data.success) {
                // Store token and user data
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // Update context
                setIsAuthenticated(true);
                setUser(data.user);

                toast.success("Login successful!");
                navigate("/");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <section className="login-section">
            <div className="login-container">
                <div className="login-header">
                    <img src="/logo.png" alt="VitaSphere Logo" className="login-logo" />
                    <h1>Welcome to VitaSphere</h1>
                    <p>Please login to continue</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <FaUserCircle className="input-icon" />
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <FaLock className="input-icon" />
                            Password
                        </label>
                        <div className="password-input-container">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`login-button ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <p className="form-footer">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Login; 