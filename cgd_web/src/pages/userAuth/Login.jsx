import React from "react";

import WelcomeBanner from "../../partials/dashboard/WelcomeBanner";
import FormLogin from "../../forms/FormLogin";

function LoginPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Welcome banner */}
            <WelcomeBanner />
            <FormLogin />
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
