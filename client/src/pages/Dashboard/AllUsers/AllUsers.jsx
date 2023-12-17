import { Helmet } from "react-helmet-async";
import useUsers from "../../../hooks/useUsers";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { FaUserShield } from "react-icons/fa";

const AllUsers = () => {
  const [users, isLoading, refetch] = useUsers();
  console.log(users, "users");

  // update a user on db
  const handleUpdateUser = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
       
      });
  };

  // delete a item form cart
  const handleDeleteUser = (id) => {
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
        fetch(`http://localhost:5000/users/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              console.log(data, "data");
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "user has been deleted.",
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
      <h1>All Users</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{user?.user_name}</td>
                <td>{user?.user_email}</td>
                <td>
                  {user?.role === "admin" ? (
                    "admin"
                  ) : (
                    <button
                      onClick={() => handleUpdateUser(user._id)}
                      className="btn bg-orange-600 text-white btn-md text-xl"
                    >
                      <FaUserShield />
                    </button>
                  )}
                </td>
                <th>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn bg-red-600 text-white btn-md text-xl"
                  >
                    <MdDelete />
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
