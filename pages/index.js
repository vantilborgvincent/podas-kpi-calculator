import { useState } from "react";
import emailjs from "emailjs-com";

export default function Home() {
  const [step, setStep] = useState("start");
  const [sector, setSector] = useState("");
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState({});

  const sectors = ["Groothandel & Distributie", "Andere / Algemeen"];

  const handleSectorSelect = (selectedSector) => {
    setSector(selectedSector);
    setStep("kpi");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateKPI = () => {
    let calc = {};
    if (sector === "Groothandel & Distributie") {
      const marge = ((formData.omzet - formData.kostprijs) / formData.omzet) * 100;
      const leverbetrouwbaarheid = (formData.opTijd / formData.totaalLeveringen) * 100;
      const stockrotatie = formData.verkocht / formData.voorrraad;
      calc = { 
        marge: marge.toFixed(2) + " %", 
        leverbetrouwbaarheid: leverbetrouwbaarheid.toFixed(2) + " %", 
        stockrotatie: stockrotatie.toFixed(2) 
      };
    } else if (sector === "Andere / Algemeen") {
      const facturatiegraad = (formData.factBinnen30 / formData.factTotaal) * 100;
      calc = { 
        facturatiegraad: facturatiegraad.toFixed(2) + " %", 
        manueleRegistraties: formData.manueleRegistraties, 
        dataBeschikbaarheid: formData.dataBeschikbaarheid + " %" 
      };
    }
    setResults(calc);
    setStep("results");
  };

  const sendEmail = () => {
    const templateParams = {
      sector: sector,
      company: formData.company || "",
      user_name: formData.name || "",
      user_email: formData.email || "",
      user_phone: formData.phone || "",
      results: JSON.stringify(results, null, 2),
      kpi1_access: formData.kpi1_access || "",
      kpi2_access: formData.kpi2_access || "",
      kpi3_access: formData.kpi3_access || "",
    };

    emailjs
      .send("service_sdzz11f", "template_guwz73d", templateParams, "-FsQ2G8CmhnyhIQZW")
      .then(() => {
        setStep("thankyou");
      })
      .catch((error) => console.error("Email error:", error));
  };

  if (step === "start") {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>Hoe goed kent u uw kerncijfers?</h1>
        <p>Bereken uw belangrijkste KPI’s per sector en ontdek hoe makkelijk deze inzichten bij u beschikbaar zijn.</p>
        <button onClick={() => setStep("sector")}>Start de KPI-check</button>
      </div>
    );
  }

  if (step === "sector") {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>In welke sector is uw bedrijf actief?</h2>
        {sectors.map((s) => (
          <button key={s} onClick={() => handleSectorSelect(s)} style={{ margin: 10 }}>
            {s}
          </button>
        ))}
      </div>
    );
  }

  if (step === "kpi") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Sector: {sector}</h2>
        {sector === "Groothandel & Distributie" ? (
          <>
            <p>Omzet (€):</p>
            <input name="omzet" type="number" onChange={handleInputChange} />
            <p>Kostprijs (€):</p>
            <input name="kostprijs" type="number" onChange={handleInputChange} />
            <p>Hoe makkelijk had u deze data beschikbaar?</p>
            <select name="kpi1_access" onChange={handleInputChange}>
              <option value="">Selecteer...</option>
              <option value="Direct uit systeem">🟢 Direct uit systeem</option>
              <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
              <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
            </select>

            <p>Aantal leveringen:</p>
            <input name="totaalLeveringen" type="number" onChange={handleInputChange} />
            <p>Aantal op tijd geleverd:</p>
            <input name="opTijd" type="number" onChange={handleInputChange} />
            <p>Hoe makkelijk had u deze data beschikbaar?</p>
            <select name="kpi2_access" onChange={handleInputChange}>
              <option value="">Selecteer...</option>
              <option value="Direct uit systeem">🟢 Direct uit systeem</option>
              <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
              <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
            </select>

            <p>Verkochte aantallen:</p>
            <input name="verkocht" type="number" onChange={handleInputChange} />
            <p>Gemiddelde voorraad:</p>
            <input name="voorrraad" type="number" onChange={handleInputChange} />
            <p>Hoe makkelijk had u deze data beschikbaar?</p>
            <select name="kpi3_access" onChange={handleInputChange}>
              <option value="">Selecteer...</option>
              <option value="Direct uit systeem">🟢 Direct uit systeem</option>
              <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
              <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
            </select>
          </>
        ) : (
          <>
            <p>Totaal facturatiebedrag (€):</p>
            <input name="factTotaal" type="number" onChange={handleInputChange} />
            <p>Gefactureerd binnen 30 dagen (€):</p>
            <input name="factBinnen30" type="number" onChange={handleInputChange} />
            <p>Hoe makkelijk had u deze data beschikbaar?</p>
            <select name="kpi1_access" onChange={handleInputChange}>
              <option value="">Selecteer...</option>
              <option value="Direct uit systeem">🟢 Direct uit systeem</option>
              <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
              <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
            </select>

            <p>Manuele registraties per week:</p>
            <input name="manueleRegistraties" type="number" onChange={handleInputChange} />
            <p>Hoe makkelijk had u deze data beschikbaar?</p>
            <select name="kpi2_access" onChange={handleInputChange}>
              <option value="">Selecteer...</option>
              <option value="Direct uit systeem">🟢 Direct uit systeem</option>
              <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
              <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
            </select>

            <p>% beschikbare data voor kernrapportage:</p>
            <input name="dataBeschikbaarheid" type="number" onChange={handleInputChange} placeholder="%" />
            <p>Hoe makkelijk had u deze data beschikbaar?</p>
            <select name="kpi3_access" onChange={handleInputChange}>
              <option value="">Selecteer...</option>
              <option value="Direct uit systeem">🟢 Direct uit systeem</option>
              <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
              <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
            </select>
          </>
        )}
        <button onClick={calculateKPI} style={{ marginTop: 20 }}>Bekijk mijn resultaten</button>
      </div>
    );
  }

  if (step === "results") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Resultaten</h2>
        <pre>{JSON.stringify(results, null, 2)}</pre>

        <h3>Lead capture:</h3>
        <p>Bedrijfsnaam:</p>
        <input name="company" onChange={handleInputChange} />
        <p>Naam contactpersoon:</p>
        <input name="name" onChange={handleInputChange} />
        <p>E-mailadres:</p>
        <input name="email" onChange={handleInputChange} />
        <p>Telefoonnummer (optioneel):</p>
        <input name="phone" onChange={handleInputChange} />

        <button onClick={sendEmail} style={{ marginTop: 20 }}>Verstuur mijn KPI-resultaten</button>
      </div>
    );
  }

  if (step === "thankyou") {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Bedankt voor het invullen!</h2>
        <p>U ontvangt uw resultaten binnenkort per e-mail. Wij nemen graag contact met u op om deze te bespreken.</p>
      </div>
    );
  }
}
