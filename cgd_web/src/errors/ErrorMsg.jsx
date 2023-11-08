import React from "react";

function ErrorMsg({ message }) {
  return (
    <>
      <div className="h-2 w-full text-red-600">{message}</div>
    </>
  );
}

export default ErrorMsg;
