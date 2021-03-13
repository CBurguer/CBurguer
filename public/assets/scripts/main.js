import firebase from "./firebase-app";
import { formatCurrency, randomOrderNumber } from "./utils";

document.querySelectorAll("#list-orders").forEach(list => {

  	let uid = null;


	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			uid = user.uid;
			renderPage(list);
		} else {
			location.href = "/login.html";
		}
	});

	const ingredientsAsString = ingredients => {

		let str = '';

		ingredients.forEach(ingredient => {
			str = str + ingredient.name + ', '; 
		});

		return str.substr(0, str.length - 2);
	}

    const renderPage = (context) => {

        const db = firebase.firestore();

        const getOrderPrice = async (orderID) => {

            const doc = await db.collection("payments").doc(orderID).get();
            return doc.data().total;
        };

        const renderOrder = async order => {
			
			const orderData = order.data();

			orderData.price = await getOrderPrice(order.id)
		
			orderData.created = new Date(orderData.created.seconds * 1000).toLocaleDateString("pt-BR");

			orderData.id = randomOrderNumber(0, 10000);

            const li = document.createElement('li');

            li.classList.add('pedidos');

            li.innerHTML = `
                <div id="modal">
                <button class="close">x</button>

                <main class="modal">
                	<h2>Pedido número #${orderData.id}</h2>
                </main>
            </div>

            <div class="id">#${orderData.id}</div>
            <div class="content">
                <div class="title">Detalhes do Pedido</div>
                <ul>
                <li>
                    <span>Data:</span>
                    <span>${orderData.created}</span>
                </li>
                <li>
                    <span>Valor:</span>
                    <span> ${formatCurrency(orderData.price)}</span>
                </li>
                <li>
                    <span>Itens:</span>
                    <span>${orderData.items.length}</span>
                </li>
                <li>
                    <span>N°:</span>
                    <span>${orderData.id}</span>
                </li>
                <li class="liex">
                <div style="display:none" class="idTable">${order.id}</div>
                <button class="btnex">Excluir</button>
                <button class="btncan">Cancelar</button>
                </li>

                </ul>
            </div>
            <div class="actions">
                <button type="button" aria-label="Compartilhar">
                <a target="_blank" href="https://web.whatsapp.com/">
                <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z"
                fill="#070D0D"
                />
                </svg>
                </a>
                </button>
                <button type="button" aria-label="Detalhes" class="detalhes">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M16 2V16H2V2H16ZM17.1 0H0.9C0.4 0 0 0.4 0 0.9V17.1C0 17.5 0.4 18 0.9 18H17.1C17.5 18 18 17.5 18 17.1V0.9C18 0.4 17.5 0 17.1 0ZM8 4H14V6H8V4ZM8 8H14V10H8V8ZM8 12H14V14H8V12ZM4 4H6V6H4V4ZM4 8H6V10H4V8ZM4 12H6V14H4V12Z"
                    fill="#070D0D"
                    />
                </svg>
                </button>
                <button type="button" aria-label="Excluir" class="excluir">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
                    fill="#070D0D"
                    />
                </svg>
                </button>
            </div>`;

			const modal = li.querySelector('main.modal');

			modal.innerHTML = `<h2>Pedido número #${orderData.id}</h2>`;

			orderData.items.forEach((burguer, index) => {

				const breadEl = document.createElement('table');

				breadEl.innerHTML = `
					<tr>
						<th>Hamburguer #${index + 1} - Pão </th>
					</tr>
					<tr>
						<td>${burguer.bread.name}</td>
					</tr>
				`;

				modal.append(breadEl);

				const ingredientsEl = document.createElement('table');

				ingredientsEl.innerHTML = `
					<tr>
						<th>Hamburguer #${index + 1} - Ingredientes</th>
					</tr>
					<tr>
						<td>${ingredientsAsString(burguer.ingredients)}</td>
					</tr>
				`;

				modal.append(ingredientsEl);
			});

            context.append(li);
        };

		const addButtonsEvents = () => {

			let buttonDetalhes = context.querySelectorAll(".detalhes");
			let btnLixeira = context.querySelectorAll(".excluir");

			if (buttonDetalhes.length) {

				let closeBtnModal = document.querySelectorAll(".close");

				if (buttonDetalhes) {

					buttonDetalhes.forEach((btn) => {
						btn.addEventListener("click", (e) => {
						let { parentElement } = e.target;
						let List = parentElement.closest("li");
						let modalID = List.querySelector("#modal");

						modalID.style.opacity = "1";
						modalID.style.zIndex = "55";
						});
					});
				}

				if (closeBtnModal) {

					closeBtnModal.forEach((btn) => {
						btn.addEventListener("click", (e) => {

						let { parentElement } = e.target;
						let List = parentElement.closest("li");
						let modal = List.querySelector("#modal");

						modal.style.opacity = "0";
						modal.style.zIndex = "-55";
						});
					});
				}

				let btnCancelar = document.querySelectorAll(".btncan");
				let btnExcluir = document.querySelectorAll(".btnex");

				btnLixeira.forEach((btn) => {
					btn.addEventListener("click", (e) => {
						let liAct = btn.closest("li");
						let liDel = liAct.querySelector(".liex");
						liDel.classList.add("ex-open");
					});
				});

				btnCancelar.forEach((btn) => {
					btn.addEventListener("click", (e) => {
						let liCan = e.target.parentElement;
						liCan.classList.remove("ex-open");
					});
				});

				btnExcluir.forEach((btn) => {

					btn.addEventListener("click", (e) => {

						let liAct = e.target.parentElement;
						let ulList = liAct.closest("ul");
						let liPai = ulList.closest("li");
						let id = liPai.querySelector(".idTable").innerHTML;

						db.collection("carts")
						.doc(uid)
						.collection("orders")
						.doc(id)
						.delete()
						.then(() => {
							window.location.reload();
							alert("Excluindo com Sucesso");
						})
						.catch((err) => alert("algo deu errado"));
					});
				});
			}
		}

		db.collection("carts")
		.doc(uid)
		.collection("orders")
		.onSnapshot(snap => {

			snap.forEach(order => renderOrder(order));

			setTimeout(addButtonsEvents, 2000);
		});
    };
});
