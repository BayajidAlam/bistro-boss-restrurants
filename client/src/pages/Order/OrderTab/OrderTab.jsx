import FoodCard from "../../../components/FoodCard/FoodCard";

const OrderTab = ({items}) => {
  return (
    <div className="grid md:grid-cols-3 gap-10">
      {" "}
      {items.map((dessert) => (
        <FoodCard key={dessert._id} item={dessert} />
      ))}
    </div>
  );
};

export default OrderTab;
