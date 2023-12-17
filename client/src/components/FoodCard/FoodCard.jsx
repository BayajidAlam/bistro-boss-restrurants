/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";
import useCart from "../../hooks/useCart";

const FoodCard = ({ item }) => {
  const { name, image, price, recipe, _id } = item;
  const { user } = useContext(AuthContext);
  const [cart, isLoading, refetch] = useCart();


  const handleAddToCart = () => {
    const cartData = {
      Item_Id: _id,
      name,
      image,
      price,
      user_Email: user.email,
      user_Name: user.displayName,
    };
    if (user && user.email) {
      fetch("http://localhost:5000/carts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(cartData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.insertedId) {
            refetch();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Added to Cart",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    } else {
      alert("Please login to add to cart!");
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={image} alt="Shoes" />
      </figure>
      <p className="absolute right-0 mr-4 mt-4 px-4 bg-slate-900 text-white">
        ${price}
      </p>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{recipe}</p>
        <div className="card-actions justify-end">
          <Link to={`/order/${item._id}`}>
            <button
              onClick={() => handleAddToCart()}
              className="btn btn-primary"
            >
              Add To Card
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
