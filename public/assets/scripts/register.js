import firebase from "./firebase-app";
import Cropper from "cropperjs";
import { getFormValues, showAlertError, translateMessage } from "./utils";

document.querySelectorAll("#form-register").forEach((page) => {
  const inputFile = document.querySelector("#upload-image");
  const imageElement = page.querySelector("#icon-avatar");
  const modal = document.querySelector(".modal-change");
  const btnUp = document.querySelector(".upload-file");
  const image = document.querySelector(".image");
  const checked = document.querySelector(".checked");
  const btnSubmit = page.querySelector("button");
  let cropper = null;

  checked.style.display = "none";

  imageElement.addEventListener("click", (e) => {
    modal.style.display = "flex";
  });

  btnUp.addEventListener("click", (e) => {
    inputFile.click();
  });

  inputFile.addEventListener("change", (e) => {
    // verifica de existe 1 arquivo selecionado
    if (e.target.files.length) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        image.src = reader.result;

        image.closest("div").classList.add("cropping");

        //cropper para definir a posição e angulo de corte do avatar
        cropper = new Cropper(image, {
          //proporção do corte
          aspectRatio: 1 / 1,
        });
      };

      btnUp.style.display = "none";
      checked.style.display = "flex";

      reader.readAsDataURL(file); // file blob

      e.target.value = "";
    }
  });

  checked.addEventListener("click", (e) => {
    image.closest("div").classList.remove("cropping");

    imageElement.src = cropper.getCroppedCanvas().toDataURL("image/png");

    modal.style.display = "none";
  });

  btnSubmit.addEventListener("click", (e) => {

    e.preventDefault();

    e.target.innerText = 'Enviando...';
    e.target.disabled = true;

    const auth = firebase.auth();

    const formAuthRegister = document.getElementById("form-register");
    const values = getFormValues(formAuthRegister);

    auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((response) => {
        if (cropper) {
          cropper.getCroppedCanvas().toBlob((blob) => {
            
            const storage = firebase.storage();

            const fileRef = storage.ref().child(`users/${response.user.uid}.png`);

            cropper.destroy();

            fileRef
              .put(blob)
              .then((snapshot) => window.location.href = "login.html");
          });
        } else {
          window.location.href = "login.html";
        }
      })
      .catch((err) => {
        translateMessage(err.code)
      })
      .finally(() => {
        e.target.innerText = 'Enviar';
        e.target.disabled = false;
      });
  });
});
