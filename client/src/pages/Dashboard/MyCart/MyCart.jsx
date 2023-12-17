import { Helmet } from "react-helmet-async";
import useCart from "../../../hooks/useCart";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const MyCart = () => {
  const [cart, isLoading, refetch, error] = useCart();

  const totalPrice = cart?.reduce((sum, item) => sum + item.price, 0);

  // delete a item form cart
  const handleDelete = (id) => {
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
        fetch(`http://localhost:5000/carts/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              console.log(data, "data");
              refetch();
                Swal.fire({
                title: "Deleted!",
                text: "Your item has been deleted.",
                icon: "success"
              });
            }
          });
      }
    });
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>Bistro Boss | My Cart</title>
      </Helmet>
      <div className="p-4">
        <div className="flex justify-between items-center w-full font-semibold h-10">
          <h1>Total Order: ${cart.length}</h1>
          <h1>Total Price: $ {totalPrice}</h1>
          <button className="btn btn-warning btn-sm ">Pay</button>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Item Image</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((row, i) => (
                <tr key={row._id}>
                  <th>{i + 1}</th>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={row.image} alt={row.image} />
                      </div>
                    </div>
                  </td>
                  <td>{row.name}</td>
                  <td>${row.price}</td>
                  <th>
                    <button
                      onClick={() => handleDelete(row._id)}
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
    </div>
  );
};

export default MyCart;
