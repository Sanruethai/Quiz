// app.config.js
require("dotenv").config();

module.exports = {
  expo: {
    name: "cis-kku-app",
    slug: "cis-kku-app",
    scheme: "ciskkuapp",
    plugins: ["expo-router"],
    extra: {
      API_BASE: process.env.API_BASE,
      CIS_API_KEY: process.env.CIS_API_KEY || "",
      POSTS_BASE: process.env.POSTS_BASE || "",
      POSTS_LIST: process.env.POSTS_LIST || "",
      POSTS_CREATE: process.env.POSTS_CREATE || "",
      COMMENTS_LIST: process.env.COMMENTS_LIST || "",
      COMMENTS_CREATE: process.env.COMMENTS_CREATE || "",
      LIKE_URL: process.env.LIKE_URL || "",
      UNLIKE_URL: process.env.UNLIKE_URL || "",
    },
  },
};
