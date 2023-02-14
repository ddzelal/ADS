const express = require('express');
const app = express();
const xml2js = require('xml2js');
const fs = require('fs');
const cors = require('cors');

// Do ove linije se nalaze svi importi tacnije biblioteke koje sam koristio za projekat

app.use(cors({ allowedHeaders: '*' }));

app.use(express.json());

app.get('/oglasi', async (req, res) => {
  // Ovo je prva i ostanova ruta koja je Get i ona povlaci sve oglase iz naseg oglasi.xml fajla

  let dataOglasi = null;
  await fs.readFile('oglasi.xml', 'utf-8', (err, data) => {
    //  Ovde citame nas xml fajl i parsujemo iz xml u js objekat i to saljemo na nasoj client stranici
    const ogl = xml2js.parseString(data, (err, result) => {
      dataOglasi = result.oglasi.oglas;
      res.send(dataOglasi);
    });
  });
});

app.delete('/oglasi/:index', async (req, res) => {
  // Ovo je ruta za brisanje naseg oglasa kroz parametre mi saljemo index i tako iz naseg xml fajla brisemo elemenat koji odgovara ovom indexu
  let dataOglasi = null;
  await fs.readFile('oglasi.xml', 'utf-8', (err, data) => {
    xml2js.parseString(data, (err, result) => {
      // Ponovo citamo nase xml fajlove

      dataOglasi = result.oglasi.oglas;
      const index = parseInt(req.params.index, 10);
      dataOglasi.splice(index, 1);

      // Ovde brisemo iz naseg niza samo jedan element od indexa kojeg smo poslali kao params

      const builder = new xml2js.Builder();

      // Pa sad nas niz convertujemo u xml podatke i tako ih upisujemo
      const xml = builder.buildObject({ oglasi: { oglas: dataOglasi } });
      fs.writeFile('oglasi.xml', xml, (err) => {
        if (err) {
          return res.status(500).send({ error: 'Greska pri brisanju oglasa.' });
        }
        return res.send({ success: true });
      });
    });
  });
});

app.put('/oglasi/:id', async (req, res) => {
  // kroz sam request mi saljemo id oglasa kojeg zelimo da izmenimo za to nam sluzi metoda PUT
  let dataOglasi = null;

  await fs.readFile('oglasi.xml', 'utf-8', (err, data) => {
    xml2js.parseString(data, (err, result) => {
      dataOglasi = result.oglasi.oglas;
      const id = Number(req.params.id);

      if (dataOglasi[id] === -1) {
        return res.status(404).send({ error: 'Oglas nije pronadjen.' });
      }
      // kad smo vec uzeli sve elemente iz naseg xml fajla sad imamo i id sa kojim cemo tacno znati koji element menjamo
      dataOglasi[id].kategorija = [req.body.kategorija];
      dataOglasi[id].tekst = [req.body.tekst];
      dataOglasi[id].cena = [req.body.cena];
      dataOglasi[id].datumIstekaDan = [req.body.datumIstekaDan];
      dataOglasi[id].datumIstekaMesec = [req.body.datumIstekaMesec];
      dataOglasi[id].email = [req.body.email];
      dataOglasi[id].oznake = [req.body.oznake];
      dataOglasi[id].id = [req.params.id];

      const builder = new xml2js.Builder();

      // ponovo covertujemo nase podatke u xml podatke i tako ih upisujemo
      const xml = builder.buildObject({ oglasi: { oglas: dataOglasi } });
      fs.writeFile('oglasi.xml', xml, (err) => {
        if (err) {
          return res.status(500).send({ error: 'Greska pri izmeni oglasa.' });
        }
        return res.send({ success: true });
      });
    });
  });
});

app.post('/oglasi', async (req, res) => {
  // Metoda post koja kroz body prima objekat sa podacimo oglasa i metodom post mi cemo napraviti nas oglas
  let dataOglasi = null;
  await fs.readFile('oglasi.xml', 'utf-8', (err, data) => {
    xml2js.parseString(data, (err, result) => {
      // kad procitamo xml fajl ovde proveravamo je l nas xml fajl prazan u slucaju da jeste pravimo niz a ako nije na postojeci dodajemo
      if (!result || !result.oglasi || !result.oglasi.oglas) {
        dataOglasi = [];
      } else {
        dataOglasi = result.oglasi.oglas;
      }

      dataOglasi.push({
        kategorija: [req.body.kategorija],
        tekst: [req.body.tekst],
        cena: [req.body.cena],
        datumIstekaDan: [req.body.datumIstekaDan],
        datumIstekaMesec: [req.body.datumIstekaMesec],
        email: [req.body.email],
        oznake: [req.body.oznake],
        id: [req.body.id],
      });

      // i naravno ovde pushamo nas element u niz
      const builder = new xml2js.Builder();
      // nakon toga ovde covertujemo i upisujemo u nas xml fajl!
      const xml = builder.buildObject({ oglasi: { oglas: dataOglasi } });
      fs.writeFile('oglasi.xml', xml, (err) => {
        if (err) {
          return res
            .status(500)
            .send({ error: 'Greska pri dodavanju oglasa.' });
        }
        return res.send({ success: true });
      });
    });
  });
});

app.listen(3000, () => {
  console.log('Server slusa na port 3000');
});
