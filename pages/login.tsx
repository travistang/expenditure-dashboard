import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormikErrors, useFormik } from "formik";
import React from "react";
import classnames from "classnames";
import InputBase, { TextInput } from "../components/Form/Input";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

type FormValueType = {
  username: string;
  password: string;
};
export default function LoginPage() {
  const router = useRouter();
  const urlQuery = router.query;
  const formik = useFormik<FormValueType>({
    initialValues: {
      username: "",
      password: "",
    },
    validateOnChange: true,
    validate: (data) => {
      const errors: FormikErrors<FormValueType> = {};
      if (!data.username) {
        errors.username = "Missing username";
      }
      if (!data.password) {
        errors.password = "Missing password";
      }
      return errors;
    },
    onSubmit: async (data, helpers) => {
      if (!helpers.validateForm(data)) {
        return;
      }
      const { username, password } = data;
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          throw new Error();
        }
        router.push(urlQuery["previous"]?.toString() ?? "/");
      } catch {
        toast.error("Incorrect credentials.");
      }
    },
  });

  const disableButton = Object.entries(formik.errors).length > 0;

  return (
    <div className="fixed inset-0 flex bg-base-200 items-center justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="p-4 grid grid-cols-1 gap-2"
      >
        <h3 className="text-3xl pb-2">Expenditure Dashboard</h3>
        <TextInput
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          name="username"
          error={formik.errors.username}
        />
        <InputBase
          type="password"
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          name="password"
          error={formik.errors.password}
        />
        <button
          type="submit"
          className={classnames(
            "btn btn-primary flex items-center gap-2 mt-2",
            disableButton && "opacity-50 cursor-not-allowed"
          )}
        >
          <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
          Login
        </button>
      </form>
    </div>
  );
}
