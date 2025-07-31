import { userEndpoints } from "../services/apis";
import { setLoading, setToken } from "../slices/authSlice";
import { apiconnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import { setUser, setEnrolledCourses } from "../slices/profileeSlice";
import { profileEndpoints } from "../services/apis";
import { setImage } from "../slices/profileeSlice";
import { resetCart } from "../slices/cartSlice";
import { addToCart } from "../slices/cartSlice";
import { fetchCart } from "../services/apis";
const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSWORDTOKEN_API,
  RESETPASSWORD_API,
} = userEndpoints;
const {
  SET_PROFILE_IMAGE_API,
  UPDATEPROFILE_API,
  DELETEPROFILE_API,
  RESETPROFILEPASSWORD_API,
  GET_USER_ENROLLED_COURSES_API,
} = profileEndpoints;

export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiconnector("POST", LOGIN_API, {
        email,
        password,
      });
      console.log("login api response...", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login successful");
      // console.log("response.data", response.data);
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));

      if (response.data.user.accountType === "student") {
        const cartRes = await apiconnector(
          "GET",
          fetchCart.FETCH_CART_API,
          null,
          {
            Authorization: `Bearer ${response.data.token}`,
          }
        );
        console.log("cartRes", cartRes);
        dispatch(addToCart(cartRes.data.cart.items));
      }

      navigate("/dashboard");

      const user = response.data.user;

      const userImage = user?.image
        ? user.image
        : `https://api.dicebear.com/7.x/identicon/svg?seed=${
            user?.firstName ?? "User"
          }%20${user?.lastName ?? ""}`;

      console.log("userImage", userImage);
      const updatedUser = { ...user, image: userImage };
      // console.log("updated user", updatedUser);
      dispatch(setUser(updatedUser));
      dispatch(setImage(userImage));
      localStorage.setItem("image", JSON.stringify(userImage));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("login api error", error);
      toast.error(error?.response?.data?.message || "Login failed");
      navigate("/login");
    }
    dispatch(setLoading(false));
  };
}

export function signup(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiconnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate,
      });
      // console.log("signup api response...", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("signup successful");
      navigate("/login");
    } catch (error) {
      console.log("signup api error", error);
      toast.error(error.response?.data?.message || "something went wrong");
      navigate("/signup");
    }
    dispatch(setLoading(false));
  };
}

// const navigate = useNavigate();
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiconnector("POST", SENDOTP_API, {
        email,
      });
      // console.log("send otp api response...", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("otp sent successful");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      console.log("otp api error", error);
      toast.error("otp failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return async (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("image");
    dispatch(setImage(null));
    dispatch(setUser(null));
    dispatch(setToken(null));
    dispatch(resetCart());
    toast.success("logged out successfully");
    navigate("/");
  };
}

export function resetPasswordToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiconnector("POST", RESETPASSWORDTOKEN_API, {
        email,
      });
      // console.log("response of reset token password", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Token sent to email");
      setEmailSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset password token error"
      );
      console.log("Error while sending token to email", error);
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token, navigate) {
  // console.log(password, confirmPassword, token);
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiconnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });
      // console.log("response of reset password", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("password has been updated successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset password error");
      console.log("Error while updating password", error);
    }
    dispatch(setLoading(false));
  };
}

export function setProfileImage(img) {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    const token = getState().auth.token;

    if (!token) {
      toast.error("User not authenticated");
      dispatch(setLoading(false));
      return;
    }

    try {
      // console.log("Image to be set as profile image", img);

      const formData = new FormData();
      formData.append("image", img);

      const response = await apiconnector(
        "PUT",
        SET_PROFILE_IMAGE_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      // console.log("Response of set profile image", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Optional: update Redux state or show success message
      toast.success("Profile image updated successfully");
      // console.log("res data", response.data);
      localStorage.setItem("image", JSON.stringify(response.data.data));
      dispatch(setImage(response.data.data));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating profile image"
      );
      console.log("Error while updating profile image", error);
    }

    dispatch(setLoading(false));
  };
}

export function updateProfile(data, navigate) {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    if (!token) {
      toast.error("User not authenticated");
      dispatch(setLoading(false));
      return;
    }
    // console.log("frontend token", token);
    // console.log(UPDATEPROFILE_API, data);
    try {
      const response = await apiconnector("PUT", UPDATEPROFILE_API, data, {
        Authorization: `Bearer ${token}`,
      });
      // console.log("Response of update profile", response);
      if (response.data.success) {
        toast.success("profle updated successfully");
        dispatch(setUser(response.data.newUser));
        localStorage.setItem("user", JSON.stringify(response.data.newUser));
        navigate("/dashboard/my-profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
      // console.log(error.response.data.message);
      console.log("Error while updating profile", error);
    }
    dispatch(setLoading(false));
  };
}

export function deleteProfile(navigate) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    // console.log("token in delete profile", token);
    if (!token) {
      toast.error("User not authenticated");
      return;
    }
    try {
      const response = await apiconnector("DELETE", DELETEPROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      // console.log("Response of delete profile", response);
      if (response.data.success) {
        toast.success("Profile deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("image");
        dispatch(setUser(null));
        dispatch(setImage(null));
        dispatch(setToken(null));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting profile");
      console.log("Error while deleting profile", error);
    }
    dispatch(setLoading(false));
  };
}

export function resetProfilePassword(formData, navigate) {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    if (!token) {
      toast.error("User not authenticated");
      return;
    }
    try {
      const response = await apiconnector(
        "PUT",
        RESETPROFILEPASSWORD_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      // console.log("Response of update profile password", response);
      if (response.data.success) {
        toast.success("Password updated successfully");
        dispatch(setToken(null));
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
      console.log("Error while updating password", error);
    }
    dispatch(setLoading(false));
  };
}

export function getUserEnrolledCourses() {
  return async (dispatch, getState) => {
    // let result = [];
    const token = getState().auth.token;
    try {
      const response = await apiconnector(
        "GET",
        GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorisation: `Bearer ${token}`,
        }
      );
      if (response.data.success) {
        toast.success("Enrolled courses fetched successfully");
        dispatch(setEnrolledCourses(response.data.data));
      }
      // console.log("Response of get enrolled courses", response);
      // result = response.data.data;
      // console.log("result", result);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching enrolled courses"
      );
      console.log("Error while fetching enrolled courses", error);
    }

    // return result;
  };
}
