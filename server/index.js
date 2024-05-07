const express = require("express");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const bp = require("body-parser");

const sequelize = new Sequelize("projeto-cap", "root", "root123", {
  host: "localhost",
  dialect: "mysql",
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bp.json({ limit: "50mb" }));
app.use(bp.urlencoded({ limit: "50mb", extended: true }));

const Jogo = sequelize.define(
  "Jogo",
  {
    idJogo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    competicao: DataTypes.STRING,
    data: DataTypes.DATE,
    time_adv: DataTypes.STRING,
    escudo_adv: DataTypes.STRING,
    letras_adv: DataTypes.STRING,
    valido: DataTypes.STRING,
  },
  {
    timestamps: false,
  }
);

app.get("/getAllJogos", (req, res) => {
  sequelize.query("SELECT * FROM JOGOS;").then((data) => {
    res.send(data);
  });
});

const Usuario = sequelize.define(
  "Usuario",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    array_jogos: {
      type: DataTypes.STRING,
      defaultValue: "[]",
    },
  },
  {
    timestamps: false,
  }
);

app.post("/login", (req, res) => {
  Usuario.findOne({ where: { email: req.body.email } }).then((data) => {
    if (data == null) {
      Usuario.create({
        email: req.body.email,
      }).then(() => {
        Usuario.findOne({ where: { email: req.body.email } }).then((data) => {
          res.send(data);
        });
      });
    } else {
      res.send(data);
    }
  });
});

app.post("/updateUser", (req, res) => {
  Usuario.update(
    { array_jogos: req.body.array_jogos },
    { where: { email: req.body.email } }
  );
});

app.listen(3001, () => {
  console.log("Rodando servidor");
});
