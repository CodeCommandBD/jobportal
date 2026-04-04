export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const role = auth?.user?.role;
        const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
        const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin");
        const isEmployerRoute = nextUrl.pathname.startsWith("/dashboard/employer");
        const isCandidateRoute = nextUrl.pathname.startsWith("/dashboard/candidate");

        // 1. If not logged in and trying to access any dashboard route, redirect to signin
        if (!isLoggedIn && isDashboardRoute) {
            return false; // This will trigger the redirect to signIn page defined in pages
        }

        // 2. If logged in, enforce role-based access
        if (isLoggedIn) {
            if (isAdminRoute && role !== "admin") {
                return Response.redirect(new URL("/", nextUrl));
            }
            if (isEmployerRoute && role !== "employer") {
                return Response.redirect(new URL("/", nextUrl));
            }
            if (isCandidateRoute && role !== "jobseeker") {
                return Response.redirect(new URL("/", nextUrl));
            }
        }

        return true;
    },
  },
  providers: [], // Add providers with an empty array for now, config will be extended in auth.jsx
};
