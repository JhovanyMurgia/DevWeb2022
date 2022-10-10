const tamanhoCelula = 40;
let pecaId = 0;
document.body.append(criaTabuleiro());

function criaTabuleiro() {
	const tamanho = 8;
	let tabela = document.createElement("table");

	tabela.style.borderStyle = "solid";
	tabela.style.borderSpacing = 0;
	tabela.style.margin = "auto";

	for (let i = 0; i < tamanho; i++) {
		let linha = document.createElement("tr");
		linha.id = i + 1;
		tabela.append(linha);
		for (let j = 0; j < tamanho; j++) {
			let celula = document.createElement("td");
			celula.className = "a" + linha.id + "-" + j;
			celula.addEventListener("drop", drop);
			linha.append(celula);

			celula.style.width = `${tamanhoCelula}px`;
			celula.style.height = `${tamanhoCelula}px`;
			if (i % 2 == j % 2) {
				celula.addEventListener("dragover", allowDrop);
				celula.style.backgroundColor = "black";
				if (i * 8 + j <= 24) {
					const peca = criaPeca("black");
					peca.id = `b-i${i}-j${j}`;
					peca.className += " a" + linha.id + "-" + j;
					celula.append(peca);
					celula.removeEventListener("dragover", allowDrop);
				} else if (i * 8 + j >= 40) {
					const peca = criaPeca("red");
					peca.id = `r-i${i}-j${j}`;
					peca.draggable = true;
					peca.className += " a" + linha.id + "-" + j;
					celula.append(peca);
					celula.removeEventListener("dragover", allowDrop);
				}
			} else {
				celula.style.backgroundColor = "white";
			}
		}
	}
	return tabela;
}

function jogadorDaVez() {
	const pecas = document.querySelectorAll(".peca");
	const damas = document.querySelectorAll(".dama");
	damas.forEach(dama => {
		dama.draggable = !dama.draggable
	})
	pecas.forEach((peca) => {
		peca.draggable = !peca.draggable;
	});
}

function criaPeca(cor) {
	let imagem = document.createElement("img");
	imagem.classList.add("peca");
	imagem.setAttribute("src", `${cor}.png`);
	imagem.setAttribute("width", `${tamanhoCelula - 4}px`);
	imagem.setAttribute("height", `${tamanhoCelula - 4}px`);
	imagem.setAttribute("draggable", "false");
	imagem.addEventListener("dragstart", drag);
	return imagem;
}

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("imgid", ev.target.id);
}

function drop(ev) {
	const imgid = ev.dataTransfer.getData("imgid");
	const imagem = document.querySelector(`#${imgid}`);
	imagem.parentElement.addEventListener("dragover", allowDrop);
	const [linhaImagem, colunaImagem] = imagem.classList[1]
		.split("a")[1]
		.split("-");
	const [linhaAlvo, colunaAlvo] = ev.srcElement.className
		.split("a")[1]
		.split("-");
	const distanciaLinha = +linhaAlvo - +linhaImagem;
	const distanciaColuna =+colunaAlvo - +colunaImagem
	if (imagem.classList[0] !== "dama") {
		if (imagem.id[0] === "r" && (distanciaColuna === 1 || distanciaColuna === -1) && distanciaLinha === -1) {
	
			movePeca(ev, imagem, jogadorDaVez);
		}
		if (
			imagem.id[0] === "r" &&
			(distanciaColuna === 2 || distanciaColuna === -2) &&
			(distanciaLinha === -2 || distanciaLinha === 2)
		) {
			comePecaOposta(+linhaImagem, +colunaImagem, "b", ev, imagem, jogadorDaVez);
		}
		if (imagem.id[0] === "b" && (distanciaColuna === 1 || distanciaColuna === -1) && distanciaLinha === 1) {
	
			movePeca(ev, imagem, jogadorDaVez);
		}
		if (
			imagem.id[0] === "b" &&
			(distanciaColuna === 2 || distanciaColuna === -2) &&
			(distanciaLinha === -2 || distanciaLinha === 2)
		) {
			comePecaOposta(+linhaImagem, +colunaImagem, "r", ev, imagem, jogadorDaVez);
		}
	
		if (imagem.id[0] === "r" && +imagem.classList[1].split("a")[1].split("-")[0] === 1) {
			imagem.className = "dama " + imagem.classList[1];
		} else if (imagem.id[0] === "b" && +imagem.classList[1].split("a")[1].split("-")[0] === 8) {
			imagem.className = "dama " + imagem.classList[1];
		}
	} else {
		moveDama(+linhaImagem, +colunaImagem, ev, imagem, jogadorDaVez, distanciaLinha, distanciaColuna);
	}
	
}

function movePeca(ev, imagem, jogadorDaVez) {
	imagem.className = imagem.classList[0] + " " + ev.srcElement.className;
	ev.target.appendChild(imagem);
	ev.target.removeEventListener("dragover", allowDrop);
	jogadorDaVez();
}

function comePecaOposta(linhaImagem, colunaImagem, tipoImagemOposta, ev, imagem, jogadorDaVez) {
	const [linhaAlvo, colunaAlvo] = ev.srcElement.className
		.split("a")[1]
		.split("-");
	let espacoJogo1;
	if (tipoImagemOposta === "b" && imagem.id[0] === "r") {
		if (colunaImagem - colunaAlvo === 2 && linhaImagem - linhaAlvo === 2)
			espacoJogo1 = document.querySelector(
				".a" + (+linhaAlvo + 1) + "-" + (+colunaAlvo + 1)
			);
		if (colunaImagem - colunaAlvo === -2 && linhaImagem - linhaAlvo === 2)
			espacoJogo1 = document.querySelector(
				".a" + (+linhaAlvo + 1) + "-" + (+colunaAlvo - 1)
			);
		if (colunaImagem - colunaAlvo === -2 && linhaImagem - linhaAlvo === -2)
			espacoJogo1 = document.querySelector(
				".a" + (+linhaAlvo - 1) + "-" + (+colunaAlvo - 1)
			);
		if (colunaImagem - colunaAlvo === 2 && linhaImagem - linhaAlvo === -2) {
			espacoJogo1 = document.querySelector(
				".a" + (+linhaAlvo - 1) + "-" + (+colunaAlvo + 1)
			);
		}
	}

	if (tipoImagemOposta === "r" && imagem.id[0] === "b") {
		if (colunaImagem - colunaAlvo === 2 && linhaImagem - linhaAlvo === -2) {
			espacoJogo1 = document.querySelector(
				".a" + (+linhaAlvo - 1) + "-" + (+colunaAlvo + 1)
			);
		}
		else if (colunaImagem - colunaAlvo === -2 && linhaImagem - linhaAlvo === -2) {
			espacoJogo1 = document.querySelector(
				".a" + (+linhaAlvo - 1) + "-" + (+colunaAlvo - 1)
			);
		}
		else if (colunaImagem - colunaAlvo === -2 && linhaImagem - linhaAlvo === 2) {
			espacoJogo1 = document.querySelector(
				".a" + (+linhaAlvo + 1) + "-" + (+colunaAlvo - 1)
			);
		}
		if (colunaImagem - colunaAlvo === 2 && linhaImagem - linhaAlvo === 2) {
			espacoJogo1 = document.querySelector(
				".a" + (+linhaAlvo + 1) + "-" + (+colunaAlvo + 1)
			);
		}
	}
	if (espacoJogo1) {
		let peca;
		document.querySelector(".peca." + espacoJogo1.className) ? peca = document.querySelector(".peca." + espacoJogo1.className) :
		peca = document.querySelector(".dama." + espacoJogo1.className) 
		
    if (peca.id[0] == "r" && imagem.id[0] === "b" || peca.id[0] == "b" && imagem.id[0] === "r" ) {
      peca.setAttribute("draggable", "false");
	  espacoJogo1.addEventListener("dragover", allowDrop);
      peca.parentNode.removeChild(peca);

      movePeca(ev, imagem, jogadorDaVez);
    }
    
	}
}

