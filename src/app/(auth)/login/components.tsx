"use client";

import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { Button, Textfield } from "@insd47/library";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "@/firebase/client";
import { useRouter } from "next/navigation";

type FieldType = "email" | "password";

type FormData = {
  value: string;
  isValid: boolean;
  error: boolean;
};

export const Buttons: React.FC = () => {
  return (
    <div className={styles.buttons}>
      <Button size="small" onClick={() => alert("Not Available Now")}>
        Require Access
      </Button>
      <Button size="small" onClick={() => alert("Not Available Now")}>
        Find Password
      </Button>
    </div>
  );
};

export const Form: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<Record<FieldType, FormData>>({
    email: { value: "", isValid: false, error: false },
    password: { value: "", isValid: false, error: false },
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  useEffect(() => {
    let newError = "";
    if (formData.email.error) newError = "Invalid Email or Password";
    setError(newError);
  }, [formData]);

  const handleInputChange = (type: FieldType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        value,
        isValid: type == "email" ? validateEmail(value) : prev[type].isValid,
        error: false,
      },
    }));
  };

  const handleFocus = (type: FieldType) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], error: false },
    }));
  };

  const handleBlur = (type: FieldType) => {
    if (
      type === "email" &&
      !formData.email.isValid &&
      formData.email.value.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        email: { ...prev.email, error: true },
      }));
    }
  };

  const sendRequest = () => {
    setIsLoading(true);

    const auth = getAuth(app);

    signInWithEmailAndPassword(
      auth,
      formData.email.value,
      formData.password.value
    )
      .then(async (credentials) => {
        const token = await credentials.user?.getIdToken();
        if (token)
          fetch("/api/auth/login", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => router.push(res.url));
      })
      .catch((e) => {
        if (e.code === "auth/user-disabled") {
          setError("This account has been disabled");
          setIsLoading(false);
          return;
        }

        setError("Invalid Email or Password");
        setFormData({
          email: { ...formData.email, error: true },
          password: { ...formData.password, error: true },
        });
        setIsLoading(false);
        emailRef.current?.focus();
      });
  };

  return (
    <>
      <form
        className={styles.inputs}
        onSubmit={(e) => {
          e.preventDefault();
          sendRequest();
        }}
      >
        <Textfield
          stretch
          ref={emailRef}
          placeholder="Email Address"
          type="email"
          onFocus={() => handleFocus("email")}
          error={formData.email.error}
          onBlur={() => handleBlur("email")}
          value={formData.email.value}
          onChange={(e) => handleInputChange("email", e.target.value)}
          bottom={10}
        />
        <Textfield
          stretch
          placeholder="Password"
          type="password"
          onFocus={() => handleFocus("password")}
          error={formData.password.error}
          value={formData.password.value}
          onChange={(e) => handleInputChange("password", e.target.value)}
          bottom={20}
        />
        <Button
          formType="submit"
          stretch
          type="filled"
          icon="login"
          loading={isLoading}
          disabled={!formData.email.isValid || formData.password.value === ""}
        >
          Sign In
        </Button>
      </form>{" "}
      <p className={styles.error}>{error}</p>
    </>
  );
};
