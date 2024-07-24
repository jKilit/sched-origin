import { Link } from "react-router-dom";

function MenuAppBar({ inOwnerPage }) {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex items-center justify-center">
        {inOwnerPage ? (
          <li>
            <Link
              to={{pathname: "/", replace: true}}
              className="text-white font-semibold hover:text-gray-300 mx-10"
            >
              Go Home
            </Link>
          </li>
        ) : (
          <li className="relative">
            <div className="dropdown">
              <Link to={{ pathname: "/owner", replace: true }}>
                <button className="dropbtn text-white font-semibold hover:text-gray-300 mx-10">
                  Go to availability view
                </button>
              </Link>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
}
export default MenuAppBar;
