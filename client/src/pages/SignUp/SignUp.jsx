/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

const SignUp = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  let navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";

  // hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // signup user
  const onSubmit = (data) => {
    console.log(data, "data");
    createUser(data.email, data.password)
      .then((result) => {
        if (result.user) {
          updateUserProfile(data.name, data.photoURL)
            .then((result) => {})
            .catch((error) => {});
          reset();
          navigate(from, { replace: true });
        }
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  return (
    <>
      <Helmet>
        <title>Bistro Boss | Create account</title>
      </Helmet>
      <div className="hero min-h-screen">
        <div className="hero-content flex">
          <div className="text-center lg:text-left w-1/2">
            <h1 className="text-5xl font-bold">Signup now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>

          <div className="card  w-1/2 max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleSubmit(onSubmit)} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="your name"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="email"
                  className="input input-bordered"
                />
                {errors.email && (
                  <span className="text-red-400">This field is required</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: true,
                    minLength: 6,
                    maxLength: 20,
                    pattern:
                      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/,
                  })}
                  placeholder="password"
                  className="input input-bordered"
                />
                {errors.password?.type === "required" && (
                  <span className="text-red-400">This field is required</span>
                )}
                {errors.password?.type === "minLength" && (
                  <span className="text-red-400">
                    Password at least 6 character
                  </span>
                )}
                {errors.password?.type === "maxLength" && (
                  <span className="text-red-400">
                    Password not more then 20 character
                  </span>
                )}
                {errors.password?.type === "pattern" && (
                  <span className="text-red-400">
                    Password should be strong!
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">PhotoURL</span>
                </label>
                <input
                  type="text"
                  {...register("photoURL", { required: true })}
                  placeholder="photoURL"
                  className="input input-bordered"
                />
                {errors.photoURL && (
                  <span className="text-red-400">photoURL is required</span>
                )}
              </div>
              <div>
                <label className="label">
                  <Link
                    className="label-text-alt link link-hover"
                    to={"/login"}
                  >
                    Already have a account?
                  </Link>
                </label>
              </div>

              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Signup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
