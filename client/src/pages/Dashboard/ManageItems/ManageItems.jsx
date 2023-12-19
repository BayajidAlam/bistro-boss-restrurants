/* eslint-disable no-unused-vars */
import { Helmet } from "react-helmet-async";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

import { CiEdit } from "react-icons/ci";
import useAdmin from "../../../hooks/useAdmin";
import useMenu from "../../../hooks/useMenu";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageItems = () => {
  const [menu, loading, refetch] = useMenu();
  const [isAdmin] = useAdmin();
  const axiosSecure = useAxiosSecure();

  // update a user on db
  const handleUpdateMenu = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Made Admin Successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  // delete a item form cart
  const handleDeleteMenu = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/menu/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            console.log(res.data, "data");
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Menu has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div className="w-full p-4">
      <Helmet>
        <title>Bistro Boss | All users</title>
      </Helmet>
      <h1>All Menu</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Picture</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {menu?.map((mn, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{mn?.name}</td>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={mn.image} alt={mn.image} />
                    </div>
                  </div>
                </td>
                <td>{mn?.category}</td>
                <td>{mn?.price}</td>
                <th>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => handleUpdateMenu(mn?._id)}
                      className="btn bg-red-600 text-white btn-md text-xl"
                    >
                      <CiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(mn?._id)}
                      className="btn bg-red-600 text-white btn-md text-xl"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageItems;
