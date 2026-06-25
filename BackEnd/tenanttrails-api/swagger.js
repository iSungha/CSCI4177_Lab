import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TenantTrails API",
      version: "1.0.0",
      description: "CSCI 4177 Lab 6 REST API for TenantTrails",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local API server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Health and database check endpoints",
      },
      {
        name: "Auth",
        description: "Signup, login, logout, and current user endpoints",
      },
      {
        name: "Apartments",
        description: "Apartment dashboard and detail endpoints",
      },
      {
        name: "Reviews",
        description: "Create, edit, and delete review endpoints",
      },
      {
        name: "Comments",
        description: "Comment endpoints",
      },
      {
        name: "Profile",
        description: "Logged-in user's profile and reviews",
      },
      {
        name: "Upload",
        description: "Cloudinary image upload endpoint",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./app.js", "./routes/*.js"],
});

export default swaggerSpec;