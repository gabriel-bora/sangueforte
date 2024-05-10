const express = require("express");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const bp = require("body-parser");
require("dotenv").config();

const sequelize = new Sequelize("projeto-cap", "root", "DlInp7fijIPm2ZdUckJ8", {
  host: "database-sangueforte.cvi642ueg72x.us-east-1.rds.amazonaws.com",
  port: 3306,
  dialect: "mysql",
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bp.json({ limit: "50mb" }));
app.use(bp.urlencoded({ limit: "50mb", extended: true }));

const jogo = sequelize.define(
  "jogo",
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
  sequelize.query("select * from jogos;").then((data) => {
    res.send(data);
  });
});

const usuario = sequelize.define(
  "usuario",
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
  usuario.findOne({ where: { email: req.body.email } }).then((data) => {
    if (data == null) {
      usuario
        .create({
          email: req.body.email,
        })
        .then(() => {
          usuario.findOne({ where: { email: req.body.email } }).then((data) => {
            res.send(data);
          });
        });
    } else {
      res.send(data);
    }
  });
});

app.post("/updateUser", (req, res) => {
  usuario.update(
    { array_jogos: req.body.array_jogos },
    { where: { email: req.body.email } }
  );
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Rodando servidor");
});
