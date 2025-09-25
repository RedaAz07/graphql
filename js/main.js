import { login, Profile } from "./auth.js";

document.addEventListener('DOMContentLoaded', async () => {
  let token = localStorage.getItem("token")
  if (token) {
    Profile()
  } else {
    login()
  }
}); 