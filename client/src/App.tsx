import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import brasileiro from "../src/assets/brasileiro.png";
import cdb from "../src/assets/cdb.png";
import paranaense from "../src/assets/paranaense.png";
import sula from "../src/assets/sula.png";
import gmail from "../src/assets/icons8-gmail.svg";
import instagram from "../src/assets/icons8-instagram.svg";
import x from "../src/assets/icons8-x.svg";
import loading from "../src/assets/loading.gif";
import camisas from "../src/assets/camisas.png";

function App() {
  const baseUrl: string = "https://sangueforte.onrender.com";

  interface Jogo {
    idjogo: number;
    competicao: string;
    data: string;
    time_adv: string;
    escudo_adv: string;
    letras_adv: string;
    valido: string;
  }

  const [email, setEmail] = useState<string>("");

  const [jogosUsuario, setJogosUsuario] = useState<number>(0);

  function login(e: any) {
    e.preventDefault();
    axios
      .post(baseUrl + "/login", {
        email: email,
      })
      .then((response) => {
        let divConsulta = document.querySelector("#consulta") as HTMLDivElement;
        let divJogos = document.querySelector("#jogos") as HTMLDivElement;
        let divLoading = document.querySelector("#loading") as HTMLDivElement;
        let body = document.querySelector("#bg") as HTMLDivElement;
        divConsulta.style.display = "none";
        divLoading.style.display = "block";
        sessionStorage.setItem("usuario-logado", response.data.email);
        let listaJogosUsuario: Array<number> = [];
        listaJogosUsuario = JSON.parse(response.data.array_jogos);
        sessionStorage.setItem(
          "array_jogos",
          JSON.stringify(listaJogosUsuario)
        );
        setJogosUsuario(
          JSON.parse(sessionStorage.getItem("array_jogos")!).length
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
          const hoje = new Date("2024-10-20");
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
        window.setTimeout(() => {
          divLoading.style.display = "none";
          divJogos.style.display = "flex";
          body.style.overflowY = "scroll";
        }, 1000);
      });
  }

  const [listJogos, setListJogos] = useState();

  useEffect(() => {
    axios.get(baseUrl + "/getAllJogos").then((response) => {
      setListJogos(response.data[0]);
    });
    document.onvisibilitychange = () => {
      let usuarioLogado: string = sessionStorage.getItem("usuario-logado")!;
      if (document.visibilityState === "hidden") {
        axios.post(baseUrl + "/updateUser", {
          email: usuarioLogado,
          array_jogos: sessionStorage.getItem("array_jogos"),
        });
        sessionStorage.clear;
      }
    };
  }, []);

  let listaJogos: Array<Jogo> = [];
  if (listJogos == null) {
    listaJogos = [];
  } else {
    listaJogos = listJogos;
    listaJogos = listaJogos.sort(function compare(a, b) {
      return new Date(a.data).getTime() - new Date(b.data).getTime();
    });
  }

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

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
      jogosChecked.push(id);
      if (jogosChecked.length == 25) {
        setOpen(true);
      }
      sessionStorage.setItem("array_jogos", JSON.stringify(jogosChecked));
    } else {
      divJogo.style.border = "2px solid transparent";
      divJogo.style.boxShadow = "0 0 0 0";
      let index: number = jogosChecked.indexOf(id);
      jogosChecked.splice(index, 1);
      sessionStorage.setItem("array_jogos", JSON.stringify(jogosChecked));
    }
    setJogosUsuario(JSON.parse(sessionStorage.getItem("array_jogos")!).length);
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

  function logoCompeticao(competicao: string) {
    switch (competicao) {
      case "brasileiro":
        return brasileiro;
      case "cdb":
        return cdb;
      case "paranaense":
        return paranaense;
      case "sula":
        return sula;
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

  function jogosValidos(lista: Array<Jogo>) {
    let total: number = 0;
    lista.forEach((element) => {
      const date = new Date(element.data);
      const hoje = new Date();
      if (element.valido === "s" && date < hoje) {
        total = total + 1;
      }
    });
    return total;
  }

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#181818",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <div id="consulta">
        <h2>TABELA DE JOGOS DO ANO</h2>
        <h1>CONSULTE SUA FREQUÊNCIA</h1>
        <form className="form">
          <input
            type="text"
            placeholder="Informe seu e-mail"
            autoFocus
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>{" "}
          <button className="button" onClick={login}>
            <span id="pesquisar"> Pesquisar </span>
          </button>
        </form>
        <small>*Utilize sempre o mesmo e-mail</small>
      </div>
      <div id="loading">
        <img id="gif-loading" src={loading} alt="" />
      </div>
      <div id="jogos">
        <h2>TABELA DE JOGOS DO ANO</h2>
        <h3>MARQUE OS JOGOS QUE COMPARECEU</h3>
        {listaJogos.map((value) => (
          <div key={value.idjogo} className="check-jogo">
            <label
              id={"label-checkbox" + value.idjogo}
              className="form-checkbox"
            >
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
                  <img src={logoCompeticao(value.competicao)}></img>
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
              <div className="data">
                {value.time_adv == "ypiranga"
                  ? "data indefinida"
                  : dataExtenso(value.data)}
              </div>
              <small>{jogoValido(value.valido, value.data)}</small>
            </div>
          </div>
        ))}
        <h4>
          total de jogos válidos{" "}
          <small>
            &#40;até{" "}
            {new Date().getDate().toString().padStart(2, "0") +
              "/" +
              (new Date().getMonth() + 1).toString().padStart(2, "0")}
            &#41;
          </small>
          : {jogosValidos(listaJogos)}
        </h4>
        <h6>total de jogos que fui: {jogosUsuario}</h6>
        {jogosUsuario >= 25 ? (
          <h5>JOGOS QUE FALTAM PARA GANHAR A CAMISA: 0</h5>
        ) : (
          <h5>JOGOS QUE FALTAM PARA GANHAR A CAMISA: {25 - jogosUsuario}</h5>
        )}
      </div>
      <footer>
        <Button onClick={handleClick}>Desenvolvido por GB</Button>
        <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Typography sx={{ p: 2 }}>
            <a href="https://www.instagram.com/gabriel_bora" target="_blank">
              <img src={instagram} alt="" />
            </a>
            <a href="https://twitter.com/gabriel_bora" target="_blank">
              <img src={x} alt="" />
            </a>
            <a href="mailto:gabriel.bora.10@gmail.com" target="_blank">
              <img src={gmail} alt="" />
            </a>
          </Typography>
        </Popover>
      </footer>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            PARABÉNS!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Você atingiu o número de jogos necessário para receber o voucher.
            <img className="camisas" src={camisas}></img>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default App;
