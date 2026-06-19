import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TenantTrails API",
      version: "1.0.0",
      description: "CSCI 4177 Lab 5 REST API for TenantTrails",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "API health and database test endpoints",
      },
      {
        name: "Auth",
        description: "Signup, login, and current user endpoints",
      },
      {
        name: "Apartments",
        description: "Apartment listing and detail endpoints",
      },
      {
        name: "Reviews",
        description: "Review endpoints",
      },
      {
        name: "Comments",
        description: "Comment endpoints",
      },
      {
        name: "Upload",
        description: "Image upload endpoint using Cloudinary",
      },
    ],
    components: {
      securitySchemes: {
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