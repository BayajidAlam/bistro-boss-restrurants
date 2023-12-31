import { NavLink, Outlet } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { IoMdMenu } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { HiTemplate } from "react-icons/hi";
import { TbBrandBooking } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import useAdmin from "../hooks/useAdmin";

const Dashboard = () => {
  const [isAdmin] = useAdmin();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <Outlet />
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div className="drawer-side bg-[#D1A054]">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full  text-base-content bg-[#D1A054]">
          {isAdmin ? (
            <>
              {" "}
              <li>
                <NavLink to="/">
                  <IoIosHome />
                  Admin Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/add-item">
                  <IoAddCircle /> Add Item
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manage-all-item">
                  <HiTemplate /> Manage Item
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/allUsers">
                  <FaUsers /> Manage Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/myCart">
                  <FaCartShopping /> My Cart
                </NavLink>
              </li>
              {/* <li>
                <NavLink to="/dashboard/payment">
                  <FaWallet /> Payment History
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/reservation">
                  <FaCalendar /> Reservation
                </NavLink>
              </li> */}
            </>
          ) : (
            <>
              <li>
                <NavLink to="/dashboard/payment">
                  <FaCartShopping /> payment
                </NavLink>
              </li>
            </>
          )}

          <div className="divider"></div>
          <li>
            <NavLink to="/">
              <IoIosHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu">
              <IoMdMenu /> Menu
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
