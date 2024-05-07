import { useEffect, useState } from "react";
import axios from "axios";

function Jogos() {
  interface Jogo {
    idjogo: number;
    competicao: string;
    data: string;
    time_adv: string;
    escudo_adv: string;
    letras_adv: string;
    valido: string;
  }

  const [listJogos, setListJogos] = useState();

  useEffect(() => {
    axios.get("http://localhost:3001/getAllJogos").then((response) => {
      setListJogos(response.data[0]);
    });
  }, []);

  let listaJogos: Array<Jogo> = [];
  if (listJogos == null) {
    listaJogos = [];
  } else {
    listaJogos = listJogos;
  }

  useEffect(() => {
    let listaJogosUsuario: Array<number> = [];
    let usuarioLogado: string = sessionStorage.getItem("usuario-logado")!;
    axios
      .post("http://localhost:3001/login", {
        email: usuarioLogado,
      })
      .then((response) => {
        listaJogosUsuario = JSON.parse(response.data.array_jogos);
        sessionStorage.setItem(
          "array_jogos",
          JSON.stringify(listaJogosUsuario)
        );
        listaJogos.map((value) => {
          let inputSeletor = document.querySelector(
            "#seletor-jogo" + value.idjogo
          ) as HTMLInputElement;
          let escudoCAP = document.querySelector(
            "#escudocap" + value.idjogo
          ) as HTMLImageElement;
          let escudoADV = document.querySelector(
            "#escudoadv" + value.idjogo
          ) as HTMLImageElement;
          let formCheckbox = document.querySelector(
            "#label-checkbox" + value.idjogo
          ) as HTMLLabelElement;
          const data = new Date(value.data);
          const hoje = new Date();
          if (value.valido === "n" || data >= hoje) {
            inputSeletor.disabled = true;
            formCheckbox.style.cursor = "not-allowed";
            escudoCAP.style.filter = "grayscale(1)";
            escudoADV.style.filter = "grayscale(1)";
          }
          let divJogo = document.querySelector(
            "#info-jogo" + value.idjogo
          ) as HTMLDivElement;
          if (listaJogosUsuario.indexOf(value.idjogo) != -1) {
            inputSeletor.checked = true;
            divJogo.style.border = "2px solid #c8102e";
            divJogo.style.boxShadow = "0 0 10px 3px #c8102e";
          }
        });
      });
    document.onvisibilitychange = () => {
      let usuarioLogado: string = sessionStorage.getItem("usuario-logado")!;
      if (document.visibilityState === "hidden") {
        axios.post("http://localhost:3001/updateUser", {
          email: usuarioLogado,
          array_jogos: sessionStorage.getItem("array_jogos"),
        });
      }
    };
  });

  function selecionar_jogo(id: number) {
    let jogosChecked: Array<number> =
      JSON.parse(sessionStorage.getItem("array_jogos")!) || [];
    let inputSeletor = document.querySelector(
      "#seletor-jogo" + id
    ) as HTMLInputElement;
    let divJogo = document.querySelector("#info-jogo" + id) as HTMLDivElement;
    if (inputSeletor.checked == true) {
      divJogo.style.border = "2px solid #c8102e";
      divJogo.style.boxShadow = "0 0 10px 3px #c8102e";
    } else {
      divJogo.style.border = "2px solid transparent";
      divJogo.style.boxShadow = "0 0 0 0";
    }
    if (inputSeletor.checked === true) {
      jogosChecked.push(id);
      sessionStorage.setItem("array_jogos", JSON.stringify(jogosChecked));
    }
    if (inputSeletor.checked === false) {
      let index: number = jogosChecked.indexOf(id);
      jogosChecked.splice(index, 1);
      sessionStorage.setItem("array_jogos", JSON.stringify(jogosChecked));
    }
  }

  function switchCompeticao(competicao: string) {
    switch (competicao) {
      case "paranaense":
        return "campeonato paranaense";
      case "sula":
        return "copa sul-americana";
      case "brasileiro":
        return "campeonato brasileiro";
      case "cdb":
        return "copa do brasil";
    }
  }

  function jogoValido(valido: string, data: string) {
    if (valido === "n") {
      return "*Jogo não é válido para a promoção Sangue Forte";
    }
    const date = new Date(data);
    const hoje = new Date();
    if (date >= hoje) {
      return "*Jogo ainda não aconteceu";
    }
  }

  function dataExtenso(data: string) {
    const date = new Date(data);
    let diaSemana = date.getDay();
    let dia = date.getDate().toString().padStart(2, "0");
    let mes = date.getMonth();
    let ano = date.getFullYear();
    let diaSemanaExtenso: string = "";
    let mesExtenso: string = "";

    switch (diaSemana) {
      case 0:
        diaSemanaExtenso = "domingo";
        break;
      case 1:
        diaSemanaExtenso = "segunda-feira";
        break;
      case 2:
        diaSemanaExtenso = "terça-feira";
        break;
      case 3:
        diaSemanaExtenso = "quarta-feira";
        break;
      case 4:
        diaSemanaExtenso = "quinta-feira";
        break;
      case 5:
        diaSemanaExtenso = "sexta-feira";
        break;
      case 6:
        diaSemanaExtenso = "sábado";
        break;
    }

    switch (mes) {
      case 0:
        mesExtenso = "janeiro";
        break;
      case 1:
        mesExtenso = "fevereiro";
        break;
      case 2:
        mesExtenso = "março";
        break;
      case 3:
        mesExtenso = "abril";
        break;
      case 4:
        mesExtenso = "maio";
        break;
      case 5:
        mesExtenso = "junho";
        break;
      case 6:
        mesExtenso = "julho";
        break;
      case 7:
        mesExtenso = "agosto";
        break;
      case 8:
        mesExtenso = "setembro";
        break;
      case 9:
        mesExtenso = "outubro";
        break;
      case 10:
        mesExtenso = "novembro";
        break;
      case 11:
        mesExtenso = "dezembro";
        break;
    }

    let dataCompleta: string =
      diaSemanaExtenso + ", " + dia + " de " + mesExtenso + " de " + ano;

    return dataCompleta;
  }

  return (
    <>
      <h2>TABELA DE JOGOS DO ANO</h2>
      <h3>MARQUE OS JOGOS QUE COMPARECEU</h3>
      {listaJogos.map((value) => (
        <div key={value.idjogo} className="check-jogo">
          <label id={"label-checkbox" + value.idjogo} className="form-checkbox">
            <input
              type="checkbox"
              value="1"
              className="seletor-jogo"
              id={"seletor-jogo" + value.idjogo}
              onClick={() => selecionar_jogo(value.idjogo)}
            ></input>
            <span className="checkmark"></span>
          </label>
          <div className="info-jogo" id={"info-jogo" + value.idjogo}>
            <div className="campeonato">
              <div className="campeonato__imagem">
                <img src={"/src/assets/" + value.competicao + ".png"}></img>
              </div>{" "}
              <span>{switchCompeticao(value.competicao)} 2024</span>
            </div>{" "}
            <div className="jogo">
              <div className="time">
                <div className="nome">CAP</div>{" "}
                <img
                  id={"escudocap" + value.idjogo}
                  src="https://api-sociofuracao-com.s3.sa-east-1.amazonaws.com/prod/clubes/3_cap2.png"
                ></img>
              </div>{" "}
              <div className="separador">X</div>{" "}
              <div className="time visitante">
                <img
                  id={"escudoadv" + value.idjogo}
                  src={value.escudo_adv}
                ></img>{" "}
                <div className="nome">{value.letras_adv}</div>
              </div>
            </div>{" "}
            <div className="data">{dataExtenso(value.data)}</div>
            <small>{jogoValido(value.valido, value.data)}</small>
          </div>
        </div>
      ))}
    </>
  );
}

export default Jogos;
