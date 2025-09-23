import { login, Profile } from "./auth.js";

document.addEventListener('DOMContentLoaded', async () => {
  let k = localStorage.getItem("token")
  if (k) {
    Profile()
  } else {
    login()
  }
}); 