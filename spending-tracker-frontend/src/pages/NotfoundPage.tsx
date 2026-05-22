import { Link } from "react-router-dom";
export const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/">
                <button>Go back to Home</button>
            </Link>
        </div>
    );
}