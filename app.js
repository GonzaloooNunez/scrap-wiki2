const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap";

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const urls = []; //Aquí accedemos a las distintas URLS para extraer los datos
    $("#mw-pages a").each((index, element) => {
      const url = $(element).attr("href");
      urls.push(url);
    });

    const data = [];
    for (const url of urls) {
      const response = await axios.get(`https://es.wikipedia.org${url}`);
      const html = response.data;
      const $ = cheerio.load(html);

      const Artista = $("h1").text();

      const Imagenes = [];
      $("img").each((index, element) => {
        const src = $(element).attr("src");
        Imagenes.push(src);
      });

      const texts = [];

      let allTexts = "";
      $("p").each((index, element) => {
        const text = $(element).text();
        allTexts += text + " ";
      });

      data.push({ Artista, Imagenes, texts: allTexts.trim() });
    }

    res.json(data);
  } catch (error) {
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log(`Express se esta escuchando en el puerto 3000`);
});
