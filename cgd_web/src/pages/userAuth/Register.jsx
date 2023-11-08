import React from "react";

import WelcomeBanner from "../../partials/dashboard/WelcomeBanner";
import Register from "../../forms/FormRegister";

function RegisterPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Welcome banner */}
            <WelcomeBanner />
            <Register />
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegisterPage;
